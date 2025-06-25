from django.db import models

class Message(models.Model):
    message_id = models.CharField(max_length=50, unique=True)
    sender = models.CharField(max_length=50)
    recipient = models.CharField(max_length=15)

    MSG_TYPE_CHOICES = [
        ('Promotional', 'Promotional'),
        ('Transactional', 'Transactional'),
    ]
    msg_type = models.CharField(max_length=20, choices=MSG_TYPE_CHOICES, blank=True, null=True)

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

    def __str__(self):
        return f"{self.message_id} -> {self.recipient}"


class MessageTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    content = models.TextField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
