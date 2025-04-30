# drivers/views.py
from rest_framework import generics
from .models import Driver
from .serializers import DriverSerializer

class DriverListCreateView(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    lookup_field = 'id'
