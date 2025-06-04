from rest_framework import generics
from .models import Station
from .serializers import StationSerializer

class StationListCreateView(generics.ListCreateAPIView):
    serializer_class = StationSerializer

    def get_queryset(self):
        queryset = Station.objects.all()
        route_id = self.request.query_params.get('route_id')

        if route_id is not None:
            queryset = queryset.filter(route_id=route_id)

        return queryset

class StationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    lookup_field = 'id'
