from django.contrib import admin

from .models import MenuItem, VocationIdeas, Idea, Region


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    ordering = ["name"]


@admin.register(VocationIdeas)
class VocationIdeasAdmin(admin.ModelAdmin):
    list_display = ("title", "info", "image")
    ordering = ['created_at']


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name",)
    ordering = ['name']


@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = ("vocation_ideas", "name", "image", "description",)
    list_filter = ('name', 'vocation_ideas',)
    search_fields = ('name', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'image')
        }),
        ('Advanced options', {
            'classes': ('collapse',),
            'fields': ('vocation_ideas',)
        }),
    )
