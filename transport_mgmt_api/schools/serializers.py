from rest_framework import serializers
from .models import School
from vehicles.serializers import VehicleSerializer
from drivers.serializers import DriverSerializer
from routes.serializers import RouteSerializer

class SchoolSerializer(serializers.ModelSerializer):
    vehicles = VehicleSerializer(many=True, read_only=True)  # Include vehicles as a nested field
    drivers = DriverSerializer(many=True, read_only=True)    # Include drivers as a nested field
    routes = RouteSerializer(many=True, read_only=True)      # Include routes as a nested field

    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'phone_number', 'email', 'contact_person', 'school_admin_id', 'created_at', 'updated_at', 'vehicles', 'drivers', 'routes']
        read_only_fields = ['id', 'created_at', 'updated_at']
