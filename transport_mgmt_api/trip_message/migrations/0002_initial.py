# Generated by Django 5.2 on 2025-04-29 23:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('trip_message', '0001_initial'),
        ('trips', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tripmessage',
            name='trip',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='trips.trip'),
        ),
    ]
