from django.db import models
from django.utils import timezone

# Create your models here.
class RegistrarUsuario(models.Model):

    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    user = models.CharField(max_length=30, unique=True)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    

    OPCIONES_ROL = [
        ('usuario', 'Usuario Normal'),
        ('admin', 'Administrador')
    ]

    roles = models.CharField(max_length=7, choices=OPCIONES_ROL, default='usuario')

    password = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'RegistrarUsuario'
        verbose_name_plural = 'RegistrarUsuarios'
        db_table = 'RegistrarUsuario'

class RegistrarUsuarioGym(models.Model):
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
        verbose_name = 'RegistrarUsuarioGym'
        verbose_name_plural = 'RegistrarUsuarioGyms'
        db_table = 'RegistrarUsuarioGym'
    
class RegistrarUsuarioGymDay(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    dateInitial = models.DateField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'RegistrarUsuarioGymDay'
        verbose_name_plural = 'RegistrarUsuarioGymDays'
        db_table = 'RegistrarUsuarioGymDay'
    
#Clase para la renovación de los usuarios del gimnasio
class Renovacion(models.Model):
    usuarioGym = models.ForeignKey(RegistrarUsuarioGym, on_delete=models.CASCADE, related_name="renovaciones")
    fechaRenovacion = models.DateField()
    fechaVencimiento = models.DateField()
    es_renovado = models.BooleanField(default=False) # Marca si es una renovación o no

    def __str__(self):
         return f"Renovación de {self.usuario.name} del {self.fechaRenovacion} al {self.fechaVencimiento}"
    
    class Meta:
        verbose_name = 'Renovacion'
        verbose_name_plural = 'Renovaciones'
        db_table = 'Renovacion'


