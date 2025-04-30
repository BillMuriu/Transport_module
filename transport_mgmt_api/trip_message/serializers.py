from rest_framework import serializers
from .models import TripMessage

class TripMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripMessage
        fields = '__all__'

class SendTripMessageSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    trip_id = serializers.UUIDField()