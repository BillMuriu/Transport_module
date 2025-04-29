import uuid
from django.db import models

class User(models.Model):
    class UserType(models.TextChoices):
        MAIN_ADMIN = 'MAIN_ADMIN', 'Main Admin'
        SCHOOL_ADMIN = 'SCHOOL_ADMIN', 'School Admin'
        TRIP_TEACHER = 'TRIP_TEACHER', 'Trip Teacher'
        DRIVER = 'DRIVER', 'Driver'
        PARENT = 'PARENT', 'Parent'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128)  # hashed password
    user_type = models.CharField(max_length=20, choices=UserType.choices)
    school = models.ForeignKey('schools.School', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')  # Unique reverse relation name
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
