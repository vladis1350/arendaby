from rest_framework import serializers

from .models import MenuItem, VocationIdeas


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'


class VocationIdeasSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocationIdeas
        fields = '__all__'
