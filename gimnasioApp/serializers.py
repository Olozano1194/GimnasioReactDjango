from rest_framework import serializers
from .models import RegistrarUsuario, RegistrarUsuarioGym, RegistrarUsuarioGymDay

#token
from rest_framework.authtoken.models import Token

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
        password = validated_data.pop('password')
        user = RegistrarUsuario(**validated_data) #creamos el usuario
        #ciframos la contraseña
        user.set_password(password)

        #guardamos el usuario
        user.save()

        #Generamos el token para poder loguearse
        token = Token.objects.create(user=user)

        return user
    
    
