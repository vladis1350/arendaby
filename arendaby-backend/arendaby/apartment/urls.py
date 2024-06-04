from django.urls import path

from .views import ApartmentViewList, ApartmentByCityViewList, ApartmentByTypeViewList

urlpatterns = [
    path('apartment/city/<str:city>', ApartmentByCityViewList.as_view(), name='apartment_by_city_list'),
    path('apartment/type/<str:type>', ApartmentByTypeViewList.as_view(), name='apartment_by_type_list'),
    path('apartment/list', ApartmentViewList.as_view(), name='county list'),
]
