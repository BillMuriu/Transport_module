import uuid
from django.db import models

class MessageType(models.TextChoices):
    BOARD = 'board', 'Board'
    ALIGHT = 'alight', 'Alight'
    CUSTOM = 'custom', 'Custom'

class Status(models.TextChoices):
    SENT = 'sent', 'Sent'
    FAILED = 'failed', 'Failed'
    PENDING = 'pending', 'Pending'

class TripMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='trip_messages'  # student.trip_messages.all()
    )
    trip = models.ForeignKey(
        'trips.Trip',
        on_delete=models.CASCADE,
        related_name='messages'  # trip.messages.all()
    )
    sent_to = models.CharField(max_length=255)  # Parent phone or email
    message_type = models.CharField(max_length=20, choices=MessageType.choices)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message {self.id} for {self.student.first_name} ({self.status})"
