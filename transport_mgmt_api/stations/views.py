from rest_framework import generics
from .models import Station
from .serializers import StationSerializer

class StationListCreateView(generics.ListCreateAPIView):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

class StationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    lookup_field = 'id'
