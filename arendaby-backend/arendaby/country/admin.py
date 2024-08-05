from django.contrib import admin

from .models import Country, City, CityPhotos


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    ordering = ["name"]


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'country', 'image')
    ordering = ["name", 'country']


@admin.register(CityPhotos)
class CityPhotosAdmin(admin.ModelAdmin):
    list_display = ('city', 'photo_url')
    ordering = ['photo_url']
