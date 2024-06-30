# Generated by Django 5.0.6 on 2024-06-30 09:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0017_apartment_count_floor_apartment_count_room_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_booking', models.DateTimeField(verbose_name='Бронь с')),
                ('end_booking', models.DateTimeField(verbose_name='Бронь по')),
                ('isBooking', models.BooleanField(default=False)),
                ('apartment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='apartment', to='apartment.apartment', verbose_name='Апартаменты')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client', to=settings.AUTH_USER_MODEL, verbose_name='Клиент')),
            ],
        ),
    ]
