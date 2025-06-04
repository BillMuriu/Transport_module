from rest_framework import serializers
from .models import Trip
from django.contrib.auth import get_user_model

User = get_user_model()

class TripSerializer(serializers.ModelSerializer):
    # Accept trip_teacher UUID as input
    trip_teacher = serializers.UUIDField(write_only=True, required=True)
    
    # Show trip_teacher ID in the output
    trip_teacher_id = serializers.SerializerMethodField()
    
    # Display names
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
            'trip_teacher',        # write-only input
            'trip_teacher_id',     # read-only output
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

    def _resolve_related_fields(self, validated_data):
        if 'trip_teacher' in validated_data:
            try:
                validated_data['trip_teacher'] = User.objects.get(id=validated_data['trip_teacher'])
            except User.DoesNotExist:
                raise serializers.ValidationError({'trip_teacher': 'User not found.'})
        return validated_data

    def create(self, validated_data):
        validated_data = self._resolve_related_fields(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._resolve_related_fields(validated_data)
        return super().update(instance, validated_data)

    def get_trip_teacher_id(self, obj):
        return str(obj.trip_teacher.id) if obj.trip_teacher else None

    def get_trip_teacher_name(self, obj):
        if obj.trip_teacher:
            return obj.trip_teacher.get_full_name() or str(obj.trip_teacher)
        return None

    def get_driver_name(self, obj):
        return getattr(obj.driver, 'full_name', str(obj.driver)) if obj.driver else None

    def get_vehicle_name(self, obj):
        return getattr(obj.vehicle, 'registration_number', str(obj.vehicle)) if obj.vehicle else None
