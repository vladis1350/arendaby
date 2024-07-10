from django.urls import path

from .views import (ApartmentViewList, ApartmentByCityViewList, ApartmentByTypeViewList, ApartmentTypeViewList,
                    ApartmentPhotoByApartmentViewList, SearchingApartmentsList, GroupApartmentTypeList,
                    ApartmentTypeByGroupIdViewList, RentApartmentView, ApartmentByIdView, BookingApartmentView,
                    ApartmentFilterView, BookingUserApartmentView)

urlpatterns = [
    path('apartment/city/get_photo/<int:pk>', ApartmentPhotoByApartmentViewList.as_view(), name='apartment_photos'),
    path('apartment/city/<int:city_id>', ApartmentByCityViewList.as_view(), name='apartment_by_city_list'),
    path('apartment/type/<str:type>', ApartmentByTypeViewList.as_view(), name='apartment_by_type_list'),
    path('apartment/types/<int:group_id>', ApartmentTypeByGroupIdViewList.as_view(),
         name='apartment_type_by_group_list'),
    path('apartment-type/list', ApartmentTypeViewList.as_view(), name='apartment_types'),
    path('apartment/list', ApartmentViewList.as_view(), name='county list'),
    path('apartment/search/', SearchingApartmentsList.as_view(), name='searching-city'),
    path('apartment/groups/', GroupApartmentTypeList.as_view(), name='group_type_apartment'),
    path('apartment/create/', RentApartmentView.as_view(), name='create_apartment'),
    path('apartment/<int:apart_id>', ApartmentByIdView.as_view(), name='get_apartment'),
    path('apartment/booking/create/', BookingApartmentView.as_view(), name='booking_apartment'),
    path('apartment/booking/filter/', ApartmentFilterView.as_view(), name='filter_apartment'),
    path('booking/user/<int:user_id>', BookingUserApartmentView.as_view(), name='filter_apartment'),
    # path('apartment/search/?term=<str:apartment>', ApartmentSearchingViewList.as_view(), name='county list'),
]
