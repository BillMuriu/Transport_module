from rest_framework import generics
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer
from django.utils.dateparse import parse_date
from datetime import timedelta, datetime



class NoPagination:
    display_page_controls = False

    def paginate_queryset(self, queryset, request, view=None):
        return None

    def get_paginated_response(self, data):
        return Response(data)

class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    pagination_class = NoPagination

    def get_queryset(self):
        queryset = Trip.objects.all()
        trip_teacher = self.request.query_params.get("trip_teacher")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if trip_teacher:
            queryset = queryset.filter(trip_teacher__id=trip_teacher)
        
        if start_date:
            queryset = queryset.filter(created_at__date__gte=parse_date(start_date))
        if end_date:
            queryset = queryset.filter(created_at__date__lte=parse_date(end_date))

        return queryset

class TripRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'id'
