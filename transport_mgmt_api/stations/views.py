from rest_framework import generics
from .models import Station
from .serializers import StationSerializer

class StationListCreateView(generics.ListCreateAPIView):
    serializer_class = StationSerializer

    def get_queryset(self):
        queryset = Station.objects.all()
        route_id = self.request.query_params.get("route_id")
        school_id = self.request.query_params.get("school")

        if route_id:
            queryset = queryset.filter(route_id=route_id)

        if school_id:
            queryset = queryset.filter(route__school_id=school_id)

        return queryset


class StationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    lookup_field = 'id'
