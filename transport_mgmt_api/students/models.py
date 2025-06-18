import uuid
from django.db import models

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admission_number = models.CharField(max_length=20, null=True, blank=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, related_name='students')

    CLASS_CHOICES = [
        (f"grade_{i}", f"Grade {i}") for i in range(1, 10)
    ]
    class_name = models.CharField(max_length=20, choices=CLASS_CHOICES)

    parent_name = models.CharField(max_length=255)
    parent_phone = models.CharField(max_length=20)
    parent_email = models.EmailField(null=True, blank=True)

    fingerprint_id = models.IntegerField(null=True, blank=True)
    station = models.ForeignKey('stations.Station', on_delete=models.CASCADE, related_name='students')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
