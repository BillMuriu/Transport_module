# users/serializers.py
from rest_framework import serializers
from .models import User, Invitation
from schools.serializers import SchoolSerializer
from django.conf import settings

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


class InvitationSerializer(serializers.ModelSerializer):
    invite_link = serializers.SerializerMethodField()
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = Invitation
        fields = [
            'token',
            'user_type',
            'school_name',
            'invited_by',
            'created_at',
            'is_used',
            'invite_link',
        ]
        read_only_fields = ['token', 'created_at', 'is_used']

    def get_invite_link(self, obj):
        return f"{settings.FRONTEND_URL}/accept-invite/{obj.token}/"