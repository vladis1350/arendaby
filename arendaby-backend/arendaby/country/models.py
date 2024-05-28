from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True, verbose_name='Описание')

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"

    def __str__(self):
        return self.name

