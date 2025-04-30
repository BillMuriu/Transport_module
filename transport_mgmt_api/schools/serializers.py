# schools/serializers.py
from rest_framework import serializers
from .models import School

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
