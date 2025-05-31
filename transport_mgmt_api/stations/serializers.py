# stations/serializers.py
from rest_framework import serializers
from .models import Station
from routes.serializers import RouteSerializer
from routes.models import Route

class StationSerializer(serializers.ModelSerializer):
    # Read-only nested representation for GET
    route = RouteSerializer(read_only=True)
    
    # Writable field to accept route id in POST/PUT
    route_id = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(), source='route', write_only=True
    )

    class Meta:
        model = Station
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
