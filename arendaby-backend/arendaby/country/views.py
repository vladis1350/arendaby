from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Country, City
from .serializers import CountrySerializer, CitySerializer


class CountryList(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]


class CityList(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [AllowAny]


class CitiesListByCountry(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        id_country = super().get_object().id
        if not id_country:
            return Response({"error": "Country name is required."}, status=status.HTTP_400_BAD_REQUEST)

        country = Country.objects.get(pk=id_country)
        citiesList = City.objects.filter(country=country)
        serializer = self.get_serializer(citiesList, many=True)
        return Response(serializer.data, status.HTTP_200_OK)
