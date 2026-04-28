from django.db import models
from datetime import timedelta, date
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.core.exceptions import ValidationError


# ============================================================
# MODELO GIMNASIO - Para multi-tenant
# ============================================================
class Gimnasio(models.Model):
    """Representa cada gimnasio/cliente en el sistema multi-tenant."""
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'gimnasio'
        verbose_name = 'Gimnasio'
        verbose_name_plural = 'Gimnasios'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================
# MANAGER Y MODELO USUARIO
# ============================================================
class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        """
        Crea un usuario.
        """
        if not email:
            raise ValueError('Los usuarios deben tener un correo electrónico')
        
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save()
        return user

class Usuario(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=45)
    lastname = models.CharField(max_length=50)
    #user = models.CharField(max_length=30, unique=True)
    avatar = models.ImageField(upload_to='fotos/', null=True, blank=True, default='')
    
    # FK a Gimnasio para multi-tenant
    gimnasio = models.ForeignKey(
        Gimnasio,
        on_delete=models.CASCADE,
        related_name='usuarios',
        null=False,
        blank=False
    )
        
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
        ordering = ['created_at']

class UsuarioGym(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # FK a Gimnasio para multi-tenant
    gimnasio = models.ForeignKey(
        Gimnasio,
        on_delete=models.CASCADE,
        related_name='miembros',
        null=False,
        blank=False
    )

    def __str__(self):
        return f"{self.name} {self.lastname}"
    
    class Meta:
        verbose_name = 'UsuarioGym'
        verbose_name_plural = 'UsuarioGyms'
        db_table = 'usuarioGym'
        ordering = ['-created_at']
    
class UsuarioGymDay(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    dateInitial = models.DateField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # FK a Gimnasio para multi-tenant
    gimnasio = models.ForeignKey(
        Gimnasio,
        on_delete=models.CASCADE,
        related_name='miembros_diarios',
        null=False,
        blank=False
    )

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'UsuarioGymDay'
        verbose_name_plural = 'UsuarioGymDays'
        db_table = 'usuarioGymDay'
        ordering = ['-created_at']

class Membresia(models.Model):
    OPCIONES_NAME = [
        ('básico', 'Básico'),
        ('premium', 'Premium'),
        ('VIP', 'VIP'),
    ]    
    name = models.CharField(max_length=10, choices=OPCIONES_NAME, default='básico')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.PositiveIntegerField(help_text="Duración en días (ej: 15, 30, 45)")
    is_active = models.BooleanField(default=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    
    # FK a Gimnasio para multi-tenant
    gimnasio = models.ForeignKey(
        Gimnasio,
        on_delete=models.CASCADE,
        related_name='membresias',
        null=False,
        blank=False
    )


    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Membresia'
        verbose_name_plural = 'Membresias'
        db_table = 'membresia'
        # ordering = ['-created_at']

class MembresiaAsignada(models.Model):
    gimnasio = models.ForeignKey(Gimnasio, on_delete=models.CASCADE, related_name='membresias_asignadas', null=False, blank=False)
    miembro = models.ForeignKey(UsuarioGym, on_delete=models.CASCADE, related_name='miembro')
    membresia = models.ForeignKey(Membresia, on_delete=models.CASCADE)
    dateInitial = models.DateField()
    dateFinal = models.DateField(editable=False, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    notified_at = models.DateTimeField(null=True, blank=True, help_text="Fecha en que se marcó como notificada/leída")

    class Meta:
        verbose_name = 'MembresiaAsignada'
        verbose_name_plural = 'MembresiaAsignadas'
        db_table = 'membresiaAsignada'
        ordering = ['-dateInitial']
    
    def save(self, *args, **kwargs):
        if not self.gimnasio_id and self.miembro_id:
            self.gimnasio = self.miembro.gimnasio
        # Se calcula la fecha final de la membresia + precio al guardarlo
        self.dateFinal = self.dateInitial + timedelta(days=self.membresia.duration)
        self.price = self.membresia.price
        super().save(*args, **kwargs)  # Llamar al método save de la clase padre

    def clean(self):
        if MembresiaAsignada.objects.filter(miembro=self.miembro,
                                            dateInitial__lte=self.dateFinal,
                                            dateFinal__gte=self.dateInitial).exclude(pk=self.pk).exists():
            raise ValidationError('Ya existe una membresia asignada para este usuario en el rango de fechas indicado')
   
    @property
    def activa(self):
        hoy = date.today()
        return self.dateInitial <= hoy <= self.dateFinal

    def __str__(self):
        return f"{self.miembro.name} - {self.miembro.lastname} - {self.membresia.name}"   