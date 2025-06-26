# users/serializers.py
from rest_framework import serializers
from .models import User, Invitation
from schools.serializers import SchoolSerializer
from schools.models import School
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
    school_name = serializers.CharField(source='school.name', read_only=True, allow_null=True)
    school_id = serializers.UUIDField(source='school.id', read_only=True, allow_null=True)

    # Optional school field
    school = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Invitation
        fields = [
            'token',
            'user_type',
            'school',        # for writing
            'school_name',   # for display
            'school_id',     # for display
            'invited_by',
            'created_at',
            'is_used',
            'invite_link',
        ]
        read_only_fields = ['token', 'created_at', 'is_used']

    def get_invite_link(self, obj):
        return f"{settings.FRONTEND_URL}/accept-invite/{obj.token}/"
