from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('housing.urls')),
    path('api/', include('country.urls')),
    path('api/', include('user.urls')),
    path('api/', include('apartment.urls')),
    path('api-auth/', include('rest_framework.urls')),

    path('api/token', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
