from rest_framework import serializers
from .models import Usuario, UsuarioGym, UsuarioGymDay, Membresia, MembresiaAsignada
from datetime import timedelta

#token
from rest_framework.authtoken.models import Token

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Usuario
        fields = '__all__'
        read_only_fields = ('id','created_at', 'is_active',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Hacemos que el email sea solo lectura si estamos actualizando un usuario
        if self.instance:
            #self.fields['email'].read_only = True
            self.fields['email'].required = False
    
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres")
        return value
    
    def create(self, validated_data):
        #ciframos la contraseña antes de crear el usuario
        password = validated_data.pop('password')
        user = Usuario(**validated_data) #creamos el usuario
        #ciframos la contraseña
        user.set_password(password)

        #guardamos el usuario
        user.save()

        #Generamos el token para poder loguearse
        token = Token.objects.create(user=user)

        return user
    
    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def update(self, instance, validated_data):
        try:
            avatar = validated_data.get('avatar')
            print(f"Avatar recibido: {avatar}")
            # Manejo de la contraseña
            if 'password' in validated_data:
                password = validated_data.pop('password')
                instance.set_password(password)
            
            # Manejo del avatar
            if 'avatar' in validated_data:
                instance.avatar = validated_data['avatar']

            # Actualizar los demás campos
            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            instance.save()
            return instance
            
        except Exception as e:
            print("Error en el serializer update:", str(e))
            raise

class UsuarioGymSerializer(serializers.ModelSerializer):
    #Formato para mostrar las fechas
    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    dateFinal = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])

    class Meta:
        model = UsuarioGym
        fields = '__all__'
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

class UsuarioGymDaySerializer(serializers.ModelSerializer):
    #Formato para mostrar las fechas
    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    

    class Meta:
        model = UsuarioGymDay
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        # Esto nos permite personalizar aún más la representación de los datos
        representation = super().to_representation(instance)
        
        # Aseguramos que las fechas estén en el formato correcto
        if instance.dateInitial:
            representation['dateInitial'] = instance.dateInitial.strftime("%d-%m-%Y")        
            
        return representation

class MembresiasSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Membresia
        fields = '__all__'
        read_only_fields = ('id',)

class MembresiaAsignadaSerializer(serializers.ModelSerializer):
    miembro = UsuarioGymSerializer(read_only=True)
    membresia = MembresiasSerializer(read_only=True)

    class Meta:
        model = MembresiaAsignada
        fields = '__all__'
        read_only_fields = ('id',)

    def create(self, validated_data):
        membresia = validated_data['membresia']
        validated_data['dateFinal'] = validated_data['dateInitial'] + timedelta(days=membresia.duration)
        return super().create(validated_data)