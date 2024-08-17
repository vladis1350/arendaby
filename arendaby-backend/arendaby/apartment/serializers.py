from country.models import City
from country.serializers import CitySerializer
from rest_framework import serializers
from user.models import User
from user.serializers import UserSerializer

from .models import ApartmentType, Apartment, ApartmentPhoto, GroupApartmentType, Booking, Rating, Comment, UserActivity


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


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'apartment', 'client', 'rating']


class CommentSerializer(serializers.ModelSerializer):
    client = UserSerializer(required=False)

    class Meta:
        model = Comment
        fields = ['id', 'apartment', 'client', 'comment', 'created_at']


class ApartmentSerializer(serializers.ModelSerializer):
    type = ApartmentTypeSerializer(required=False)
    city = CitySerializer(required=False)
    rating = RatingSerializer(source='rating_set', many=True)
    comment = CommentSerializer(source='comment_set', many=True)
    images = ApartmentPhotoSerializer(source="apartmentphoto_set", many=True)
    booking = BookingListSerializer(source="booking_set", many=True)
    landlord = UserSerializer(required=False)

    class Meta:
        model = Apartment
        fields = (
            'id', 'type', 'city', 'rating', 'comment', 'landlord', 'images', 'name', 'street_name', 'number_house',
            'number_block',
            'square', 'number_floor', 'count_floor', 'sleeping_places', 'elevator', 'count_room', 'price',
            'descriptions', 'booking',)


class ApartmentFilterSerializer(serializers.Serializer):
    price_min = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    price_max = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    group_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    city_id = serializers.IntegerField(required=False)


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
    start_booking = serializers.DateField(format='%d-%m-%Y')
    end_booking = serializers.DateField(format='%d-%m-%Y')
    apartment = ApartmentSerializer(required=False)
    client = UserSerializer(required=False)

    class Meta:
        model = Booking
        fields = ('id', 'client', 'apartment', 'start_booking', 'end_booking', 'isBooking',)


class CreateBookingSerializer(serializers.ModelSerializer):
    start_booking = serializers.DateField(format='%d-%m-%Y')
    end_booking = serializers.DateField(format='%d-%m-%Y')
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


class CreateRatingSerializer(serializers.ModelSerializer):
    client = serializers.CharField(source='user.id')
    apartment = serializers.CharField(source='apartment.id')

    class Meta:
        model = Rating
        fields = ('client', 'apartment', 'rating')

    def create(self, validated_data):
        apart_id = validated_data.pop('apartment')['id']
        client_id = validated_data.pop('user')['id']

        client = User.objects.get(pk=client_id)
        apartment = Apartment.objects.get(pk=apart_id)
        rating = Rating.objects.create(client=client, apartment=apartment, **validated_data)

        return rating


class CreateCommentSerializer(serializers.ModelSerializer):
    client = serializers.CharField(source='user.id')
    apartment = serializers.CharField(source='apartment.id')

    class Meta:
        model = Comment
        fields = ('client', 'apartment', 'comment', 'created_at')

    def create(self, validated_data):
        apart_id = validated_data.pop('apartment')['id']
        client_id = validated_data.pop('user')['id']

        client = User.objects.get(pk=client_id)
        apartment = Apartment.objects.get(pk=apart_id)
        comment = Comment.objects.create(client=client, apartment=apartment, **validated_data)

        return comment


class UserActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    apartment = ApartmentSerializer(required=False)

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'apartment', 'is_favorite', 'viewed_at']


class CreateUserActivitySerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.id')
    apartment = serializers.CharField(source='apartment.id')

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'apartment', 'is_favorite', 'viewed_at']

    def create(self, validated_data):
        apart_id = validated_data.pop('apartment')['id']
        client_id = validated_data.pop('user')['id']

        user = User.objects.get(pk=client_id)
        apartment = Apartment.objects.get(pk=apart_id)
        user_activity = UserActivity.objects.create(user=user, apartment=apartment, **validated_data)

        return user_activity

    def update(self, instance, validated_data):
        apart_id = validated_data.pop('apartment')['id']
        client_id = validated_data.pop('user')['id']

        user = User.objects.get(pk=client_id)
        apartment = Apartment.objects.get(pk=apart_id)
        user_activity = UserActivity.objects.update(user=user, apartment=apartment, **validated_data)

        return user_activity
