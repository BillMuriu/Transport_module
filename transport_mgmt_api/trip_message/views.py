from rest_framework import generics
from .models import TripMessage
from .serializers import TripMessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import SendTripMessageSerializer
from .utils import send_sms_via_gateway, generate_trip_message_content 
from students.models import Student
from django.db import transaction
from trips.models import Trip
from .models import TripMessage, Status

class TripMessageListCreateView(generics.ListCreateAPIView):
    queryset = TripMessage.objects.all()
    serializer_class = TripMessageSerializer

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()

class TripMessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TripMessage.objects.all()
    serializer_class = TripMessageSerializer



class SendTripMessageView(APIView):
    def post(self, request):
        serializer = SendTripMessageSerializer(data=request.data)
        if serializer.is_valid():
            student_id = serializer.validated_data['student_id']
            trip_id = serializer.validated_data['trip_id']

            # Get the student and trip
            student = get_object_or_404(Student, id=student_id)
            trip = get_object_or_404(Trip, id=trip_id)
            student_name = student.first_name  # Assuming the Student model has a first_name field

            # Generate message content based on trip action (pickup or dropoff)
            if getattr(trip, "trip_action", None) == "pickup":
                message_type = "board"
                content = generate_trip_message_content(student_name, 'pickup')
            elif getattr(trip, "trip_action", None) == "dropoff":
                message_type = "alight"
                content = generate_trip_message_content(student_name, 'dropoff')

            # Get the parent's phone number
            phone = student.parent_phone

            # Call the function to send the message via the gateway (e.g., via SMS API)
            success, result = send_sms_via_gateway(phone, content)

            # Log the message to the database
            TripMessage.objects.create(
                student=student,
                trip=trip,
                sent_to=phone,
                message_type=message_type,
                content=content,
                status=Status.SENT if success else Status.FAILED
            )

            return Response(
                {"message": "Message sent" if success else "Failed to send", "details": result},
                status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


### Send bulk messages to multiple phone numbers
# views.py

class SendBulkTripMessagesView(APIView):
    def post(self, request):
        trip_id = request.data.get("trip_id")
        phone_numbers = request.data.get("phone_numbers", [])

        if not trip_id or not phone_numbers:
            return Response(
                {"error": "trip_id and phone_numbers are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        trip = get_object_or_404(Trip, id=trip_id)

        # Determine message type and content
        if getattr(trip, "trip_action", None) == "pickup":
            content = generate_trip_message_content("your child", "pickup")
        elif getattr(trip, "trip_action", None) == "dropoff":
            content = generate_trip_message_content("your child", "dropoff")
        else:
            return Response({"error": "Invalid trip action"}, status=status.HTTP_400_BAD_REQUEST)

        # Convert list to comma-separated string
        phone_string = ",".join(phone_numbers)

        # Send bulk SMS
        success, result = send_sms_via_gateway(phone_string, content)

        return Response(
            {
                "message": "Messages sent" if success else "Failed to send messages",
                "details": result
            },
            status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST
        )



class SendBulkTripStudentMessagesView(APIView):
    def post(self, request):
        trip_id = request.data.get("trip_id")
        student_ids = request.data.get("student_ids", [])

        if not trip_id or not student_ids:
            return Response(
                {"error": "trip_id and student_ids are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        trip = get_object_or_404(Trip, id=trip_id)
        students = Student.objects.filter(id__in=student_ids)

        if not students.exists():
            return Response({"error": "No matching students found."}, status=status.HTTP_404_NOT_FOUND)

        if trip.trip_action not in ["pickup", "dropoff"]:
            return Response({"error": "Invalid trip action"}, status=status.HTTP_400_BAD_REQUEST)

        message_type = "board" if trip.trip_action == "pickup" else "alight"

        # Static message content
        content = "Dear parent, your child has arrived safely to school."

        phone_student_map = {}
        errors = []

        for student in students:
            phone = student.parent_phone
            if not phone:
                errors.append({"student_id": student.id, "error": "No phone number"})
                continue
            phone_student_map[phone] = student

        if not phone_student_map:
            return Response({"error": "No valid phone numbers found"}, status=status.HTTP_400_BAD_REQUEST)

        phone_numbers = list(phone_student_map.keys())
        phone_string = ",".join(phone_numbers)

        # Send the message in bulk once
        success, result = send_sms_via_gateway(phone_string, content)

        trip_messages = []
        status_to_use = Status.SENT if success else Status.FAILED

        for phone, student in phone_student_map.items():
            trip_messages.append(TripMessage(
                student=student,
                trip=trip,
                sent_to=phone,
                message_type=message_type,
                content=content,
                status=status_to_use
            ))

        with transaction.atomic():
            TripMessage.objects.bulk_create(trip_messages)

        return Response({
            "message": "Messages sent" if success else "Failed to send messages",
            "details": result,
            "errors": errors,
            "success_count": len(trip_messages) if success else 0,
            "failure_count": 0 if success else len(trip_messages),
        }, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)
