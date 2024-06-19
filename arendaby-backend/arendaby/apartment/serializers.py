from rest_framework import serializers

from .models import ApartmentType, Apartment, ApartmentPhoto, GroupApartmentType


class ApartmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentType
        fields = "__all__"


class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = "__all__"


class ApartmentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentPhoto
        fields = "__all__"


class GroupApartmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupApartmentType
        fields = "__all__"
