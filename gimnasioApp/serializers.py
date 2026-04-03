from rest_framework import serializers
from .models import Gimnasio, Usuario, UsuarioGym, UsuarioGymDay, Membresia, MembresiaAsignada
from datetime import timedelta

#token
from rest_framework.authtoken.models import Token


# ============================================================
# GIMNASIO SERIALIZER
# ============================================================

class GimnasioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gimnasio
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


# ============================================================
# USUARIO SERIALIZER
# ============================================================

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False, allow_null=True)
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'name', 'lastname', 'roles', 'gimnasio', 'gimnasio_name',
                  'avatar', 'is_active', 'created_at', 'password']
        read_only_fields = ('id', 'created_at', 'is_active', 'gimnasio', 'gimnasio_name')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance:
            self.fields['email'].required = False
    
    def validate_password(self, value):
        if value and len(value) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def update(self, instance, validated_data):
        try:
            if 'password' in validated_data:
                password = validated_data.pop('password')
                instance.set_password(password)
            
            if 'avatar' in validated_data:
                instance.avatar = validated_data['avatar']

            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            instance.save()
            return instance
            
        except Exception as e:
            raise


# ============================================================
# MIEMBROS DEL GIMNASIO
# ============================================================

class UsuarioGymSerializer(serializers.ModelSerializer):
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    
    class Meta:
        model = UsuarioGym
        fields = ['id', 'name', 'lastname', 'phone', 'address', 'gimnasio', 
                  'gimnasio_name', 'created_at']
        read_only_fields = ('id', 'created_at')


class UsuarioGymDaySerializer(serializers.ModelSerializer):
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    
    class Meta:
        model = UsuarioGymDay
        fields = ['id', 'name', 'lastname', 'phone', 'dateInitial', 'price', 
                  'gimnasio', 'gimnasio_name', 'created_at']
        read_only_fields = ('id', 'created_at')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.dateInitial:
            representation['dateInitial'] = instance.dateInitial.strftime("%d-%m-%Y")        
        return representation


# ============================================================
# MEMBRESIAS
# ============================================================

class MembresiasSerializer(serializers.ModelSerializer):
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Membresia
        fields = ['id', 'name', 'price', 'duration', 'gimnasio', 'gimnasio_name', 'is_active']
        read_only_fields = ('id',)


class MembresiaAsignadaSerializer(serializers.ModelSerializer):
    miembro_details = UsuarioGymSerializer(source='miembro', read_only=True)
    membresia_details = MembresiasSerializer(source='membresia', read_only=True)

    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    dateFinal = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])

    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = MembresiaAsignada
        fields = ['id', 'miembro', 'membresia', 'miembro_details', 'membresia_details',
                  'dateInitial', 'dateFinal', 'price']
        read_only_fields = ('id', 'price')

    def validate(self, data):           
        miembro = data.get('miembro') or self.instance.miembro
        inicio = data.get('dateInitial') or self.instance.dateInitial
        membresia = data.get('membresia') or self.instance.membresia
        
        # Verificar que miembro y membresia sean del mismo gimnasio
        if miembro.gimnasio != membresia.gimnasio:
            raise serializers.ValidationError(
                "El miembro y la membresía deben pertenecer al mismo gimnasio"
            )
        
        # Verificar fechas
        expected_final = inicio + timedelta(membresia.duration)
        
        suscripcion = MembresiaAsignada.objects.filter(
            miembro=miembro, 
            dateInitial__lte=expected_final, 
            dateFinal__gte=inicio
        ).exclude(pk=self.instance.pk if self.instance else None)
        
        if suscripcion.exists():
            raise serializers.ValidationError(
                'El miembro ya tiene una suscripción activa en este rango de fechas'
            )
        return data        

    def create(self, validated_data):
        validated_data['price'] = validated_data['membresia'].price
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.dateInitial:
            representation['dateInitial'] = instance.dateInitial.strftime("%d-%m-%Y")
        if instance.dateFinal:
            representation['dateFinal'] = instance.dateFinal.strftime("%d-%m-%Y")
        return representation