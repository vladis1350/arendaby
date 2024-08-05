from django.contrib.auth.models import User
from django.db import models
from django.contrib.postgres.fields import ArrayField

GENDER_CHOICES = [
    ('M', 'Мужской'),
    ('F', 'Женский'),
]


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Пользователь')
    username = models.CharField(max_length=50, default="user")
    firstname = models.CharField(max_length=50, default='user', null=False, verbose_name="Имя")
    secondname = models.CharField(max_length=50, default='user', null=False, verbose_name="Фамилия")
    genders = ArrayField(models.CharField(max_length=1, choices=GENDER_CHOICES), blank=True, null=True)
    email = models.CharField(max_length=50, default="user@example.com")
    phone = models.CharField(max_length=15, null=True, verbose_name="Телефон")
    image = models.ImageField(upload_to="profile_image/", null=True, default='user/noimage.png',
                              verbose_name="Фото профиля")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Создан")

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self):
        return self.username
