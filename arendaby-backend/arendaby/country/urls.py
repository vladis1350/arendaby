from django.urls import path
from .views import CountryList, CityList, CitiesListByCountry

urlpatterns = [
    path('country/<int:pk>', CountryList.as_view(), name='county list'),
    path('country/', CountryList.as_view(), name='county list'),
    path('city/', CityList.as_view(), name='city list'),
    path('cities/<int:pk>', CitiesListByCountry.as_view(), name='city list'),
]