from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        # Explicitly set is_active to True
        validated_data['is_active'] = True
        
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        # Set password and hash it
        if password:
            instance.set_password(password)
        instance.save()

        return instance
