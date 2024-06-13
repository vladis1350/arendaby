from django.urls import path

from .views import (ApartmentViewList, ApartmentByCityViewList, ApartmentByTypeViewList, ApartmentTypeViewList,
                    ApartmentPhotoByApartmentViewList, SearchingApartmentsList)

urlpatterns = [
    path('apartment/city/get_photo/<int:pk>', ApartmentPhotoByApartmentViewList.as_view(), name='apartment_photos'),
    path('apartment/city/<int:city_id>', ApartmentByCityViewList.as_view(), name='apartment_by_city_list'),
    path('apartment/type/<str:type>', ApartmentByTypeViewList.as_view(), name='apartment_by_type_list'),
    path('apartment-type/list', ApartmentTypeViewList.as_view(), name='apartment_types'),
    path('apartment/list', ApartmentViewList.as_view(), name='county list'),
    path('apartment/search/', SearchingApartmentsList.as_view(), name='searching-city'),
    # path('apartment/search/?term=<str:apartment>', ApartmentSearchingViewList.as_view(), name='county list'),
]
