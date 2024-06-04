from rest_framework import serializers

from .models import Country, City, CityPhotos


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class CityPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityPhotos
        fields = "__all__"

