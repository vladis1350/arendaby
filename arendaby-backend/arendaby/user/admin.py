from django.contrib import admin

from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "username", "email", "phone",)
    list_display_links = ("id", "user",)
    ordering = ["username", "email", "phone",]
