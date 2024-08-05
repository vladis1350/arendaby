# Generated by Django 5.0.6 on 2024-07-31 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0019_alter_booking_apartment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apartment',
            name='number_block',
            field=models.CharField(default='-', max_length=15, verbose_name='Номер корпуса'),
        ),
        migrations.AlterField(
            model_name='apartment',
            name='number_house',
            field=models.CharField(default='-', max_length=15, verbose_name='Номер дома'),
        ),
        migrations.AlterField(
            model_name='apartment',
            name='square',
            field=models.CharField(default=1, max_length=15, verbose_name='Площадь апартаментов'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='end_booking',
            field=models.DateField(verbose_name='Бронь по'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='start_booking',
            field=models.DateField(verbose_name='Бронь с'),
        ),
    ]
