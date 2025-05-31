from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from schools.models import School
from students.models import Student
from users.models import User
from drivers.models import Driver
from routes.models import Route


class DashboardSummaryView(APIView):
    def get(self, request):
        school_id = request.query_params.get("school_id")

        if not school_id:
            return Response({"detail": "school_id query param is required."}, status=status.HTTP_400_BAD_REQUEST)

        school = get_object_or_404(School, id=school_id)

        data = {
            "active_students": Student.objects.filter(school=school).count(),
            "active_teachers": User.objects.filter(school=school, user_type="TRIP_TEACHER", is_active=True).count(),
            "active_drivers": Driver.objects.filter(school=school).count(),
            "active_routes": Route.objects.filter(school=school).count(),
        }

        return Response(data)
