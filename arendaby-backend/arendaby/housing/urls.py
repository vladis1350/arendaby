from django.urls import path, include

from .views import MenuItemList, VocationIdeasList, UpdateMenuItem, IdeasList, TextListView

urlpatterns = [
    path('menu/', MenuItemList.as_view(), name='menu-list'),
    path('menu/update', UpdateMenuItem.as_view(), name='menu-update'),
    path('v-ideas/', VocationIdeasList.as_view(), name='ideas-list'),
    path('v-ideas/idea/<int:v_id>', IdeasList.as_view(), name='ideas'),
    path('parser', TextListView.as_view(), name='ideas'),
    path('api-auth/', include('rest_framework.urls'))
]
