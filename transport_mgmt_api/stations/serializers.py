# stations/serializers.py
from rest_framework import serializers
from .models import Station
from routes.serializers import RouteSerializer

class StationSerializer(serializers.ModelSerializer):
    route = RouteSerializer(read_only=True)

    class Meta:
        model = Station
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
