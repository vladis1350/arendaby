from country.models import City
from django.db import models
from user.models import User


class GroupApartmentType(models.Model):
    group_name = models.CharField(max_length=50)
    short_info = models.CharField(max_length=70, default=" ")
    descriptions = models.TextField(null=True, blank=True, verbose_name='Описание группы')

    class Meta:
        verbose_name = "Группа видов арендного жилья"
        verbose_name_plural = "Группы видов арендного жилья"

    def __str__(self):
        return self.group_name


class ApartmentType(models.Model):
    type_name = models.CharField(max_length=100, unique=True, null=False, verbose_name="Тип апартаментов")
    group = models.ForeignKey(GroupApartmentType, on_delete=models.CASCADE, verbose_name="Группа типов апартаментов",
                              default=None)

    class Meta:
        verbose_name = "Тип апартаментов"
        verbose_name_plural = "Типы апартаментов"

    def __str__(self):
        return self.type_name


class Apartment(models.Model):
    # Тип апартаментов, название и расположение расположение
    type = models.ForeignKey(ApartmentType, on_delete=models.CASCADE, related_name='types',
                             verbose_name="Тип апартаментов")
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='cities', verbose_name="Город")
    name = models.CharField(max_length=100, null=False, verbose_name="Название")
    street_name = models.CharField(max_length=200, null=False, verbose_name="Название улицы", default="-")
    number_house = models.CharField(max_length=5, null=False, verbose_name="Номер дома", default="-")
    number_block = models.CharField(max_length=5, null=False, verbose_name="Номер корпуса", default="-")

    # общие сведения
    square = models.CharField(default=1, max_length=5, verbose_name="Площадь апартаментов")
    sleeping_places = models.IntegerField(default=1, verbose_name="Спальных мест")
    number_floor = models.IntegerField(default=1, verbose_name="Этаж")
    count_floor = models.IntegerField(default=1, verbose_name="Количество этажей")
    elevator = models.BooleanField(default=False, verbose_name="Наличие лифта")
    count_room = models.IntegerField(default=1, verbose_name="Количество комнат")
    price = models.IntegerField(default=1, verbose_name="Цена за сутки")
    descriptions = models.TextField(null=True, blank=True, verbose_name='Описание апартаментов')

    # когда добавлено и обновленно
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated = models.DateTimeField(auto_now=True, verbose_name='Обновлен')

    # арендодатель
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name="landlord", verbose_name="Адендадатель",
                                 default=False)

    class Meta:
        verbose_name = "Апартаменты"
        verbose_name_plural = "Апартаменты"

    def __str__(self):
        return self.city.name + ": " + self.name


class ApartmentPhoto(models.Model):
    image = models.ImageField(verbose_name="Фото апартаментов", upload_to='apartments/', blank=True, null=True)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='apartmentphoto_set',
                                  verbose_name="Апартаменты")

    class Meta:
        verbose_name = "Фото апартаментов"
        verbose_name_plural = "Фото апартаментов"

    def __str__(self):
        return self.apartment.name


class Booking(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client', verbose_name='Клиент',
                               blank=False, null=False)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='apartment',
                                  verbose_name='Апартаменты', blank=False, null=False)
    start_booking = models.DateTimeField(verbose_name="Бронь с")
    end_booking = models.DateTimeField(verbose_name="Бронь по")
    isBooking = models.BooleanField(default=False)

    @property
    def total_price(self):
        total_days = (self.end_booking - self.start_booking).days
        return self.apartment.price * total_days
