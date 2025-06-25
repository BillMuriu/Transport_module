from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.db import transaction
import uuid
from django.utils import timezone
from students.models import Student
from .models import Message, MessageTemplate
from .utils import send_bulk_sms_via_mobile_sasa
from .serializers import MessageSerializer, MessageTemplateSerializer

class MessageListView(generics.ListAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer



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
        ).values_list("parent_phone", flat=True)

        if not students:
            return Response(
                {"error": "No students found for the specified grade level."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Deduplicate phone numbers
        unique_phones = list(set(students))

        # Send in batches of 40
        batch_size = 40
        all_success = True
        results = []

        for i in range(0, len(unique_phones), batch_size):
            batch = unique_phones[i:i + batch_size]
            success, result = send_bulk_sms_via_mobile_sasa(batch, message_content)
            results.append(result)
            if not success:
                all_success = False
                break

        # Save messages to DB
        status_to_use = "sent" if all_success else "failed"
        message_records = [
            Message(
                message_id=str(uuid.uuid4()),
                sender="System",
                recipient=phone,
                msg_type=message_type,
                message_content=message_content,
                cost=0.5,
                network="Safaricom",  # Optional: implement detection logic later
                status=status_to_use,
                description=f"Bulk message to {grade_level}",
                date=timezone.now()
            )
            for phone in unique_phones
        ]

        with transaction.atomic():
            Message.objects.bulk_create(message_records, batch_size=1000)

        return Response({
            "message": "Messages sent" if all_success else "Some messages failed",
            "details": results,
            "success_count": len(unique_phones) if all_success else 0,
            "total_processed": len(unique_phones),
            "success": all_success
        }, status=status.HTTP_200_OK if all_success else status.HTTP_207_MULTI_STATUS)

class MessageTemplateViewSet(generics.ListCreateAPIView):
    queryset = MessageTemplate.objects.all()
    serializer_class = MessageTemplateSerializer

class MessageTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MessageTemplate.objects.all()
    serializer_class = MessageTemplateSerializer
