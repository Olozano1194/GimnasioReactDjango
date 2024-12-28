from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import RegistrarUsuarioSerializer, RegistrarUsuarioGymSerializer, RegistrarUsuarioGymDaySerializer
from .models import RegistrarUsuario, RegistrarUsuarioGym, RegistrarUsuarioGymDay
from django.utils import timezone
from django.http import JsonResponse



# Create your views here.
#esto nos sirve para que podamos crear de una vez el crud completo
class UserViewSet(viewsets.ModelViewSet): 
    serializer_class = RegistrarUsuarioSerializer
    queryset = get_user_model().objects.all()    

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
    

    # def update(self, request, *args, **kwargs):
    #      partial = kwargs.pop('partial', False)
    #      instance = self.get_object()
    #      serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #      serializer.is_valid(raise_exception=True)
    #      user_data = serializer.save()
    #      #si se actualiza la contraseña el token se actualiza
    #      if 'password' in request.data:
    #          Token.objects.filter(user=user_data).delete()
    #          token, create = Token.objects.get_or_create(user=user_data)
    #      else:
    #          token = Token.objects.get(user=user_data)

    #      return Response({
    #          "user": UserSerializer(user_data).data,
    #          "token": token.key
    #      }, status=status.HTTP_200_OK)

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
            user_serializer = RegistrarUsuarioSerializer(request.user)
            user_data = user_serializer.data            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'user': user_data}, status=status.HTTP_200_OK)
         
    #esta clase nos sirve para listar los usuarios
    def list(self,request):
        try:
           users = RegistrarUsuario.objects.all().order_by('-id')
           serializer = RegistrarUsuarioSerializer(users, many=True)
           return Response({'users': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
           return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  
    
    # def put(self, request):
    #     user_data = request.data.get('user', {})
    #     #student_data = request.data.get('student', {})

    #     #Manejo de la imagen
    #     #if 'avatar' in request.FILES:
    #         #student_data['avatar'] = request.FILES['avatar']



    #     user_serializer = RegistrarUsuarioSerializer(request.user, data=user_data, partial=True)

    #     student, created = Student.objects.get_or_create(user=request.user)
    #     student_serializer = StudentSerializer(student, data=student_data, partial=True)
        
    #     if user_serializer.is_valid() and student_serializer.is_valid():
    #         user_serializer.save()
    #         student_serializer.save()
    #         return Response({
    #             "user": user_serializer.data,
    #             "student": student_serializer.data
    #         })
        
    #     errors = {}
    #     if user_serializer.errors:
    #         errors['user'] = user_serializer.errors
    #     if student_serializer.errors:
    #         errors['student'] = student_serializer.errors
        
    #     return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
#clase para la creación de  miembros del gimnasio
class RegistrarUsuarioGymViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrarUsuarioGymSerializer
    queryset = RegistrarUsuarioGym.objects.all()

#clase para la creación de  miembros del gimnasio
class RegistrarUsuarioGymDayViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrarUsuarioGymDaySerializer
    queryset = RegistrarUsuarioGymDay.objects.all()

#funcion para la creación de las cards

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
