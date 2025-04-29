import uuid
from django.db import models

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, related_name='students')
    class_name = models.CharField(max_length=50)  # Renamed to class_name to avoid reserved word conflict
    parent_name = models.CharField(max_length=255)
    parent_phone = models.CharField(max_length=20)
    parent_email = models.EmailField(null=True, blank=True)
    fingerprint_id = models.IntegerField()
    station = models.ForeignKey('stations.Station', on_delete=models.CASCADE, related_name='students')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
