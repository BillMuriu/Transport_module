from rest_framework import serializers
from .models import Message, MessageTemplate

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["id", "message_id", "date"]

class MessageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageTemplate
        fields = ['id', 'name', 'content', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
