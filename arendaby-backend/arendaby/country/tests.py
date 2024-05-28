from django.test import TestCase

from .models import Country, City
from .serializers import CountrySerializer, CitySerializer


class CountriesTestCase(TestCase):
    def setUp(self):
        self.country = Country.objects.create(name="Test Belarus", description="Test Belarus desc")

    def test_country_model(self):
        country = Country.objects.get(name="Test Belarus")
        self.assertEquals(country.name, "Test Belarus")
        self.assertEquals(country.description, "Test Belarus desc")

    def test_country_serializer(self):
        serializer = CountrySerializer(instance=self.country)
        data = serializer.data
        self.assertEquals(data['name'], "Test Belarus")
        self.assertEquals(data['description'], "Test Belarus desc")


class CityTestCase(TestCase):
    def setUp(self):
        self.country = Country.objects.create(name="Belarus",
                                              description="Belarus desc")
        self.city = City.objects.create(name="Test Minsk",
                                        description="Test Minsk desc",
                                        country=self.country)

    def test_city_model_by_name(self):
        city = City.objects.get(name="Test Minsk")
        self.assertEquals(city.name, "Test Minsk")
        self.assertEquals(city.description, "Test Minsk desc")
        self.assertEquals(city.country, self.country)

    def test_city_model_by_country_and_name(self):
        country = Country.objects.get(name="Belarus")
        city = City.objects.get(country=country, name="Test Minsk")
        self.assertEquals(city.name, "Test Minsk")
        self.assertEquals(city.description, "Test Minsk desc")
        self.assertEquals(city.country, self.country)

    def test_city_serializer(self):
        city_serializer = CitySerializer(instance=self.city)
        country_serializer = CountrySerializer(instance=self.country)
        city_data = city_serializer.data
        country_data = country_serializer.data
        self.assertEquals(city_data['name'], 'Test Minsk')
        self.assertEquals(city_data['description'], 'Test Minsk desc')
        self.assertEquals(city_data['country'], country_data['id'])
