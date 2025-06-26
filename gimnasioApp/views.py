from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import UsuarioSerializer, UsuarioGymSerializer, UsuarioGymDaySerializer, MembresiasSerializer, MembresiaAsignadaSerializer
from .models import Usuario, UsuarioGym, UsuarioGymDay, Membresia, MembresiaAsignada
from django.utils import timezone
from django.http import JsonResponse
#para la imagen
from rest_framework.parsers import MultiPartParser, FormParser
#Para las filtraciones en la base de datos
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter


# Create your views here.
#esto nos sirve para que podamos crear el crud completo de los usuarios
class UserViewSet(viewsets.ModelViewSet): 
    serializer_class = UsuarioSerializer
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
            "user": UsuarioSerializer(user_data).data,
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
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                 # Verificar que la actualización fue exitosa
                #if updated_instance:
                    # print("Actualización exitosa")
                    #return Response(
                        #serializer.data,
                        #status=status.HTTP_200_OK
                    #)
            #     else:
            #         # print("Error: La actualización no devolvió una instancia")
            #         # Si algo salió mal, devolvemos la imagen anterior
            #         if old_avatar:
            #             instance.avatar = old_avatar
            #             instance.save()
            #         return Response(
            #             {"error": "Error al actualizar el usuario"},
            #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
            #         )
            # else:
            #     # print("Errores de validación:", serializer.errors)
            #     return Response(
            #         serializer.errors,
            #         status=status.HTTP_400_BAD_REQUEST
            #     )

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
            user_serializer = UsuarioSerializer(request.user, context={'request': request})
            user_data = user_serializer.data            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'user': user_data}, status=status.HTTP_200_OK)
         
    #esta clase nos sirve para listar los usuarios
    def list(self,request):
        try:
           users = Usuario.objects.all().order_by('-id')
           serializer = UsuarioSerializer(users, many=True, context={'request': request})
           return Response({'users': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
           return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)    
        
#clase para el crud de  miembros del gimnasio
class UsuarioGymViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioGymSerializer
    queryset = UsuarioGym.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'lastname']

#clase para el crud de  miembros del gimnasio por día
class UsuarioGymDayViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioGymDaySerializer
    queryset = UsuarioGymDay.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'lastname']

#funcion para mostrar los datos en las cards
class Home(APIView):
    def get(self, request):
        UserGymList = MembresiaAsignada.objects.all().order_by('-id')
        UserDayList = UsuarioGymDay.objects.all().order_by('-id')

        now = timezone.now()
        month = now.month
        year = now.year

        #Calculamos el numero de miembros 
        num_miembros = MembresiaAsignada.objects.count()

        #Filtramos los miembros del gimnasio registrados en el mes
        miembros_mes = MembresiaAsignada.objects.filter(dateInitial__month=month, dateInitial__year=year)
        #Cantidad de dinero miembros mensualidad
        total_gym_mes = sum(user.price for user in miembros_mes)

        #Filtramos los miembros del gimnasio registrados en el mes
        miembrosDay_mes = UsuarioGymDay.objects.filter(dateInitial__month=month, dateInitial__year=year)
        #Cantidad de dinero del dia
        total_day_mes = sum(user.price for user in miembrosDay_mes)

        #Cantidad de dinero del mes
        total_month = total_gym_mes + total_day_mes

        #Filtramos los miembros registrados en el mes actual
        miembros_mes = MembresiaAsignada.objects.filter(dateInitial__month=month, dateInitial__year=year).count()

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
class MembresiaViewSet(viewsets.ModelViewSet):
    serializer_class = MembresiasSerializer
    queryset = Membresia.objects.all()

class MembresiaAsignadaViewSet(viewsets.ModelViewSet):
    serializer_class = MembresiaAsignadaSerializer
    queryset = MembresiaAsignada.objects.select_related('miembro', 'membresia')
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['miembro__name', 'miembro__lastname']

    def get_queryset(self):
        miembro_id = self.request.query_params.get('miembro')
        # base_qset = MembresiaAsignada.objects.select_related('miembro', 'membresia')
        qs = super().get_queryset()
        return qs.filter(miembro_id=miembro_id) if miembro_id else qs