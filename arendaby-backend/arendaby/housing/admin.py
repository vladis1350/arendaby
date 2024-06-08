from django.contrib import admin

from .models import MenuItem, VocationIdeas


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", )
    ordering = ["name"]


@admin.register(VocationIdeas)
class VocationIdeasAdmin(admin.ModelAdmin):
    list_display = ("title", "info", "image")
    ordering = ['created_at']
