from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student
from .serializers import StudentSerializer, StudentWriteSerializer
from .pagination import CustomPagination
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from .models import Student

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['station__route', 'school']
    pagination_class = None

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentWriteSerializer
        return StudentSerializer

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class StudentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'id'


# New View for Counting Students per Route
class StudentRouteTotalView(generics.GenericAPIView):
    """
    View to get the total number of students for a given route.
    """
    def get(self, request, *args, **kwargs):
        route_id = request.query_params.get('route_id')
        if not route_id:
            return Response({"error": "Route ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Count students based on route_id
        student_count = Student.objects.filter(station__route=route_id).aggregate(total=Count('id'))['total']

        return Response({"route_id": route_id, "student_count": student_count}, status=status.HTTP_200_OK)

class ParentContactBatchView(APIView):
    """
    POST: Given a list of student IDs, return their parent's phone number.
    """
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        student_ids = request.data.get('student_ids', [])
        if not isinstance(student_ids, list):
            return Response({"error": "student_ids must be a list."}, status=status.HTTP_400_BAD_REQUEST)

        students = Student.objects.filter(id__in=student_ids)

        data = [
            {
                "student_id": student.id,
                "parent_phone": student.parent_phone,
            }
            for student in students
        ]

        return Response(data, status=status.HTTP_200_OK)
    

class StudentIdListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get(self, request, *args, **kwargs):
        # Get all students' IDs
        student_ids = self.queryset.values_list('id', flat=True)
        return Response(student_ids)