from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import UsuarioSerializer, UsuarioGymSerializer, UsuarioGymDaySerializer, MembresiasSerializer, MembresiaAsignadaSerializer
from .models import Usuario, UsuarioGym, UsuarioGymDay, Membresia, MembresiaAsignada, Gimnasio
from django.utils import timezone
from django.http import JsonResponse
#para la imagen
from rest_framework.parsers import MultiPartParser, FormParser
#Para las filtraciones en la base de datos
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
#Para las notificaciones
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes

# Importar permisos personalizados
from .permissions import IsAdminUser, IsRecepcionUser


# ============================================================
# HELPERS
# ============================================================

def get_user_gimnasio(request):
    """Obtiene el gimnasio del usuario autenticado."""
    if hasattr(request.user, 'gimnasio') and request.user.gimnasio:
        return request.user.gimnasio
    return None


# ============================================================
# VIEWSETS
# ============================================================

class UserViewSet(viewsets.ModelViewSet): 
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]  # Solo admins pueden gestionar usuarios
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        """Filtrar usuarios por gimnasio del usuario actual."""
        queryset = get_user_model().objects.all()
        gimnasio = get_user_gimnasio(self.request)
        if gimnasio:
            queryset = queryset.filter(gimnasio=gimnasio)
        return queryset.order_by('-id')
    
    def perform_create(self, serializer):
        """Asignar automáticamente el gimnasio del usuario actual al crear."""
        gimnasio = get_user_gimnasio(self.request)
        serializer.save(gimnasio=gimnasio)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "error": "Datos inválidos",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        user_data = serializer.save()
        token, created = Token.objects.get_or_create(user=user_data)

        return Response({
            "user": UsuarioSerializer(user_data, context={'request': request}).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            old_avatar = instance.avatar if instance.avatar else None

            serializer = self.get_serializer(
                instance, 
                data=request.data, 
                partial=partial,
                context={'request': request}
            )

            if serializer.is_valid():
                if 'avatar' in request.FILES:
                    if old_avatar:
                        old_avatar.delete(save=False)
                    instance.avatar = request.FILES['avatar']

                updated_instance = serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "Error inesperado"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Login NO requiere autenticación (AllowAny)
class CustomAuthTokenViewSet(APIView):
    permission_classes = [AllowAny]  # Login es público
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, email=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales invalidas'}, status=status.HTTP_400_BAD_REQUEST)


class userProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_serializer = UsuarioSerializer(request.user, context={'request': request})
            user_data = user_serializer.data            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'user': user_data}, status=status.HTTP_200_OK)
          
    def list(self, request):
        try:
            gimnasio = get_user_gimnasio(request)
            if gimnasio:
                users = Usuario.objects.filter(gimnasio=gimnasio).order_by('-id')
            else:
                users = Usuario.objects.none()
            serializer = UsuarioSerializer(users, many=True, context={'request': request})
            return Response({'users': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)    


# ============================================================
# MIEMBROS DEL GIMNASIO
# ============================================================

class UsuarioGymViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioGymSerializer
    permission_classes = [IsAuthenticated, IsRecepcionUser]  # Admin y recepcion pueden acceder
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'lastname']
    
    def get_queryset(self):
        """Filtrar miembros por gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        if gimnasio:
            return UsuarioGym.objects.filter(gimnasio=gimnasio)
        return UsuarioGym.objects.none()
    
    def perform_create(self, serializer):
        """Asignar automáticamente el gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        serializer.save(gimnasio=gimnasio)


class UsuarioGymDayViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioGymDaySerializer
    permission_classes = [IsAuthenticated, IsRecepcionUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'lastname']
    
    def get_queryset(self):
        """Filtrar miembros diarios por gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        if gimnasio:
            return UsuarioGymDay.objects.filter(gimnasio=gimnasio)
        return UsuarioGymDay.objects.none()
    
    def perform_create(self, serializer):
        """Asignar automáticamente el gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        serializer.save(gimnasio=gimnasio)


# ============================================================
# HOME / DASHBOARD
# ============================================================

class Home(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        gimnasio = get_user_gimnasio(request)
        
        # Base querysets filtradas por gimnasio
        if gimnasio:
            UserGymList = MembresiaAsignada.objects.filter(miembro__gimnasio=gimnasio).order_by('-id')
            UserDayList = UsuarioGymDay.objects.filter(gimnasio=gimnasio).order_by('-id')
        else:
            UserGymList = MembresiaAsignada.objects.none()
            UserDayList = UsuarioGymDay.objects.none()

        now = timezone.now()
        month = now.month
        year = now.year

        num_miembros = UserGymList.count()

        #Filtramos los miembros del gimnasio registrados en el mes
        miembros_mes = UserGymList.filter(dateInitial__month=month, dateInitial__year=year)
        total_gym_mes = sum(user.price for user in miembros_mes)

        miembrosDay_mes = UserDayList.filter(dateInitial__month=month, dateInitial__year=year)
        total_day_mes = sum(user.price for user in miembrosDay_mes)

        total_month = total_gym_mes + total_day_mes
        miembros_mes_count = miembros_mes.count()

        total_gym = sum(user.price for user in UserGymList)
        total_day = sum(user.price for user in UserDayList)
        total = total_gym + total_day                                                    

        return JsonResponse({ 
            'num_miembros': num_miembros, 
            'total_month': float(total_month), 
            'miembros_mes': miembros_mes_count,
            'total': float(total)
        })


# ============================================================
# MEMBRESIAS
# ============================================================

class MembresiaViewSet(viewsets.ModelViewSet):
    serializer_class = MembresiasSerializer
    permission_classes = [IsAuthenticated, IsRecepcionUser]
    
    def get_queryset(self):
        """Filtrar membresías por gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        if gimnasio:
            return Membresia.objects.filter(gimnasio=gimnasio)
        return Membresia.objects.none()
    
    def perform_create(self, serializer):
        """Asignar automáticamente el gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        serializer.save(gimnasio=gimnasio)


class MembresiaAsignadaViewSet(viewsets.ModelViewSet):
    serializer_class = MembresiaAsignadaSerializer
    permission_classes = [IsAuthenticated, IsRecepcionUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['miembro__name', 'miembro__lastname']

    def get_queryset(self):
        """Filtrar membresías asignadas por gimnasio del usuario actual."""
        gimnasio = get_user_gimnasio(self.request)
        qs = MembresiaAsignada.objects.select_related('miembro', 'membresia', 'miembro__gimnasio')
        
        if gimnasio:
            qs = qs.filter(miembro__gimnasio=gimnasio)
        
        # Filtro adicional por miembro si se pasa
        miembro_id = self.request.query_params.get('miembro')
        if miembro_id:
            qs = qs.filter(miembro_id=miembro_id)
        
        return qs.order_by('-id')


# ============================================================
# NOTIFICATIONS
# ============================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def membership_notifications(request):
    gimnasio = get_user_gimnasio(request)
    
    today = datetime.now().date()
    three_day_later = today + timedelta(days=3)
    
    # Base queryset filtrada por gimnasio
    if gimnasio:
        expiring_memberships = MembresiaAsignada.objects.filter(
            miembro__gimnasio=gimnasio,
            dateFinal__gte=today,
            dateFinal__lte=three_day_later
        ).select_related('miembro', 'membresia', 'miembro__gimnasio')
        
        expired_memberships = MembresiaAsignada.objects.filter(
            miembro__gimnasio=gimnasio,
            dateFinal__lte=today
        ).select_related('miembro', 'membresia', 'miembro__gimnasio')
    else:
        expiring_memberships = MembresiaAsignada.objects.none()
        expired_memberships = MembresiaAsignada.objects.none()

    notifications = []

    for membership in expiring_memberships:
        days_left = (membership.dateFinal - today).days
        notifications.append({
            'type': 'warning',
            'title': 'Membresía próxima a expirar',
            'message': f'La membresía de {membership.miembro.name} {membership.miembro.lastname} - {membership.membresia.name} expirará en {days_left} días.',
            'date': membership.dateFinal.strftime('%d/%m/%Y'),
            'link': f'/dashboard/membresia/{membership.id}/'
        })
    
    for membership in expired_memberships:
        notifications.append({
            'type': 'danger',
            'title': 'Membresía vencida',
            'message': f'La membresía de {membership.miembro.name} {membership.miembro.lastname} - {membership.membresia.name} ya venció.',
            'date': membership.dateFinal.strftime('%d/%m/%Y'),
            'link': f'/dashboard/membresia/{membership.id}/'
        })
    
    return Response(notifications)