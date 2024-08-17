import pytz
from country.models import City
from django.db.models import Q
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from user.models import User

from .models import Apartment, ApartmentType, ApartmentPhoto, GroupApartmentType, Booking, Rating, Comment, UserActivity
from .serializers import ApartmentSerializer, ApartmentPhotoSerializer, ApartmentTypeSerializer, \
    GroupApartmentTypeSerializer, ApartmentCreateSerializer, CreateBookingSerializer, BookingSerializer, \
    RatingSerializer, CommentSerializer, CreateCommentSerializer, CreateRatingSerializer, UserActivitySerializer, \
    CreateUserActivitySerializer

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
        serializer = CreateCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteBookingApartmentView(generics.DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        booking_id = self.kwargs.get('booking_id')
        if not booking_id:
            return Response({"error": "Booking is required."}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.get(pk=booking_id)
        booking.delete()

        return Response({'message': 'Booking cancelled successfully.'}, status=204)


class UserActivityViewSet(generics.ListCreateAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    # permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        if not user_id:
            return Response({"error": "User is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(pk=user_id)
        user_activities = UserActivity.objects.filter(user=user)
        serializer = self.get_serializer(user_activities, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class UpdateUserActivityViewSet(generics.UpdateAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = (AllowAny,)
    lookup_field = "id"


class CreateUserActivityViewSet(generics.CreateAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = CreateUserActivitySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = CreateUserActivitySerializer(data=request.data)
        if serializer.is_valid():
            user_activity = serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserActivityByApartViewSet(generics.CreateAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        apart_id = self.kwargs.get('apart_id')
        if not user_id:
            return Response({"error": "User is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not apart_id:
            return Response({"error": "Apartment is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(pk=user_id)
        apartment = Apartment.objects.get(pk=apart_id)
        user_activities = UserActivity.objects.filter(user=user, apartment=apartment)
        serializer = self.get_serializer(user_activities, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


def filter_apartments(request):
    # Получение фильтров из запроса
    city_id = request.GET.get('city')
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')
    group_ids = request.GET.getlist('group_ids')  # Предполагается, что это список ID групп

    # Начинаем с базового запроса
    apartments = Apartment.objects.all()

    # Фильтрация по диапазону цен
    if price_min:
        apartments = apartments.filter(price__gte=price_min)
    if price_max:
        apartments = apartments.filter(price__lte=price_max)

    # Фильтрация по группам
    if group_ids:
        apartments = apartments.filter(type__group__id__in=group_ids)

    if city_id:
        apartments = apartments.filter(city__id=city_id)

    # Возврат отфильтрованных апартаментов в формате JSON
    apartments_data = [
        {"id": apartment.id, "price": apartment.price, "type": apartment.type.type_name, "city": apartment.city.name}
        for
        apartment in
        apartments]
    return JsonResponse(apartments_data, safe=False)


class ApartmentAllListViewList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = (AllowAny,)


class FilterApartmentsView(generics.ListAPIView):
    serializer_class = ApartmentSerializer

    def get_queryset(self):
        # filter_serializer = ApartmentFilterSerializer(data=self.request.query_params)
        # if not filter_serializer.is_valid():
        #     raise ValidationError(filter_serializer.errors)
        # queryset = Apartment.objects.all()

        # Получение параметров фильтрации из запроса
        global queryset
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        group_ids = self.request.query_params.getlist('group_ids')
        city_id = self.request.query_params.get('city')

        # Фильтрация по диапазону цен
        if price_min is not None:
            queryset = queryset.filter(price__gte=price_min)
        if price_max is not None:
            queryset = queryset.filter(price__lte=price_max)

        # Фильтрация по группам
        if group_ids:
            queryset = queryset.filter(type__group__id__in=group_ids)

        # Фильтрация по городу
        if city_id is not None:
            queryset = queryset.filter(city__id=city_id)

        return queryset
