from rest_framework import serializers
from django.db import transaction
from .models import Gimnasio, Usuario, UsuarioGym, UsuarioGymDay, Membresia, MembresiaAsignada
from datetime import timedelta, date

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
        """
        Crea usuario. Usa request.gimnasio si está disponible, si no (registro), crea gimnasio automáticamente.
        """
        password = validated_data.pop('password')
        # Remover gimnasio de validated_data si viene de perform_create
        validated_data.pop('gimnasio', None)

        request = self.context.get('request')
        gimnasio = getattr(request, 'gimnasio', None)

        if gimnasio is None:
            # Flujo de registro: crear gimnasio automáticamente
            email = validated_data.get('email', '')
            email_prefix = email.split('@')[0].replace('.', ' ').title() if '@' in email else email
            gimnasio = Gimnasio.objects.create(
                name=f"Gimnasio {email_prefix}"
            )

        user = Usuario(gimnasio=gimnasio, **validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        # Handle password separately
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        # Delete old avatar if new one is provided
        avatar = validated_data.get('avatar', None)
        if avatar and instance.avatar and instance.avatar.name:
            instance.avatar.delete(save=False)
        
        # Continue with normal update using super()
        instance = super().update(instance, validated_data)
        return instance


# ============================================================
# MIEMBROS DEL GIMNASIO
# ============================================================

class UsuarioGymSerializer(serializers.ModelSerializer):
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    initial_membership_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    dateInitial = serializers.DateField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = UsuarioGym
        fields = ['id', 'name', 'lastname', 'phone', 'address', 'gimnasio',
                  'gimnasio_name', 'created_at', 'initial_membership_id', 'dateInitial']
        read_only_fields = ('id', 'created_at', 'gimnasio')

    def create(self, validated_data):
        initial_membership_id = validated_data.pop('initial_membership_id', None)
        date_initial = validated_data.pop('dateInitial', None)

        # Remover cualquier gimnasio de los datos validados (usar el del middleware)
        validated_data.pop('gimnasio', None)

        # Obtener gimnasio del request (seteado por el middleware)
        request = self.context.get('request')
        gimnasio = getattr(request, 'gimnasio', None)

        if gimnasio is None:
            raise serializers.ValidationError("No se pudo determinar el gimnasio del request")

        validated_data['gimnasio'] = gimnasio

        with transaction.atomic():
            miembro = UsuarioGym.objects.create(**validated_data)

            if initial_membership_id:
                try:
                    membresia = Membresia.objects.get(
                        id=initial_membership_id,
                        gimnasio=gimnasio
                    )
                    MembresiaAsignada.objects.create(
                        miembro=miembro,
                        membresia=membresia,
                        dateInitial=date_initial or date.today()
                    )
                except Membresia.DoesNotExist:
                    raise serializers.ValidationError({"initial_membership_id": "Membresía no encontrada en tu gimnasio"})

            return miembro


class UsuarioGymDaySerializer(serializers.ModelSerializer):
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    dateInitial = serializers.DateField(format="%d-%m-%Y", input_formats=['%Y-%m-%d', '%d-%m-%Y'])
    
    class Meta:
        model = UsuarioGymDay
        fields = ['id', 'name', 'lastname', 'phone', 'dateInitial', 'price',
                  'gimnasio', 'gimnasio_name', 'created_at']
        read_only_fields = ('id', 'created_at', 'gimnasio')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.dateInitial:
            representation['dateInitial'] = instance.dateInitial.strftime("%d-%m-%Y")        
        return representation

    def create(self, validated_data):
        # Remover cualquier gimnasio de los datos validados
        validated_data.pop('gimnasio', None)
        
        # Obtener gimnasio del request
        request = self.context.get('request')
        gimnasio = getattr(request, 'gimnasio', None)
        
        if gimnasio is None:
            raise serializers.ValidationError("No se pudo determinar el gimnasio del request")
        
        validated_data['gimnasio'] = gimnasio
        return super().create(validated_data)


# ============================================================
# MEMBRESIAS
# ============================================================

class MembresiasSerializer(serializers.ModelSerializer):
    gimnasio_name = serializers.CharField(source='gimnasio.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Membresia
        fields = ['id', 'name', 'price', 'duration', 'gimnasio', 'gimnasio_name', 'is_active']
        read_only_fields = ('id', 'gimnasio',)

    def create(self, validated_data):
        # Remover cualquier gimnasio de los datos validados
        validated_data.pop('gimnasio', None)
        
        # Obtener gimnasio del request
        request = self.context.get('request')
        gimnasio = getattr(request, 'gimnasio', None)
        
        if gimnasio is None:
            raise serializers.ValidationError("No se pudo determinar el gimnasio del request")
        
        validated_data['gimnasio'] = gimnasio
        return super().create(validated_data)


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
        miembro = data.get('miembro') or (self.instance.miembro if self.instance else None)
        inicio = data.get('dateInitial') or (self.instance.dateInitial if self.instance else None)
        membresia = data.get('membresia') or (self.instance.membresia if self.instance else None)
        
        if not miembro or not membresia:
            raise serializers.ValidationError("Miembro y membresía son requeridos")
        
        # Verificar que miembro y membresia sean del mismo gimnasio
        if miembro.gimnasio != membresia.gimnasio:
            raise serializers.ValidationError(
                "El miembro y la membresía deben pertenecer al mismo gimnasio"
            )
        
        # Verificar que ambos pertenezcan al gimnasio del request
        request = self.context.get('request')
        gimnasio = getattr(request, 'gimnasio', None)
        if gimnasio and miembro.gimnasio != gimnasio:
            raise serializers.ValidationError(
                "El miembro no pertenece a tu gimnasio"
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