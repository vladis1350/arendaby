from django.test import TestCase

from .models import Country
from .serializers import CountrySerializer


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
