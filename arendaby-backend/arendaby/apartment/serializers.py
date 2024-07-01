from country.models import City
from country.serializers import CitySerializer
from rest_framework import serializers
from user.models import User
from user.serializers import UserSerializer

from .models import ApartmentType, Apartment, ApartmentPhoto, GroupApartmentType, Booking

class ApartmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentType
        fields = "__all__"


class LandlordApartmentSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='profile.image', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'image', 'phone',)


class ApartmentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentPhoto
        fields = ("image", "apartment",)


class BookingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    type = ApartmentTypeSerializer(required=False)
    city = CitySerializer(required=False)
    images = ApartmentPhotoSerializer(source="apartmentphoto_set", many=True)
    booking = BookingListSerializer(source="booking_set", many=True)
    landlord = UserSerializer(required=False)

    class Meta:
        model = Apartment
        fields = (
            'id', 'type', 'city', 'landlord', 'images', 'name', 'street_name', 'number_house', 'number_block',
            'square', 'number_floor', 'count_floor', 'sleeping_places', 'elevator', 'count_room', 'price',
            'descriptions', 'booking', )


class ApartmentCreateSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='type.id')
    city = serializers.CharField(source='city.name')
    landlord = serializers.CharField(source="user.id")
    images = serializers.ListField(source="apartmentphoto_set", child=serializers.ImageField())

    class Meta:
        model = Apartment
        fields = (
            "type", "city", "landlord", "images", "name", 'street_name', 'number_house', 'number_block',
            "square", "number_floor", "count_floor", "sleeping_places", "elevator", "count_room", "price",
            "descriptions",)

    def create(self, validated_data):
        images = validated_data.pop('apartmentphoto_set')
        type_id = validated_data.pop('type')['id']
        city_name = validated_data.pop('city')['name']
        landlord_id = validated_data.pop('user')['id']
        # address = validated_data.pop('address')['streetName']
        # numberHouse = validated_data.pop('')
        # address = validated_data.pop('address')['streetName']

        type_obj = ApartmentType.objects.get(pk=type_id)
        city_obj = City.objects.get(name=city_name)
        landlord_obj = User.objects.get(pk=landlord_id)

        apartment = Apartment.objects.create(type=type_obj, city=city_obj, landlord=landlord_obj, **validated_data)
        for image in images:
            print(image)
            ApartmentPhoto.objects.create(apartment=apartment, image=image)

        return apartment


class GroupApartmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupApartmentType
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer(required=False)
    client = UserSerializer(required=False)

    class Meta:
        model = Booking
        fields = ('client', 'apartment', 'start_booking', 'end_booking', 'isBooking',)


class CreateBookingSerializer(serializers.ModelSerializer):
    client = serializers.CharField(source='user.id')
    apartment = serializers.CharField(source='apartment.id')

    class Meta:
        model = Booking
        fields = ('client', 'apartment', 'start_booking', 'end_booking', 'isBooking',)

    def create(self, validated_data):
        print(validated_data)
        apart_id = validated_data.pop('apartment')['id']
        client_id = validated_data.pop('user')['id']

        client = User.objects.get(pk=client_id)
        apartment = Apartment.objects.get(pk=apart_id)
        booking = Booking.objects.create(client=client, apartment=apartment, **validated_data)

        return booking

