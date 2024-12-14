from .models import RegistrarUsuario
from rest_framework import viewsets, permissions
from .serializer import RegistrarUsuarioSerializer

class RegistrarUsuarioViewSet(viewsets.ModelViewSet):
    queryset = RegistrarUsuario.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistrarUsuarioSerializer