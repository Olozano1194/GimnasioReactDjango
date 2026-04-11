import os
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class GimnasioappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gimnasioApp'

    def ready(self):
        """
        Al iniciar la aplicación, crea un usuario admin de demostración
        si no existe ninguno y las variables de entorno están configuradas.
        
        TEMPORALMENTE DESHABILITADO para evitar query antes de migrate.
        """
        # DESHABILITADO: ejecutar solo cuando migrate ya esté aplicado
        # Re-habilitar después de que funcione el deploy
        pass

    def _create_demo_admin(self):
        """
        Crea un usuario admin de demostración para portafolio/recruitment.
        Usa variables de entorno para las credenciales.
        """
        from .models import Usuario
        
        # Verificar si ya existe algún admin
        if Usuario.objects.filter(roles='admin').exists():
            logger.info("Ya existe un usuario admin, omitiendo creación automática.")
            return
        
        # Obtener credenciales de variables de entorno
        admin_email = os.environ.get('DEMO_ADMIN_EMAIL')
        admin_password = os.environ.get('DEMO_ADMIN_PASSWORD')
        admin_name = os.environ.get('DEMO_ADMIN_NAME', 'Admin')
        admin_lastname = os.environ.get('DEMO_ADMIN_LASTNAME', 'Demo')
        
        # Si no hay variables de entorno configuradas, usar valores por defecto
        if not admin_email:
            admin_email = 'admin@gimnasio.com'
        if not admin_password:
            admin_password = 'admin123'
        
        try:
            Usuario.objects.create_user(
                email=admin_email,
                password=admin_password,
                name=admin_name,
                lastname=admin_lastname,
                roles='admin'
            )
            logger.info(f"✅ Usuario admin de demostración creado: {admin_email}")
        except Exception as e:
            logger.error(f"❌ Error al crear usuario admin: {e}")
