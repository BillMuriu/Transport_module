# drivers/views.py
from rest_framework import generics
from .models import Driver
from .serializers import DriverSerializer

class DriverListCreateView(generics.ListCreateAPIView):
    serializer_class = DriverSerializer

    def get_queryset(self):
        queryset = Driver.objects.all()
        school_id = self.request.query_params.get('school')
        if school_id:
            queryset = queryset.filter(school_id=school_id)
        return queryset


class DriverRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    lookup_field = 'id'
