from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import serializers
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = (AllowAny,)


# class GetUserListView(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = (AllowAny,)
