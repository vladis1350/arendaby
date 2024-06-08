from country.models import City
from django.db import models


class ApartmentType(models.Model):
    type_name = models.CharField(max_length=100, unique=True, null=False, verbose_name="Тип апартаментов")

    class Meta:
        verbose_name = "Тип апартаментов"
        verbose_name_plural = "Типы апартаментов"

    def __str__(self):
        return self.type_name


class Apartment(models.Model):
    type = models.ForeignKey(ApartmentType, on_delete=models.CASCADE, related_name='types',
                             verbose_name="Тип апартаментов")
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='cities', verbose_name="Город")
    name = models.CharField(max_length=100, null=False, verbose_name="Название")
    address = models.CharField(max_length=200, null=False, verbose_name="Адрес")
    sleeping_places = models.IntegerField(default=1, verbose_name="Спальных мест")
    price = models.IntegerField(default=1, verbose_name="Цена за сутки")
    descriptions = models.TextField(null=True, blank=True, verbose_name='Описание апартаментов')
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated = models.DateTimeField(auto_now=True, verbose_name='Обновлен')

    class Meta:
        verbose_name = "Апартаменты"
        verbose_name_plural = "Апартаменты"

    def __str__(self):
        return self.city.name + ": " + self.name


class ApartmentPhoto(models.Model):
    image = models.ImageField(verbose_name="Фото апартаментов", upload_to='apartments/', blank=True, null=True)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='apartments',
                                  verbose_name="Апартаменты")

    class Meta:
        verbose_name = "Фото апартаментов"
        verbose_name_plural = "Фото апартаментов"

    def __str__(self):
        return self.apartment.name
