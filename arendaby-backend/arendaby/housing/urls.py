from django.urls import path, include

from .views import MenuItemList, VocationIdeasList

urlpatterns = [
    path('menu/', MenuItemList.as_view(), name='menu-list'),
    path('ideas/', VocationIdeasList.as_view(), name='ideas-list'),
    path('api-auth/', include('rest_framework.urls'))
]
