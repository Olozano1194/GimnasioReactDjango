from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, CustomAuthTokenViewSet, userProfileView

#api versioning
router = routers.DefaultRouter()
router.register(r'User', UserViewSet, basename='User')

urlpatterns = [
    path('gym/api/v1/', include(router.urls)),

    path('gym/api/v1/login/', CustomAuthTokenViewSet.as_view(), name='login'),
    path('gym/api/v1/me/', userProfileView.as_view(), name='user-profile'),
]