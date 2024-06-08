# Generated by Django 5.0.6 on 2024-06-04 06:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0005_city_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='CityPhotos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_url', models.ImageField(upload_to='', verbose_name='Photos of cities')),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='city', to='country.country')),
            ],
            options={
                'verbose_name': 'Изображение города',
                'verbose_name_plural': 'Изображения городов',
            },
        ),
    ]