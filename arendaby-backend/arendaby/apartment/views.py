from country.models import City
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Apartment, ApartmentType, ApartmentPhoto, GroupApartmentType
from .serializers import ApartmentSerializer, ApartmentPhotoSerializer, ApartmentTypeSerializer, \
    GroupApartmentTypeSerializer, ApartmentCreateSerializer


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
        print(request.data)
        print(serializer)
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


class ApartmentById(generics.RetrieveAPIView):
    queryset = Apartment
    serializer_class = ApartmentSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        apart_id = self.kwargs.get('apart_id')
        try:
            apartment = Apartment.objects.get(pk=apart_id)
        except Apartment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ApartmentSerializer(apartment)
        return Response(serializer.data)


