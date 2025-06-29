from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, CustomAuthTokenViewSet, userProfileView, UsuarioGymViewSet, UsuarioGymDayViewSet, Home, MembresiaViewSet, MembresiaAsignadaViewSet, membership_notifications

#api versioning
router = routers.DefaultRouter()
router.register(r'UserGym', UsuarioGymViewSet, basename='UserGym')
router.register(r'User', UserViewSet, basename='User')
router.register(r'UserGymDay', UsuarioGymDayViewSet, basename='UserGymDay')
router.register(r'MemberShips', MembresiaViewSet, basename='MemberShips')
router.register(r'MemberShipsAsignada', MembresiaAsignadaViewSet, basename='MemberShipsAsignada')

urlpatterns = [
    path('gym/api/v1/', include(router.urls)),      
    
    path('gym/api/v1/login/', CustomAuthTokenViewSet.as_view(), name='login'),
    path('gym/api/v1/me/', userProfileView.as_view(), name='user-profile'),
    path('gym/api/v1/list/', userProfileView.as_view(), name='user-list'),
    path('gym/api/v1/home/', Home.as_view(), name='home'),
    path('gym/api/v1/membership-notifications/', membership_notifications, name='membership-notifications'),    
]