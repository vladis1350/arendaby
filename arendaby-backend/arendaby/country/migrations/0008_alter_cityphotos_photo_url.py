# Generated by Django 5.0.6 on 2024-06-07 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0007_alter_cityphotos_city'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cityphotos',
            name='photo_url',
            field=models.ImageField(blank=True, null=True, upload_to='cities/', verbose_name='Photos of cities'),
        ),
    ]
