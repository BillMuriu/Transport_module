# users/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser.
    """
    class UserType(models.TextChoices):
        MAIN_ADMIN = 'MAIN_ADMIN', 'Main Admin'
        SCHOOL_ADMIN = 'SCHOOL_ADMIN', 'School Admin'
        TRIP_TEACHER = 'TRIP_TEACHER', 'Trip Teacher'
        DRIVER = 'DRIVER', 'Driver'
        PARENT = 'PARENT', 'Parent'
    
    # Override the id field to use UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Email field with unique constraint
    email = models.EmailField(_('email address'), unique=True)
    
    # Custom fields
    phone_number = models.CharField(max_length=20, blank=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.PARENT)
    school = models.ForeignKey(
        'schools.School',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

    # Add related_name to prevent conflicts with the default User model's related names
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Custom related name for groups
        blank=True
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Custom related name for user_permissions
        blank=True
    )

    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username'] 

    def __str__(self):
        return self.email
