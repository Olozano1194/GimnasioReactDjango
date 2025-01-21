from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import RegistrarUsuarioSerializer, RegistrarUsuarioGymSerializer, RegistrarUsuarioGymDaySerializer, RegistrarMembresiasSerializer
from .models import RegistrarUsuario, RegistrarUsuarioGym, RegistrarUsuarioGymDay, RegistrarMembresias
from django.utils import timezone
from django.http import JsonResponse
#para la imagen
from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.exceptions import ValidationError


# Create your views here.
#esto nos sirve para que podamos crear de una vez el crud completo
class UserViewSet(viewsets.ModelViewSet): 
    serializer_class = RegistrarUsuarioSerializer
    queryset = get_user_model().objects.all()
    parser_classes = (MultiPartParser, FormParser)   

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores de validación:", serializer.errors)
            return Response({
                "error": "Datos inválidos",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        #Guardamos el usuario
        user_data = serializer.save()
        #Generamos el token
        token, created = Token.objects.get_or_create(user=user_data)

        return Response({
            "user": RegistrarUsuarioSerializer(user_data).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            # print("Datos antes de la validación:", request.data)

            # Se guarda la imagen anterior por si acaso
            old_avatar = instance.avatar if instance.avatar else None

            serializer = self.get_serializer(
                instance, 
                data=request.data, 
                partial=partial,
                context={'request': request}
            )

            if serializer.is_valid():
                # print("Datos válidos, procediendo con la actualización.")

                # Si hay avatar en los archivos, lo agregamos a los datos
                if 'avatar' in request.FILES:
                    if old_avatar:
                        instance.avatar.delete(save=False)
                    instance.avatar = request.FILES['avatar']

                updated_instance = serializer.save()

                 # Verificar que la actualización fue exitosa
                if updated_instance:
                    # print("Actualización exitosa")
                    return Response(
                        serializer.data,
                        status=status.HTTP_200_OK
                    )
                else:
                    # print("Error: La actualización no devolvió una instancia")
                    # Si algo salió mal, devolvemos la imagen anterior
                    if old_avatar:
                        instance.avatar = old_avatar
                        instance.save()
                    return Response(
                        {"error": "Error al actualizar el usuario"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                # print("Errores de validación:", serializer.errors)
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print("Error inesperado:", str(e))
            return Response({"error": "Error inesperado"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#esta es la autenticación del usuario osea me guarda el token donde debe ser
class CustomAuthTokenViewSet(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        #autenticamos el usuario
        user = authenticate(request, email=email, password=password)
        #si el usuario es correcto generamos el token
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales invalidas'}, status=status.HTTP_400_BAD_REQUEST)

#esta clase nos sirve para mostrar los datos del usuario y poder hacer el login respectivo
class userProfileView(APIView):
    permission_classes = [IsAuthenticated]
    #parser_classes = (MultiPartParser, FormParser) #para poder subir archivos

    def get(self, request):
        try:
            user_serializer = RegistrarUsuarioSerializer(request.user, context={'request': request})
            user_data = user_serializer.data            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'user': user_data}, status=status.HTTP_200_OK)
         
    #esta clase nos sirve para listar los usuarios
    def list(self,request):
        try:
           users = RegistrarUsuario.objects.all().order_by('-id')
           serializer = RegistrarUsuarioSerializer(users, many=True, context={'request': request})
           return Response({'users': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
           return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)    
        
#clase para la crud de  miembros del gimnasio
class RegistrarUsuarioGymViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrarUsuarioGymSerializer
    queryset = RegistrarUsuarioGym.objects.all()

#clase para la crud de  miembros del gimnasio por día
class RegistrarUsuarioGymDayViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrarUsuarioGymDaySerializer
    queryset = RegistrarUsuarioGymDay.objects.all()

#funcion para mostrar los datos en las cards
class Home(APIView):
    def get(self, request):
        UserGymList = RegistrarUsuarioGym.objects.all().order_by('-id')
        UserDayList = RegistrarUsuarioGymDay.objects.all().order_by('-id')

        now = timezone.now()
        month = now.month
        year = now.year

        #Calculamos el numero de miembros 
        num_miembros = RegistrarUsuarioGym.objects.count()

        #Filtramos los miembros del gimnasio registrados en el mes
        miembros_mes = RegistrarUsuarioGym.objects.filter(dateInitial__month=month, dateInitial__year=year)
        #Cantidad de dinero miembros mensualidad
        total_gym_mes = sum(user.price for user in miembros_mes)

        #Filtramos los miembros del gimnasio registrados en el mes
        miembrosDay_mes = RegistrarUsuarioGymDay.objects.filter(dateInitial__month=month, dateInitial__year=year)
        #Cantidad de dinero del dia
        total_day_mes = sum(user.price for user in miembrosDay_mes)

        #Cantidad de dinero del mes
        total_month = total_gym_mes + total_day_mes

        #Filtramos los miembros registrados en el mes actual
        miembros_mes = RegistrarUsuarioGym.objects.filter(dateInitial__month=month, dateInitial__year=year).count()

        #Total de dinero en el gym
        total_gym = sum(user.price for user in UserGymList)
        total_day = sum(user.price for user in UserDayList)
        total = total_gym + total_day                                                     

        return JsonResponse({ 
            'num_miembros': num_miembros, 
            'total_month': total_month, 
            'miembros_mes': miembros_mes,
            'total': total
            })

# clase para el crud de los miembros del gimnasio
class RegistrarMembresiaViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrarMembresiasSerializer
    queryset = RegistrarMembresias.objects.all()