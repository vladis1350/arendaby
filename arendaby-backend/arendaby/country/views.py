from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
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
