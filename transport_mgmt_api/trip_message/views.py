from rest_framework import generics
from .models import TripMessage
from .serializers import TripMessageSerializer

class TripMessageListCreateView(generics.ListCreateAPIView):
    queryset = TripMessage.objects.all()
    serializer_class = TripMessageSerializer

class TripMessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TripMessage.objects.all()
    serializer_class = TripMessageSerializer
