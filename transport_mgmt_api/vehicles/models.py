import uuid
from django.db import models

class Vehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration_number = models.CharField(max_length=255)
    capacity = models.IntegerField()
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, related_name='vehicles')
    driver = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'user_type': 'DRIVER'}, related_name='vehicles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.registration_number
