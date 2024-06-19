from django.urls import path

from .views import UserRegisterView, UsersListView, UsersProfileListView, UserDetailView

urlpatterns = [
    path('user/register/', UserRegisterView.as_view(), name='register'),
    path('user/list/', UsersListView.as_view(), name='user-list'),
    path('user-profile/list/', UsersProfileListView.as_view(), name='user-profile-list'),
    path('user/<int:pk>', UserDetailView.as_view(), name='user-profile-list'),
]
