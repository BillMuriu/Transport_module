# users/serializers.py
from rest_framework import serializers
from .models import User
from schools.serializers import SchoolSerializer  # Import the SchoolSerializer

class UserSerializer(serializers.ModelSerializer):
    school = SchoolSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
