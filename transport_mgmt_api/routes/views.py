from rest_framework import generics
from .models import Route
from .serializers import RouteSerializer

class RouteListCreateView(generics.ListCreateAPIView):
    serializer_class = RouteSerializer

    def get_queryset(self):
        queryset = Route.objects.all()
        school_id = self.request.query_params.get('school')
        if school_id:
            queryset = queryset.filter(school_id=school_id)
        return queryset

class RouteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    lookup_field = 'id'