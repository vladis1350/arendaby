from django.contrib import admin

from .models import ApartmentType, Apartment, ApartmentPhoto


@admin.register(ApartmentType)
class ApartmentTypeAdmin(admin.ModelAdmin):
    list_display = ("type_name",)
    ordering = ["type_name", ]


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "city", "address", "descriptions",)
    ordering = ["type", "city", "name"]


@admin.register(ApartmentPhoto)
class ApartmentPhotoAdmin(admin.ModelAdmin):
    list_display = ("apartment", "image",)
    ordering = ["apartment", ]