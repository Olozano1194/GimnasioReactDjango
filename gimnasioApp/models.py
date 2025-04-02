from django.db import models
from django.utils import timezone
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


# Create your models here.
class UserManager(BaseUserManager): # Clase para la creación de usuarios
    def create_user(self, email, password, **extra_fields): #extra_fields es un diccionario que puede contener cualquier campo adicional que se desee agregar al modelo de usuario
        if not email:
            raise ValueError('Los usuarios deben tener un correo electrónico')
        user = self.model(email=self.normalize_email(email), **extra_fields) # Normaliza la dirección de correo electrónico convirtiendo todos los caracteres en minúsculas y eliminando cualquier espacio en blanco al principio o al final        
        user.set_password(password) # Establece la contraseña del usuario encriptada 
        user.save()
        return user

class Usuario(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=45)
    lastname = models.CharField(max_length=50)
    #user = models.CharField(max_length=30, unique=True)
    avatar = models.ImageField(upload_to='fotos/', null=True, blank=True, default='')
    
        
    OPCIONES_ROL = [
        ('recepcion', 'Recepcionista'),
        ('admin', 'Administrador')
    ]
    roles = models.CharField(max_length=10, choices=OPCIONES_ROL, default='recepcion')
    #password = models.CharField(max_length=300)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    #Usamos el UserManager personalizado
    objects = UserManager()

    #Se define el campo de autenticación sea el email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'lastname']

    def full_name(self):
        return '{} {}'.format(self.name, self.lastname)

    def __str__(self):
        return self.full_name()
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        db_table = 'usuario'

class UsuarioGym(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=50)
    dateInitial = models.DateField(max_length=50)
    dateFinal = models.DateField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'UsuarioGym'
        verbose_name_plural = 'UsuarioGyms'
        db_table = 'usuarioGym'
    
class UsuarioGymDay(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    dateInitial = models.DateField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'UsuarioGymDay'
        verbose_name_plural = 'UsuarioGymDays'
        db_table = 'usuarioGymDay'

class Membresia(models.Model):
    OPCIONES_NAME = [
        ('básico', 'Básico'),
        ('premium', 'Premium'),
        ('VIP', 'VIP'),
    ]    
    name = models.CharField(max_length=10, choices=OPCIONES_NAME, default='basico')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    

    

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Membresia'
        verbose_name_plural = 'Membresias'
        db_table = 'membresia'

class MembresiaAsignada(models.Model):
    miembro = models.ForeignKey(UsuarioGym, on_delete=models.CASCADE, related_name='miembros')
    membresia = models.ForeignKey(Membresia, on_delete=models.CASCADE)
    dateInitial = models.DateField(max_length=200)
    dateFinal = models.DateField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.miembro.name} - {self.miembro.lastname} - {self.membresia.name}"   
    
    class Meta:
        verbose_name = 'MembresiaAsignada'
        verbose_name_plural = 'MembresiaAsignadas'
        db_table = 'membresiaAsignada'