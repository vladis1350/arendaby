from django.contrib import admin

from .models import ApartmentType, Apartment, ApartmentPhoto, GroupApartmentType


@admin.register(ApartmentType)
class ApartmentTypeAdmin(admin.ModelAdmin):
    list_display = ("type_name", "group")
    ordering = ["type_name", "group"]


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "city", "address", "descriptions",)
    ordering = ["type", "city", "name"]


@admin.register(ApartmentPhoto)
class ApartmentPhotoAdmin(admin.ModelAdmin):
    list_display = ("apartment", "image",)
    ordering = ["apartment", ]


@admin.register(GroupApartmentType)
class GroupApartmentTypeAdmin(admin.ModelAdmin):
    list_display = ("group_name", "short_info", "descriptions",)
    ordering = ["group_name", ]
