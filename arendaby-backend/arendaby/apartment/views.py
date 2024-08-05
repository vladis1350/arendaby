import pytz
from country.models import City
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from user.models import User

from .models import Apartment, ApartmentType, ApartmentPhoto, GroupApartmentType, Booking, Rating, Comment
from .serializers import ApartmentSerializer, ApartmentPhotoSerializer, ApartmentTypeSerializer, \
    GroupApartmentTypeSerializer, ApartmentCreateSerializer, CreateBookingSerializer, BookingSerializer, \
    RatingSerializer, CommentSerializer, CreateCommentSerializer, CreateRatingSerializer

tz = pytz.timezone('Europe/Moscow')


class ApartmentViewList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]


class ApartmentByCityViewList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        city_id = self.kwargs.get('city_id')
        if not city_id:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            city = City.objects.get(pk=city_id)
        except City.DoesNotExist:
            return Response({"error": "City not found."}, status=status.HTTP_404_NOT_FOUND)

        apartmentList = Apartment.objects.filter(city=city)
        serializer = self.get_serializer(apartmentList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class SearchingApartmentsList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        city_name = request.GET.get('term')
        if not city_name:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            city = City.objects.get(name__icontains=city_name)
        except City.DoesNotExist:
            return Response({"error": "City not found."}, status=status.HTTP_404_NOT_FOUND)

        apartmentList = Apartment.objects.filter(city=city.id)
        serializer = self.get_serializer(apartmentList, many=True)

        return Response(serializer.data, status.HTTP_200_OK)


class ApartmentTypeViewList(generics.ListAPIView):
    queryset = ApartmentType.objects.all()
    serializer_class = ApartmentTypeSerializer
    permission_classes = [AllowAny, ]


class ApartmentByTypeViewList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        type_name = self.kwargs.get('type')
        if not type_name:
            return Response({"error": "Type name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apartment_type = ApartmentType.objects.get(type_name=type_name)
        except ApartmentType.DoesNotExist:
            return Response({"error": "Apartment type not found."}, status=status.HTTP_404_NOT_FOUND)

        apartmentList = Apartment.objects.filter(type_id=apartment_type)
        serializer = self.get_serializer(apartmentList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class ApartmentPhotoByApartmentViewList(generics.ListAPIView):
    queryset = ApartmentPhoto.objects.all()
    serializer_class = ApartmentPhotoSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        apartment_id = super().get_object().id
        if not apartment_id:
            return Response({"error": "Apartment is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            apartment = Apartment.objects.get(pk=apartment_id)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found."}, status=status.HTTP_404_NOT_FOUND)

        apartmentPhotos = ApartmentPhoto.objects.filter(apartment=apartment)
        serializer = self.get_serializer(apartmentPhotos, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class GroupApartmentTypeList(generics.ListAPIView):
    queryset = GroupApartmentType.objects.all()
    serializer_class = GroupApartmentTypeSerializer
    permission_classes = (AllowAny,)


class RentApartmentView(generics.CreateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = ApartmentCreateSerializer(data=request.data)
        if serializer.is_valid():
            apartment = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApartmentTypeByGroupIdViewList(generics.ListAPIView):
    queryset = ApartmentType.objects.all()
    serializer_class = ApartmentTypeSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        if not group_id:
            return Response({"error": "Group is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group_apartment_type = GroupApartmentType.objects.get(pk=group_id)
        except GroupApartmentType.DoesNotExist:
            return Response({"error": "Group apartment type not found."}, status=status.HTTP_404_NOT_FOUND)

        apartmentTypeList = ApartmentType.objects.filter(group=group_apartment_type)
        serializer = self.get_serializer(apartmentTypeList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class ApartmentByIdView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]

    def get(self, request, *args, **kwargs):
        apart_id = self.kwargs.get('apart_id')
        try:
            apartment = Apartment.objects.get(pk=apart_id)
        except Apartment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(apartment, many=False)
        return Response(serializer.data, status.HTTP_200_OK)


class ApartmentFilterView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

    # filter_backends = [filters.SearchFilter]
    # search_fields = ['city', 'start_booking', 'end_booking', 'sleep_places']

    def post(self, request, *args, **kwargs):
        city_name = request.data['city']
        start_booking = request.data['start_booking']
        end_booking = request.data['end_booking']
        guests = request.data['guests']

        if start_booking != "" and end_booking != "":
            apartments = Apartment.objects.filter(city__name=city_name, sleeping_places__gte=guests).exclude(
                id__in=Booking.objects.filter(
                    Q(start_booking__lte=start_booking, end_booking__gte=start_booking) |
                    Q(start_booking__lte=end_booking, end_booking__gte=end_booking) |
                    Q(start_booking__gte=start_booking, end_booking__lte=end_booking)
                ).values_list('apartment', flat=True)
            )
            serializer = self.get_serializer(apartments, many=True)
            return Response(serializer.data, status.HTTP_200_OK)
        else:
            return Response({"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)


class BookingApartmentView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = CreateBookingSerializer

    def post(self, request, *args, **kwargs):
        serializer = CreateBookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckBookingApartmentView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def list(self, request, *args, **kwargs):
        apart_id = self.kwargs.get('apart_id')
        if not apart_id:
            return Response({"error": "Apartment is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apartment = Apartment.objects.get(pk=apart_id)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found."}, status=status.HTTP_404_NOT_FOUND)

        bookingList = Booking.objects.filter(apartment=apartment)
        serializer = self.get_serializer(bookingList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class BookingUserApartmentView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def list(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        if not user_id:
            return Response({"error": "User is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        bookingList = Booking.objects.filter(client=user)
        serializer = self.get_serializer(bookingList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class RatingViewSet(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        apart_id = self.kwargs.get('apart_id')
        user_id = self.kwargs.get('user_id')
        if not apart_id:
            return Response({"error": "Apartment is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not user_id:
            return Response({"error": "User is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apartment = Apartment.objects.get(pk=apart_id)
            user = User.objects.get(pk=user_id)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found."}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        rating = Rating.objects.filter(apartment=apartment, client=user).first()
        serializer = self.get_serializer(rating, many=False)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = CreateRatingSerializer(data=request.data)
        if serializer.is_valid():
            rating = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateRatingViewSet(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = CreateRatingSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = CreateRatingSerializer(data=request.data)
        if serializer.is_valid():
            rating = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        apart_id = self.kwargs.get('apart_id')
        if not apart_id:
            return Response({"error": "Apartment is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apartment = Apartment.objects.get(pk=apart_id)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found."}, status=status.HTTP_404_NOT_FOUND)

        commentList = Comment.objects.filter(apartment=apartment)
        serializer = self.get_serializer(commentList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        print("TYT")
        serializer = CreateCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateCommentViewSet(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CreateCommentSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        print("TYT")
        serializer = CreateCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
