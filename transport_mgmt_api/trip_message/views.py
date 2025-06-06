from rest_framework import generics
from .models import TripMessage
from .serializers import TripMessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import SendTripMessageSerializer
from .utils import send_sms_via_ums, generate_trip_message_content, send_bulk_personalized_sms_via_mobile_sasa, generate_arrive_start_message_content
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
            success, result = send_sms_via_ums(phone, content)

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
        success, result = send_sms_via_ums(phone_string, content)

        return Response(
            {
                "message": "Messages sent" if success else "Failed to send messages",
                "details": result
            },
            status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST
        )



class SendBulkTripStudentMessagesViewV2(APIView):
    """
    Version optimized for handling very large student lists
    """
    def post(self, request):
        trip_id = request.data.get("trip_id")
        student_ids = request.data.get("student_ids", [])

        if not trip_id or not student_ids:
            return Response(
                {"error": "trip_id and student_ids are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process in chunks to avoid memory issues with very large lists
        chunk_size = 5000
        all_valid_students = []
        all_errors = []
        
        for i in range(0, len(student_ids), chunk_size):
            chunk_ids = student_ids[i:i + chunk_size]
            
            # Process chunk
            students_chunk = Student.objects.filter(
                id__in=chunk_ids,
                parent_phone__isnull=False  # Filter out null phones at DB level
            ).values('id', 'parent_phone')
            
            valid_chunk = []
            phone_set = set()
            
            for student_data in students_chunk:
                phone = student_data['parent_phone']
                if phone and phone not in phone_set:
                    phone_set.add(phone)
                    valid_chunk.append({
                        'id': student_data['id'],
                        'phone': phone
                    })
            
            all_valid_students.extend(valid_chunk)
            
            # Track students with missing phones
            found_ids = {s['id'] for s in students_chunk}
            missing_ids = set(chunk_ids) - found_ids
            all_errors.extend([
                {"student_id": sid, "error": "No phone number"} 
                for sid in missing_ids
            ])

        if not all_valid_students:
            return Response(
                {"error": "No valid phone numbers found"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get trip info
        trip = get_object_or_404(Trip, id=trip_id)
        if trip.trip_action not in ["pickup", "dropoff"]:
            return Response(
                {"error": "Invalid trip action"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        message_type = "board" if trip.trip_action == "pickup" else "alight"
        content = "Dear parent, your child has arrived safely to school."
        
        # Create phone string
        phone_string = ",".join(student['phone'] for student in all_valid_students)

        # Send SMS
        success, result = send_sms_via_ums(phone_string, content)
        status_to_use = Status.SENT if success else Status.FAILED

        # Bulk create with chunking
        trip_messages = [
            TripMessage(
                student_id=student['id'],
                trip_id=trip_id,
                sent_to=student['phone'],
                message_type=message_type,
                content=content,
                status=status_to_use
            )
            for student in all_valid_students
        ]

        with transaction.atomic():
            TripMessage.objects.bulk_create(trip_messages, batch_size=1000)

        return Response({
            "message": "Messages sent" if success else "Failed to send messages",
            "details": result,
            "errors": all_errors,
            "success_count": len(trip_messages) if success else 0,
            "failure_count": 0 if success else len(trip_messages),
        }, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)
    

class SendBulkTripStudentMessagesViewWithRateLimit(APIView):
    """
    Version with rate limiting for APIs with strict limits
    """
    
    def post(self, request):
        trip_id = request.data.get("trip_id")
        student_ids = request.data.get("student_ids", [])

        if not trip_id or not student_ids:
            return Response(
                {"error": "trip_id and student_ids are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        trip = get_object_or_404(Trip, id=trip_id)
        if trip.trip_action not in ["pickup", "dropoff"]:
            return Response(
                {"error": "Invalid trip action"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all student data in one optimized query
        students_data = Student.objects.filter(
            id__in=student_ids,
            parent_phone__isnull=False,
            parent_phone__gt=''
        ).values('id', 'parent_phone', 'first_name', 'last_name')

        if not students_data:
            return Response(
                {"error": "No valid students found"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare message data
        message_data = []
        phone_set = set()
        
        for student in students_data:
            phone = student['parent_phone']
            if phone in phone_set:
                continue
            phone_set.add(phone)
            
            student_name = f"{student['first_name'] or ''} {student['last_name'] or ''}".strip()
            if not student_name:
                student_name = f"Student {student['id']}"
            
            personalized_message = generate_trip_message_content(
                student_name, 
                trip.trip_action
            )
            
            message_data.append({
                "phone": phone,
                "message": personalized_message,
                "student_id": student['id']
            })

        # Send messages in batches (respect API limits)
        batch_size = 40  # Adjust based on Mobile Sasa limits
        all_success = True
        all_results = []
        
        for i in range(0, len(message_data), batch_size):
            batch = message_data[i:i + batch_size]
            
            # Prepare batch for API
            api_batch = [{"phone": msg["phone"], "message": msg["message"]} for msg in batch]
            
            # Send batch
            success, result = send_bulk_personalized_sms_via_mobile_sasa(api_batch)
            all_results.append(result)
            
            if not success:
                all_success = False
                # You might want to continue with other batches or stop here
                break

        # Create database records
        message_type = "board" if trip.trip_action == "pickup" else "alight"
        status_to_use = Status.SENT if all_success else Status.FAILED
        
        trip_messages = [
            TripMessage(
                student_id=msg['student_id'],
                trip_id=trip_id,
                sent_to=msg['phone'],
                message_type=message_type,
                content=msg['message'],
                status=status_to_use
            )
            for msg in message_data
        ]

        with transaction.atomic():
            TripMessage.objects.bulk_create(trip_messages, batch_size=1000)

        return Response({
            "message": "Personalized messages processed" if all_success else "Some messages failed",
            "details": all_results,
            "success_count": len(trip_messages) if all_success else 0,
            "total_processed": len(message_data),
            "success": all_success
        }, status=status.HTTP_200_OK if all_success else status.HTTP_207_MULTI_STATUS)
    
class SendBulkTripStudentArriveStartMessagesView(APIView):
    """
    Send bulk personalized arrive/start messages with opposite sentiment logic
    - Pickup trips: Send "arrived to school" messages
    - Dropoff trips: Send "boarded bus" (started journey) messages
    """
    
    def post(self, request):
        trip_id = request.data.get("trip_id")
        student_ids = request.data.get("student_ids", [])

        if not trip_id or not student_ids:
            return Response(
                {"error": "trip_id and student_ids are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        trip = get_object_or_404(Trip, id=trip_id)
        if trip.trip_action not in ["pickup", "dropoff"]:
            return Response(
                {"error": "Invalid trip action"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all student data in one optimized query
        students_data = Student.objects.filter(
            id__in=student_ids,
            parent_phone__isnull=False,
            parent_phone__gt=''
        ).values('id', 'parent_phone', 'first_name', 'last_name')

        if not students_data:
            return Response(
                {"error": "No valid students found"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare message data with arrive/start content
        message_data = []
        phone_set = set()
        
        for student in students_data:
            phone = student['parent_phone']
            if phone in phone_set:
                continue
            phone_set.add(phone)
            
            student_name = f"{student['first_name'] or ''} {student['last_name'] or ''}".strip()
            if not student_name:
                student_name = f"Student {student['id']}"
            
            # Use the arrive/start message generator (opposite logic)
            personalized_message = generate_arrive_start_message_content(
                student_name, 
                trip.trip_action
            )
            
            message_data.append({
                "phone": phone,
                "message": personalized_message,
                "student_id": student['id']
            })

        # Send messages in batches (respect API limits)
        batch_size = 40  # Adjust based on Mobile Sasa limits
        all_success = True
        all_results = []
        
        for i in range(0, len(message_data), batch_size):
            batch = message_data[i:i + batch_size]
            
            # Prepare batch for API
            api_batch = [{"phone": msg["phone"], "message": msg["message"]} for msg in batch]
            
            # Send batch
            success, result = send_bulk_personalized_sms_via_mobile_sasa(api_batch)
            all_results.append(result)
            
            if not success:
                all_success = False
                # You might want to continue with other batches or stop here
                break

        # Create database records with arrive/start message types
        message_type = "arrived" if trip.trip_action == "pickup" else "started"
        status_to_use = Status.SENT if all_success else Status.FAILED
        
        trip_messages = [
            TripMessage(
                student_id=msg['student_id'],
                trip_id=trip_id,
                sent_to=msg['phone'],
                message_type=message_type,  # "arrived" or "started"
                content=msg['message'],
                status=status_to_use
            )
            for msg in message_data
        ]

        with transaction.atomic():
            TripMessage.objects.bulk_create(trip_messages, batch_size=1000)

        return Response({
            "message": "Arrive/Start messages processed" if all_success else "Some messages failed",
            "details": all_results,
            "success_count": len(trip_messages) if all_success else 0,
            "total_processed": len(message_data),
            "success": all_success,
            "message_type": message_type
        }, status=status.HTTP_200_OK if all_success else status.HTTP_207_MULTI_STATUS)