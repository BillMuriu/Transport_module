from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    trip_teacher_name = serializers.SerializerMethodField()
    driver_name = serializers.SerializerMethodField()
    vehicle_name = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            'id',
            'name',
            'trip_type',
            'school',
            'vehicle',
            'driver',
            # Remove raw trip_teacher UUID field; only show trip_teacher_name
            'route',
            'start_location',
            'end_location',
            'departure_time',
            'arrival_time',
            'trip_status',
            'trip_action',
            'expected_students',
            'boarded_students',
            'created_at',
            'updated_at',
            'trip_teacher_name',
            'driver_name',
            'vehicle_name',
        ]

    def get_trip_teacher_name(self, obj):
        if obj.trip_teacher:
            # Uses Django's AbstractUser get_full_name by default
            return obj.trip_teacher.get_full_name() or str(obj.trip_teacher)
        return None

    def get_driver_name(self, obj):
        if obj.driver:
            return getattr(obj.driver, 'full_name', str(obj.driver))
        return None

    def get_vehicle_name(self, obj):
        if obj.vehicle:
            return getattr(obj.vehicle, 'registration_number', str(obj.vehicle))
        return None
