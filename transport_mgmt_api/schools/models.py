import uuid
from django.db import models
from users.models import User  # Import the User model to create the foreign key

class School(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    contact_person = models.CharField(max_length=255)
    school_admin = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, blank=True,
        limit_choices_to={'user_type': 'SCHOOL_ADMIN'}, related_name='administered_schools'  # Unique reverse relation name
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
