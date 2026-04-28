import os
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class GimnasioappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gimnasioApp'

    def ready(self):
        import sys
        # Avoid running during management commands
        if len(sys.argv) >= 2 and sys.argv[1] in ['migrate', 'makemigrations', 'collectstatic', 'test']:
            return
        
        from django.conf import settings
        # Run only in production (DEBUG=False)
        if settings.DEBUG:
            return  # Or optionally allow in dev too
        
        self._create_demo_admin()

    def _create_demo_admin(self):
        """
        Creates a demo admin user for portfolio/recruitment.
        Uses environment variables for credentials.
        """
        from .models import Usuario, Gimnasio
        
        # Check if admin already exists
        if Usuario.objects.filter(roles='admin').exists():
            logger.info("Admin user already exists, skipping creation.")
            return
        
        try:
            # FIRST: Create or get Gimnasio (tenant)
            gimnasio, created = Gimnasio.objects.get_or_create(
                name="Demo Gimnasio",
                defaults={
                    'address': 'Dirección Demo',
                    'phone': '123456789',
                    'is_active': True
                }
            )
            if created:
                logger.info(f"✅ Created demo gimnasio: {gimnasio.name}")
            
            # Get credentials from environment variables
            admin_email = os.environ.get('DEMO_ADMIN_EMAIL')
            admin_password = os.environ.get('DEMO_ADMIN_PASSWORD')
            admin_name = os.environ.get('DEMO_ADMIN_NAME', 'Admin')
            admin_lastname = os.environ.get('DEMO_ADMIN_LASTNAME', 'Demo')
            
            if not admin_email or not admin_password:
                logger.warning("⚠️ DEMO_ADMIN_EMAIL or DEMO_ADMIN_PASSWORD not set in environment variables!")
                return
            
            # Create admin user ASSOCIATED with the gimnasio
            Usuario.objects.create_user(
                email=admin_email,
                password=admin_password,
                name=admin_name,
                lastname=admin_lastname,
                roles='admin',
                gimnasio=gimnasio  # <-- IMPORTANT: Associate with gimnasio
            )
            logger.info(f"✅ Created demo admin user: {admin_email}")
        
        except Exception as e:
            logger.error(f"❌ Error creating demo admin: {e}", exc_info=True)
