from django.contrib import admin

from .models import ApartmentType, Apartment, ApartmentPhoto, GroupApartmentType, Booking, Rating, Comment


@admin.register(ApartmentType)
class ApartmentTypeAdmin(admin.ModelAdmin):
    list_display = ("type_name", "group")
    ordering = ["type_name", "group"]


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ("id",
                    "name", "type", "city", "street_name", "number_house", "number_block", "square", "number_floor",
                    "count_floor",
                    "sleeping_places", "elevator", "count_room", "price",)
    list_filter = ('id', 'name',)
    search_fields = ('name', 'description')
    ordering = ["type", "city", "name", "square", "number_floor", "count_floor", "elevator", "count_room", "price",
                "sleeping_places", ]


@admin.register(ApartmentPhoto)
class ApartmentPhotoAdmin(admin.ModelAdmin):
    list_display = ("apartment", "image",)
    ordering = ["apartment", ]


@admin.register(GroupApartmentType)
class GroupApartmentTypeAdmin(admin.ModelAdmin):
    list_display = ("group_name", "short_info", "descriptions",)
    ordering = ["group_name", ]


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'apartment', 'start_booking', 'end_booking', 'total_price', 'client',)
    ordering = ['apartment', 'start_booking', ]


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('apartment', 'client', 'rating',)
    ordering = ['rating']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('apartment', 'client', 'comment', 'created_at',)
    ordering = ['comment', 'created_at', ]
