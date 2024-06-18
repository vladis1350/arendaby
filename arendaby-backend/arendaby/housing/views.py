from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import MenuItem, VocationIdeas
from .serializers import MenuItemSerializer, VocationIdeasSerializer


class MenuItemList(generics.ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny, ]


class UpdateMenuItem(generics.UpdateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]


class VocationIdeasList(generics.ListAPIView):
    queryset = VocationIdeas.objects.all()
    serializer_class = VocationIdeasSerializer
    permission_classes = [AllowAny, ]
