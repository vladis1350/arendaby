from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from country.models import City
from .models import Apartment, ApartmentType
from .serializers import ApartmentSerializer, ApartmentTypeSerializer


class ApartmentViewList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]


class ApartmentByCityViewList(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        city_name = self.kwargs.get('city')
        if not city_name:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            city = City.objects.get(name=city_name)
        except City.DoesNotExist:
            return Response({"error": "City not found."}, status=status.HTTP_404_NOT_FOUND)

        apartmentList = Apartment.objects.filter(city=city)
        serializer = self.get_serializer(apartmentList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


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
