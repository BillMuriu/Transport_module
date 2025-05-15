import uuid
from django.db import models

class Trip(models.Model):
    class TripType(models.TextChoices):
        PICKUP = 'morning_pickup', 'Morning Pickup'
        DROPP_OFF = 'evening_dropoff', 'Evening Dropoff'

    class TripStatus(models.TextChoices):
        ONGOING = 'ongoing', 'Ongoing'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    class TripAction(models.TextChoices):
        PICKUP = 'pickup', 'Pickup'
        DROPOFF = 'dropoff', 'Dropoff'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    trip_type = models.CharField(max_length=20, choices=TripType.choices)
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, related_name='trips')
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name='trips')
    driver = models.ForeignKey('drivers.Driver', on_delete=models.CASCADE, related_name='trips')
    trip_teacher = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'TRIP_TEACHER'},
        related_name='trips'
    )
    route = models.ForeignKey('routes.Route', on_delete=models.CASCADE, null=True, blank=True, related_name='trips')
    start_location = models.CharField(max_length=255, null=True, blank=True)
    end_location = models.CharField(max_length=255, null=True, blank=True)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField(null=True, blank=True)
    trip_status = models.CharField(max_length=10, choices=TripStatus.choices)
    trip_action = models.CharField(max_length=10, choices=TripAction.choices, null=True, blank=True)

    expected_students = models.ManyToManyField('students.Student', related_name='expected_trips', blank=True)
    boarded_students = models.ManyToManyField('students.Student', related_name='boarded_trips', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name