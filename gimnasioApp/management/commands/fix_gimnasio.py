from django.core.management.base import BaseCommand
from gimnasioApp.models import Usuario, Gimnasio


class Command(BaseCommand):
    help = 'Crea gimnasio para usuarios huérfanos (sin gimnasio asignado)'

    def handle(self, *args, **options):
        usuarios_sin_gimnasio = Usuario.objects.filter(gimnasio__isnull=True)
        
        if not usuarios_sin_gimnasio.exists():
            self.stdout.write(self.style.SUCCESS('✅ No hay usuarios sin gimnasio'))
            return
        
        self.stdout.write(f'Usuarios sin gimnasio encontrados: {usuarios_sin_gimnasio.count()}')
        
        for usuario in usuarios_sin_gimnasio:
            # Generar nombre del gimnasio desde el email
            email_prefix = usuario.email.split('@')[0].replace('.', ' ').title()
            nombre_gym = f'Gimnasio {email_prefix}'
            
            # Crear gimnasio
            gym = Gimnasio.objects.create(name=nombre_gym)
            
            # Asignar al usuario
            usuario.gimnasio = gym
            usuario.save()
            
            self.stdout.write(f'  ✅ {usuario.email} → {gym.name}')
        
        self.stdout.write(self.style.SUCCESS(f'✅ Migración completada: {usuarios_sin_gimnasio.count()} usuarios fijados'))