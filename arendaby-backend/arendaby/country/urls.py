from django.urls import path
from .views import CountryList, CityList, CitiesListByCountry, SearchingCityList, CityById

urlpatterns = [
    path('country/<int:pk>', CountryList.as_view(), name='county list'),
    path('country/', CountryList.as_view(), name='county list'),
    path('city/', CityList.as_view(), name='city list'),
    path('city/<int:pk>', CityById.as_view(), name='city by id'),
    path('city/search/', SearchingCityList.as_view(), name='searching-city'),
    path('cities/<int:country_id>', CitiesListByCountry.as_view(), name='city list'),
]