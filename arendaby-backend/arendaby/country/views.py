from rest_framework import generics

from .models import Country, City
from .serializers import CountrySerializer, CitySerializer


class CountryList(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class CityList(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
