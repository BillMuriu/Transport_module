from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import uuid
from django.utils import timezone
from students.models import Student
from .models import Message
from .utils import send_bulk_sms_via_mobile_sasa


class SendBulkGradeMessageView(APIView):
    """
    Send a bulk SMS message to all parents of students in a specific grade level.
    """

    def post(self, request):
        grade_level = request.data.get("grade_level")
        message_type = request.data.get("msg_type")
        message_content = request.data.get("content")

        if not grade_level or not message_type or not message_content:
            return Response(
                {"error": "grade_level, msg_type, and content are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        students = Student.objects.filter(
            class_name=grade_level,
            parent_phone__isnull=False,
            parent_phone__gt=""
        ).values("id", "parent_phone", "first_name", "last_name")

        if not students:
            return Response(
                {"error": "No students found for the specified grade level."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Deduplicate phone numbers
        unique_phones = set()
        messages_to_send = []

        for student in students:
            phone = student["parent_phone"]
            if phone in unique_phones:
                continue

            unique_phones.add(phone)

            messages_to_send.append({
                "phone": phone,
                "message": message_content
            })

        # Send SMS in batches
        batch_size = 40
        all_success = True
        results = []

        for i in range(0, len(messages_to_send), batch_size):
            batch = messages_to_send[i:i + batch_size]
            success, result = send_bulk_sms_via_mobile_sasa(batch)
            results.append(result)

            if not success:
                all_success = False
                break  # or continue if you want to try the rest

        # Save messages to DB
        status_to_use = "sent" if all_success else "failed"

        message_records = [
            Message(
                message_id=str(uuid.uuid4()),
                sender="System",
                recipient=msg["phone"],
                msg_type=message_type,
                message_content=msg["message"],
                cost=0.5,  # or fetch dynamically
                network="Safaricom",  # optional placeholder
                status=status_to_use,
                description=f"Bulk message to {grade_level}",
                date=timezone.now()
            )
            for msg in messages_to_send
        ]

        with transaction.atomic():
            Message.objects.bulk_create(message_records, batch_size=1000)

        return Response({
            "message": "Messages sent" if all_success else "Some messages failed",
            "details": results,
            "success_count": len(messages_to_send) if all_success else 0,
            "total_processed": len(messages_to_send),
            "success": all_success
        }, status=status.HTTP_200_OK if all_success else status.HTTP_207_MULTI_STATUS)
