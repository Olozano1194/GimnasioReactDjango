from rest_framework import viewsets, status
from .serializers import RegistrarUsuarioSerializer
from .models import RegistrarUsuario

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

# Create your views here.
#esto nos sirve para que podamos crear de una vez el crud completo
class UserViewSet(viewsets.ModelViewSet): 
    serializer_class = RegistrarUsuarioSerializer
    queryset = RegistrarUsuario.objects.all()    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.save() #creamos el usuario
        #Generamos el token para el usuario creado
        token, created = Token.objects.get_or_create(user=user_data)
        #devolvemos el usuario y el token en la respuesta
        return Response({
            "user": UserSerializer(user_data).data,
            "token": token.key
            }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
         partial = kwargs.pop('partial', False)
         instance = self.get_object()
         serializer = self.get_serializer(instance, data=request.data, partial=partial)
         serializer.is_valid(raise_exception=True)
         user_data = serializer.save()
         #si se actualiza la contraseña el token se actualiza
         if 'password' in request.data:
             Token.objects.filter(user=user_data).delete()
             token, create = Token.objects.get_or_create(user=user_data)
         else:
             token = Token.objects.get(user=user_data)

         return Response({
             "user": UserSerializer(user_data).data,
             "token": token.key
         }, status=status.HTTP_200_OK)

#esta es la autenticación del usuario osea me guarda el token donde debe ser
class CustomAuthTokenViewSet(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

#esta clase nos sirve para mostrar los datos del usuario y poder hacer el login respectivo
class userProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
         
        user_serializer = UserSerializer(request.user)
        # print('User data:', user_serializer.data)
        try:
            student = Student.objects.get(user=request.user)
            student_serializer = StudentSerializer(student)
            student_data = student_serializer.data
        except Student.DoesNotExist:
             student_data = {}

        return Response({
             "user": user_serializer.data,
             "student": student_data
        })
    
    def put(self, request):
        user_data = request.data.get('user', {})
        student_data = request.data.get('student', {})

        #Manejo de la imagen
        if 'avatar' in request.FILES:
            student_data['avatar'] = request.FILES['avatar']



        user_serializer = UserSerializer(request.user, data=user_data, partial=True)

        student, created = Student.objects.get_or_create(user=request.user)
        student_serializer = StudentSerializer(student, data=student_data, partial=True)
        
        if user_serializer.is_valid() and student_serializer.is_valid():
            user_serializer.save()
            student_serializer.save()
            return Response({
                "user": user_serializer.data,
                "student": student_serializer.data
            })
        
        errors = {}
        if user_serializer.errors:
            errors['user'] = user_serializer.errors
        if student_serializer.errors:
            errors['student'] = student_serializer.errors
        
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        