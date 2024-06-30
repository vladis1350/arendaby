# Generated by Django 5.0.6 on 2024-06-27 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0015_alter_apartment_landlord'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='apartment',
            name='address',
        ),
        migrations.AddField(
            model_name='apartment',
            name='number_block',
            field=models.CharField(default='-', max_length=5, verbose_name='Номер корпуса'),
        ),
        migrations.AddField(
            model_name='apartment',
            name='number_house',
            field=models.CharField(default='-', max_length=5, verbose_name='Номер дома'),
        ),
        migrations.AddField(
            model_name='apartment',
            name='street_name',
            field=models.CharField(default='-', max_length=200, verbose_name='Название улицы'),
        ),
    ]