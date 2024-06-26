# Generated by Django 5.0.6 on 2024-06-23 12:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0010_remove_apartment_user_apartment_landlord'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='apartment',
            name='landlord',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL, verbose_name='Адендадатель'),
        ),
    ]