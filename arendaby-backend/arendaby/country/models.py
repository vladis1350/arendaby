from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True, verbose_name='Описание')

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True, verbose_name='Описание города')
    # image = models.ImageField('Изображение', upload_to='cities/', blank=True, null=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')

    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"

    def __str__(self):
        return self.name
