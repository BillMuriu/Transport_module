import uuid
from django.db import models

class Station(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    route = models.ForeignKey('routes.Route', on_delete=models.CASCADE, related_name='stations')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)  # Determines the stop sequence, nullable
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
