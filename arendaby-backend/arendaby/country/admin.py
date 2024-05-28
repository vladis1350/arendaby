from django.contrib import admin

from .models import Country, City


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    ordering = ["name"]


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'country')
    ordering = ["name", 'country']
