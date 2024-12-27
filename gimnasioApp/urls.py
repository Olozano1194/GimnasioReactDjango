from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, CustomAuthTokenViewSet, userProfileView, RegistrarUsuarioGymViewSet, RegistrarUsuarioGymDayViewSet

#api versioning
router = routers.DefaultRouter()
router.register(r'UserGym', RegistrarUsuarioGymViewSet, basename='UserGym')
router.register(r'User', UserViewSet, basename='User')
router.register(r'UserGymDay', RegistrarUsuarioGymDayViewSet, basename='UserGymDay')


urlpatterns = [
    path('gym/api/v1/', include(router.urls)),
    
    path('gym/api/v1/login/', CustomAuthTokenViewSet.as_view(), name='login'),
    path('gym/api/v1/me/', userProfileView.as_view(), name='user-profile'),
    path('gym/api/v1/list', userProfileView.as_view(), name='user-list'),
]