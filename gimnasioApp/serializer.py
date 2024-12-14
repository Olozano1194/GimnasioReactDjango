from rest_framework import serializers
from .models import RegistrarUsuario, RegistrarUsuarioGym, RegistrarUsuarioGymDay

#token
from rest_framework.authtoken.models import Token

#encriptación
from django.contrib.auth.hashers import make_password

# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         #fields = ('id', 'name', 'lastName', 'email', 'password', 'phone', 'address', 'created_at')
#         fields = '__all__'
#         read_only_fields = ('id', 'created_at',) #aca podemos colocar todas las tablas que solo van a ser de lectura


class RegistrarUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = RegistrarUsuario
        fields = '__all__'
        read_only_fields = ('id','created_at',)

    
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres")
        return value
    
    def create(self, validated_data):
        #ciframos la contraseña antes de crear el usuario
        validated_data['password'] = make_password(validated_data['password'])

        #Creamos el usuario
        user = super().create(validated_data)

        #Generamos el codigo para poder loguearse
        token = Token.objects.create(user=user)

        return user