# Generated by Django 5.0.6 on 2024-06-07 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0005_apartmentphoto'),
    ]

    operations = [
        migrations.AddField(
            model_name='apartment',
            name='price',
            field=models.IntegerField(default=1, verbose_name='Цена за сутки'),
        ),
    ]