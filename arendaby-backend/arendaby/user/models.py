from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Пользователь')
    username = models.CharField(max_length=50, default="user")
    email = models.CharField(max_length=50, default="user@example.com")
    phone = models.CharField(max_length=15, null=True, verbose_name="Телефон")
    image = models.ImageField(upload_to="profile_image/", null=True, default='user/noimage.webp',
                              verbose_name="Фото профиля")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Создан")

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self):
        return self.username
