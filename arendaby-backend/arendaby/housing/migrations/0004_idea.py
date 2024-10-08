# Generated by Django 5.0.6 on 2024-07-08 12:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('housing', '0003_vocationideas'),
    ]

    operations = [
        migrations.CreateModel(
            name='Idea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('image', models.ImageField(blank=True, upload_to='places/', verbose_name='Фото')),
                ('description', models.TextField(verbose_name='Описание')),
                ('vocation_ideas', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='v_ideas', to='housing.vocationideas', verbose_name='Куда поехать')),
            ],
            options={
                'verbose_name': 'Идея',
                'verbose_name_plural': 'Идеи',
            },
        ),
    ]
