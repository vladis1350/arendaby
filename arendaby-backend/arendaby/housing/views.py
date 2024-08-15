from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MenuItem, VocationIdeas, Idea
from .parser_apartment import parse_webpage
from .parser_ideas import get_
from .serializers import MenuItemSerializer, VocationIdeasSerializer, IdeaSerializer, IdeaTextSerializer


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


class IdeasList(generics.ListAPIView):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [AllowAny, ]

    def list(self, request, *args, **kwargs):
        v_id = self.kwargs.get('v_id')
        if not v_id:
            return Response({"error": "Vocation Ideas is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            vocation_ideas = VocationIdeas.objects.get(pk=v_id)
        except VocationIdeas.DoesNotExist:
            return Response({"error": "Vocation Ideas not found."}, status=status.HTTP_404_NOT_FOUND)

        ideaList = Idea.objects.filter(vocation_ideas=vocation_ideas)
        serializer = self.get_serializer(ideaList, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TextListView(APIView):

    def get(self, request):
        parse_webpage()
        serialized_text = IdeaTextSerializer(data={"long_text": "parse_data"})
        if serialized_text.is_valid():
            return Response(serialized_text.data)


@api_view(['GET'])
def get_parser_info(request):
    result = get_("https://sutochno.ru/info/gde-nedorogo-otdohnut-na-more-letom?from=mainpage")
    tag_list = []
    if len(result[1]) > 0:
        for item in result[1]:
            tag_list.append(item)

    res = {
        'titles': [item for item in result[0]],
        'text': [item.text for item in tag_list]
    }

    return Response(res)
