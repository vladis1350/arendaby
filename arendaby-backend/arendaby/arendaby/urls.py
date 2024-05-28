from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from housing.views import MenuItemList, VocationIdeasList

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('housing.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
