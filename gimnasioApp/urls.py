from rest_framework import routers
from .api import RegistrarUsuarioViewSet

router =routers.DefaultRouter()

router.register('api/gimnasio', RegistrarUsuarioViewSet, 'registrarUsuario')

urlpatterns = router.urls

