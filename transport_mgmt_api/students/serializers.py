# students/serializers.py
from rest_framework import serializers
from .models import Student
from stations.serializers import StationSerializer

class StudentSerializer(serializers.ModelSerializer):
    station = StationSerializer(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
