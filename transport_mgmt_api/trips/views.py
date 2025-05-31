from rest_framework import generics
from rest_framework.response import Response

from .models import Trip
from .serializers import TripSerializer

class NoPagination:
    display_page_controls = False

    def paginate_queryset(self, queryset, request, view=None):
        return None

    def get_paginated_response(self, data):
        return Response(data)

class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    pagination_class = NoPagination

class TripRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'id'
