from django.urls import path
from .views import CountryList, CityList

urlpatterns = [
    path('country/', CountryList.as_view(), name='county list'),
    path('city/', CityList.as_view(), name='city list'),
]