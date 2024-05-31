from django.urls import path

from .views import CreateUserView

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    # path('user/list/', GetUserListView.as_view(), name='user-list'),
]
