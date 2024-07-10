from rest_framework import serializers

from .models import MenuItem, VocationIdeas, Idea, Region


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'


class VocationIdeasSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocationIdeas
        fields = '__all__'


class IdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Idea
        fields = '__all__'


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'


class IdeaTextSerializer(serializers.Serializer):
    long_text = serializers.CharField(style={'base_template': 'textarea.html'})
