from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
    message_id = models.CharField(max_length=50, unique=True)
    sender = models.CharField(max_length=50)
    recipient = models.CharField(max_length=15)

    MSG_TYPE_CHOICES = [
        ('Promotional', 'Promotional'),
        ('Transactional', 'Transactional'),
    ]
    msg_type = models.CharField(max_length=20, choices=MSG_TYPE_CHOICES)

    message_content = models.TextField()
    cost = models.DecimalField(max_digits=6, decimal_places=2)

    NETWORK_CHOICES = [
        ('Safaricom', 'Safaricom'),
        ('Airtel', 'Airtel'),
        ('Telkom', 'Telkom'),
    ]
    network = models.CharField(max_length=20, choices=NETWORK_CHOICES)

    STATUS_CHOICES = [
        ('Failed', 'Failed'),
        ('Delivered', 'Delivered'),
        ('Pending', 'Pending'),
        ('Sent', 'Sent'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='created_messages'
    )

    def __str__(self):
        return f"{self.message_id} -> {self.recipient}"
