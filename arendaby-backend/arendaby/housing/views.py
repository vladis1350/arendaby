from rest_framework import generics

from .models import MenuItem, VocationIdeas
from .serializers import MenuItemSerializer, VocationIdeasSerializer


class MenuItemList(generics.ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


class VocationIdeasList(generics.ListAPIView):
    queryset = VocationIdeas.objects.all()
    serializer_class = VocationIdeasSerializer
