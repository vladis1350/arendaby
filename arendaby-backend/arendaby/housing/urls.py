from django.urls import path, include

from .views import MenuItemList, VocationIdeasList, UpdateMenuItem

urlpatterns = [
    path('menu/', MenuItemList.as_view(), name='menu-list'),
    path('menu/update', UpdateMenuItem.as_view(), name='menu-update'),
    path('ideas/', VocationIdeasList.as_view(), name='ideas-list'),
    path('api-auth/', include('rest_framework.urls'))
]
