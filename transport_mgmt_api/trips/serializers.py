from rest_framework import serializers
from .models import Trip
from trip_message.serializers import TripMessageSerializer

class TripSerializer(serializers.ModelSerializer):
    # messages = TripMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['id']
