from django.urls import path

from .views import UserRegisterView

urlpatterns = [
    path('user/register/', UserRegisterView.as_view(), name='register'),
    # path('user/list/', GetUserListView.as_view(), name='user-list'),
]
