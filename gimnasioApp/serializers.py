from rest_framework import serializers
from .models import RegistrarUsuario, RegistrarUsuarioGym, RegistrarUsuarioGymDay
from rest_framework.exceptions import ValidationError

#token
from rest_framework.authtoken.models import Token

class RegistrarUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = RegistrarUsuario
        fields = '__all__'
        read_only_fields = ('id','created_at', 'email', 'is_active')

    
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
    
    def update(self, instance, validated_data):
        # evitamos modificar el campo is_active eliminandolo de la actualización
        validated_data.pop('is_active', None)
        validated_data.pop('email', None)

        # Si existe una nueva contraseña se actualiza
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        # Manejo del avatar
        if 'avatar' in validated_data:
            # Si hay un avatar anterior y estamos subiendo uno nuevo, eliminar el anterior
            if instance.avatar and instance.avatar != validated_data['avatar']:
                instance.avatar.delete(save=False)
            instance.avatar = validated_data['avatar']

        # Actualizamos el resto de los campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Guardamos los cambios
        instance.save()

class RegistrarUsuarioGymSerializer(serializers.ModelSerializer):
    #Formato para mostrar las fechas
    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    dateFinal = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])

    class Meta:
        model = RegistrarUsuarioGym
        fields = ['id', 'name', 'lastname', 'phone', 'address', 'dateInitial', 'dateFinal','price']
        read_only_fields = ('id',)

    def to_representation(self, instance):
        # Esto nos permite personalizar aún más la representación de los datos
        representation = super().to_representation(instance)
        
        # Aseguramos que las fechas estén en el formato correcto
        if instance.dateInitial:
            representation['dateInitial'] = instance.dateInitial.strftime("%d-%m-%Y")
        if instance.dateFinal:
            representation['dateFinal'] = instance.dateFinal.strftime("%d-%m-%Y")
            
        return representation

class RegistrarUsuarioGymDaySerializer(serializers.ModelSerializer):
    #Formato para mostrar las fechas
    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    

    class Meta:
        model = RegistrarUsuarioGymDay
        fields = ['id', 'name', 'lastname', 'phone', 'dateInitial','price']
        read_only_fields = ('id',)

    def to_representation(self, instance):
        # Esto nos permite personalizar aún más la representación de los datos
        representation = super().to_representation(instance)
        
        # Aseguramos que las fechas estén en el formato correcto
        if instance.dateInitial:
            representation['dateInitial'] = instance.dateInitial.strftime("%d-%m-%Y")        
            
        return representation