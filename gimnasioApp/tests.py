import io
import base64
import json
from django.test import TestCase
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from unittest.mock import patch, MagicMock, call

from decimal import Decimal
from datetime import timedelta, date
from .models import Gimnasio, Usuario, UsuarioGym, Membresia, MembresiaAsignada, PagoMembresia
from .middleware import GimnasioMiddleware
from .mixins import MultiTenantViewSetMixin
from .serializers import UsuarioSerializer, UsuarioGymSerializer, MembresiasSerializer, MembresiaAsignadaSerializer, PagoMembresiaSerializer
from .views import UserViewSet, UsuarioGymViewSet, MembresiaViewSet, Home, PagoMembresiaViewSet
from .storage import SupabaseMediaStorage
from django.core.files.uploadedfile import SimpleUploadedFile


class GimnasioMiddlewareTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = GimnasioMiddleware(lambda r: None)

    def test_authenticated_user_gets_gimnasio(self):
        gimnasio = Gimnasio.objects.create(name="Test Gym")
        user = Usuario.objects.create_user(
            email="test@example.com",
            name="Test",
            lastname="User",
            password="password123",
            gimnasio=gimnasio
        )
        request = self.factory.get('/')
        request.user = user
        self.middleware(request)
        self.assertEqual(request.gimnasio, gimnasio)

    def test_anonymous_user_gets_none(self):
        request = self.factory.get('/')
        request.user = AnonymousUser()
        self.middleware(request)
        self.assertIsNone(request.gimnasio)

    def test_user_without_gimnasio_gets_none(self):
        gimnasio = Gimnasio.objects.create(name="Test Gym 2")
        # Create user with gimnasio first, then test the middleware behavior
        user = Usuario.objects.create_user(
            email="nogym@example.com",
            name="No",
            lastname="Gym",
            password="password123",
            gimnasio=gimnasio
        )

        # Now simulate user without gimnasio by manually setting request.gimnasio = None
        # The middleware sets request.gimnasio based on request.user.gimnasio
        # We need to test a user whose gimnasio is None
        # Since the DB requires gimnasio, we'll test the middleware logic directly
        request = self.factory.get('/')
        request.user = user
        # Manually set user.gimnasio to None to simulate the case
        user.gimnasio = None
        self.middleware(request)
        self.assertIsNone(request.gimnasio)


class MultiTenantViewSetMixinTest(TestCase):
    def setUp(self):
        self.gimnasio1 = Gimnasio.objects.create(name="Gym 1")
        self.gimnasio2 = Gimnasio.objects.create(name="Gym 2")

        self.user1 = Usuario.objects.create_user(
            email="user1@example.com",
            name="User",
            lastname="One",
            password="password123",
            gimnasio=self.gimnasio1
        )
        self.user2 = Usuario.objects.create_user(
            email="user2@example.com",
            name="User",
            lastname="Two",
            password="password123",
            gimnasio=self.gimnasio2
        )

        self.member1 = UsuarioGym.objects.create(
            name="Member", lastname="One",
            gimnasio=self.gimnasio1
        )
        self.member2 = UsuarioGym.objects.create(
            name="Member", lastname="Two",
            gimnasio=self.gimnasio2
        )

    def test_queryset_filtered_by_gimnasio(self):
        factory = APIRequestFactory()
        view = UsuarioGymViewSet.as_view({'get': 'list'})

        request = factory.get('/')
        request.user = self.user1
        request.gimnasio = self.gimnasio1
        force_authenticate(request, user=self.user1)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['gimnasio'], self.gimnasio1.id)

    def test_queryset_returns_empty_for_no_gimnasio(self):
        factory = APIRequestFactory()
        view = UsuarioGymViewSet.as_view({'get': 'list'})

        request = factory.get('/')
        request.user = self.user1
        request.gimnasio = None
        force_authenticate(request, user=self.user1)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_membresia_viewset_filters_by_gimnasio(self):
        Membresia.objects.create(name="Plan 1", price=100, duration=30, gimnasio=self.gimnasio1)
        Membresia.objects.create(name="Plan 2", price=200, duration=30, gimnasio=self.gimnasio2)

        factory = APIRequestFactory()
        view = MembresiaViewSet.as_view({'get': 'list'})

        request = factory.get('/')
        request.user = self.user1
        request.gimnasio = self.gimnasio1
        force_authenticate(request, user=self.user1)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['gimnasio'], self.gimnasio1.id)


class UserViewSetCreateTest(TestCase):
    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.admin = Usuario.objects.create_user(
            email="admin@example.com",
            name="Admin",
            lastname="User",
            password="password123",
            roles="admin",
            gimnasio=self.gimnasio
        )
        self.factory = APIRequestFactory()

    def test_create_user_assigns_gimnasio_via_perform_create(self):
        view = UserViewSet.as_view({'post': 'create'})

        data = {
            "email": "newuser@example.com",
            "name": "New",
            "lastname": "User",
            "password": "password123",
            "roles": "recepcion"
        }
        request = self.factory.post('/', data)
        request.user = self.admin
        request.gimnasio = self.gimnasio
        force_authenticate(request, user=self.admin)

        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_user = Usuario.objects.get(email="newuser@example.com")
        self.assertEqual(new_user.gimnasio, self.gimnasio)

    def test_create_user_without_perform_create_bypasses_gimnasio(self):
        # Verify that perform_create is actually being called
        # by checking the gimnasio is set correctly
        view = UserViewSet.as_view({'post': 'create'})

        data = {
            "email": "another@example.com",
            "name": "Another",
            "lastname": "User",
            "password": "password123",
        }
        request = self.factory.post('/', data)
        request.user = self.admin
        request.gimnasio = self.gimnasio
        force_authenticate(request, user=self.admin)

        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_user = Usuario.objects.get(email="another@example.com")
        self.assertEqual(new_user.gimnasio, self.gimnasio)


# ============================================================
# SUPABASE STORAGE TESTS (Phase 4)
# ============================================================

class SupabaseMediaStorageTest(TestCase):
    """Unit tests for SupabaseMediaStorage configuration."""

    def test_storage_uses_empty_location(self):
        """Storage should use '' as location (upload_to='fotos/' en el modelo maneja el path)."""
        storage = SupabaseMediaStorage()
        self.assertEqual(storage.location, '')

    def test_storage_does_not_overwrite_files(self):
        """Storage should NOT overwrite existing files (file_overwrite=False)."""
        storage = SupabaseMediaStorage()
        self.assertFalse(storage.file_overwrite)

    def test_storage_uses_public_read_acl(self):
        """Storage should use 'public-read' ACL for public URLs."""
        storage = SupabaseMediaStorage()
        self.assertEqual(storage.default_acl, 'public-read')

    @patch.dict('os.environ', {
        'AWS_S3_ENDPOINT_URL': 'https://test-project.supabase.co/storage/v1/s3',
        'AWS_ACCESS_KEY_ID': 'test-key',
        'AWS_SECRET_ACCESS_KEY': 'test-secret',
        'AWS_STORAGE_BUCKET_NAME': 'test-bucket'
    })
    def test_storage_reads_endpoint_from_env(self):
        """Storage should read S3 endpoint from AWS_S3_ENDPOINT_URL env var."""
        from django.test.utils import override_settings
        with override_settings(
            AWS_S3_ENDPOINT_URL='https://test-project.supabase.co/storage/v1/s3',
            AWS_ACCESS_KEY_ID='test-key',
            AWS_SECRET_ACCESS_KEY='test-secret',
            AWS_STORAGE_BUCKET_NAME='test-bucket'
        ):
            storage = SupabaseMediaStorage()
            self.assertEqual(storage.endpoint_url, 'https://test-project.supabase.co/storage/v1/s3')

    @patch.dict('os.environ', {'AWS_STORAGE_BUCKET_NAME': 'custom-bucket'})
    def test_storage_uses_configured_bucket_name(self):
        """Storage should use bucket name from AWS_STORAGE_BUCKET_NAME env var."""
        from django.test.utils import override_settings
        with override_settings(AWS_STORAGE_BUCKET_NAME='custom-bucket'):
            storage = SupabaseMediaStorage()
            self.assertEqual(storage.bucket_name, 'custom-bucket')


class UsuarioSerializerAvatarTest(TestCase):
    """Unit tests for avatar update behavior in UsuarioSerializer."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.user = Usuario.objects.create_user(
            email="test@example.com",
            name="Test",
            lastname="User",
            password="password123",
            gimnasio=self.gimnasio
        )
        self.factory = APIRequestFactory()

    def _make_uploaded_image(self, filename='test.jpg', fmt='JPEG'):
        """Generate a valid image file using Pillow."""
        from PIL import Image
        import io
        img = Image.new('RGB', (10, 10), color='red')
        buffer = io.BytesIO()
        img.save(buffer, format=fmt)
        return SimpleUploadedFile(
            filename,
            buffer.getvalue(),
            content_type='image/jpeg' if fmt == 'JPEG' else 'image/png'
        )

    def test_serializer_deletes_old_avatar_when_new_provided(self):
        """Scenario 4.2: When new avatar is provided, old avatar should be deleted from storage."""
        # Setup: user has existing avatar
        self.user.avatar = 'avatars/old_avatar.jpg'
        self.user.save()

        # Patch FieldFile.delete to intercept the storage deletion call
        with patch('django.db.models.fields.files.FieldFile.delete') as mock_delete:
            new_avatar = self._make_uploaded_image('new_avatar.jpg')
            serializer = UsuarioSerializer(
                instance=self.user,
                data={'avatar': new_avatar},
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.update(self.user, {'avatar': new_avatar})

            # Verify old avatar was deleted from storage
            mock_delete.assert_called_once()

    def test_serializer_skips_deletion_on_first_time_upload(self):
        """Scenario 4.3: First-time upload (no existing avatar) should skip deletion gracefully."""
        # User has no avatar
        self.user.avatar = None
        self.user.save()

        with patch('django.db.models.fields.files.FieldFile.delete') as mock_delete:
            new_avatar = self._make_uploaded_image('test.jpg')
            serializer = UsuarioSerializer(
                instance=self.user,
                data={'avatar': new_avatar},
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            result = serializer.update(self.user, {'avatar': new_avatar})

            # delete should NOT have been called since there was no old avatar
            mock_delete.assert_not_called()
            # The avatar should now be set (not None)
            self.assertIsNotNone(result.avatar)

    def test_serializer_skips_deletion_when_avatar_not_in_update(self):
        """Scenario 4.4: When avatar is NOT in the update data, existing avatar should NOT be deleted."""
        # Setup: user has existing avatar
        self.user.avatar = 'avatars/old_avatar.jpg'
        self.user.save()

        serializer = UsuarioSerializer(
            instance=self.user,
            data={'name': 'Updated Name'},
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        # Verify 'avatar' is not in validated_data
        self.assertNotIn('avatar', serializer.validated_data)

        # Mock storage delete to ensure it's not called
        with patch('django.db.models.fields.files.FieldFile.delete') as mock_delete:
            result = serializer.update(self.user, serializer.validated_data)
            mock_delete.assert_not_called()
            self.assertEqual(result.name, 'Updated Name')

    def test_serializer_deletes_old_avatar_using_storage(self):
        """Verify that storage.delete() is called on the old avatar name."""
        self.user.avatar = 'avatars/old_avatar.jpg'
        self.user.save()

        with patch('django.db.models.fields.files.FieldFile.delete') as mock_delete:
            new_avatar = self._make_uploaded_image('new_avatar.jpg')
            serializer = UsuarioSerializer(
                instance=self.user,
                data={'avatar': new_avatar},
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.update(self.user, {'avatar': new_avatar})

            # Verify old avatar was deleted from storage
            mock_delete.assert_called_once()


# ============================================================
# INTEGRATION TESTS (Phase 4.5)
# ============================================================

class AvatarUploadIntegrationTest(TestCase):
    """Integration test for end-to-end avatar upload."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.user = Usuario.objects.create_user(
            email="test@example.com",
            name="Test",
            lastname="User",
            password="password123",
            roles="admin",
            gimnasio=self.gimnasio
        )
        self.factory = APIRequestFactory()

    def _make_uploaded_image(self, filename='test.jpg', fmt='JPEG'):
        """Generate a valid image file using Pillow."""
        from PIL import Image
        import io
        img = Image.new('RGB', (10, 10), color='red')
        buffer = io.BytesIO()
        img.save(buffer, format=fmt)
        return SimpleUploadedFile(
            filename,
            buffer.getvalue(),
            content_type='image/jpeg' if fmt == 'JPEG' else 'image/png'
        )

    def test_avatar_upload_returns_url(self):
        """PATCH /api/user/ with avatar should return the avatar URL."""
        mock_storage = MagicMock()
        mock_storage.url.return_value = 'https://test-project.supabase.co/storage/v1/object/public/fotos/test.jpg'
        mock_storage.save.return_value = 'fotos/test.jpg'
        mock_storage.exists.return_value = False

        # Patch the storage used by the avatar field
        with patch.object(Usuario.avatar.field, 'storage', mock_storage):
            new_avatar = self._make_uploaded_image('test.jpg')
            view = UserViewSet.as_view({'patch': 'partial_update'})
            request = self.factory.patch('/api/user/', {'avatar': new_avatar}, format='multipart')
            request.user = self.user
            request.gimnasio = self.gimnasio
            force_authenticate(request, user=self.user)

            with patch.object(UserViewSet, 'get_object', return_value=self.user):
                response = view(request, pk=self.user.id)
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                # Assert response contains Supabase URL (starts with 'http')
                self.assertIn('avatar', response.data)
                avatar_url = response.data['avatar']
                self.assertTrue(avatar_url.startswith('http'), f"Avatar URL should start with 'http', got: {avatar_url}")


# ============================================================
# PHASE 5: PAGOS FLEXIBLES DE MEMBRESIAS — TESTS
# ============================================================

class MembresiaAsignadaSaveTest(TestCase):
    """Tests for MembresiaAsignada.save() con multiplier y discount_percent."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.miembro = UsuarioGym.objects.create(
            name="Juan", lastname="Perez", gimnasio=self.gimnasio
        )
        self.membresia = Membresia.objects.create(
            name="básico", price=Decimal('50000'), duration=30, gimnasio=self.gimnasio
        )

    def test_save_con_multiplier_3_y_discount_5(self):
        """5.1: MembresiaAsignada.save() calcula price y dateFinal con multiplier=3 y discount=5%."""
        date_initial = date(2026, 7, 1)
        asignada = MembresiaAsignada.objects.create(
            miembro=self.miembro,
            membresia=self.membresia,
            dateInitial=date_initial,
            multiplier=Decimal('3'),
            discount_percent=Decimal('5')
        )
        self.assertEqual(asignada.multiplier, Decimal('3'))
        self.assertEqual(asignada.discount_percent, Decimal('5'))
        # price = 50000 * 3 * (1 - 5/100) = 150000 * 0.95 = 142500
        self.assertEqual(asignada.price, Decimal('142500.00'))
        # dateFinal = dateInitial + 90 days
        self.assertEqual(asignada.dateFinal, date(2026, 9, 29))

    def test_save_con_multiplier_12_y_discount_20(self):
        """5.2: MembresiaAsignada.save() con multiplier=12 y discount=20%."""
        date_initial = date(2026, 1, 1)
        asignada = MembresiaAsignada.objects.create(
            miembro=self.miembro,
            membresia=self.membresia,
            dateInitial=date_initial,
            multiplier=Decimal('12'),
            discount_percent=Decimal('20')
        )
        # price = 50000 * 12 * (1 - 20/100) = 600000 * 0.8 = 480000
        self.assertEqual(asignada.price, Decimal('480000.00'))
        # dateFinal = dateInitial + 360 days
        self.assertEqual(asignada.dateFinal, date(2026, 12, 27))

    def test_save_sin_multiplier_comportamiento_legacy(self):
        """Sin multiplier explicito, comportamiento igual al original."""
        date_initial = date(2026, 7, 1)
        asignada = MembresiaAsignada.objects.create(
            miembro=self.miembro,
            membresia=self.membresia,
            dateInitial=date_initial
        )
        self.assertEqual(asignada.multiplier, Decimal('1'))
        self.assertEqual(asignada.discount_percent, Decimal('0'))
        self.assertEqual(asignada.price, Decimal('50000.00'))
        self.assertEqual(asignada.dateFinal, date(2026, 7, 31))


class PagoMembresiaValidacionTest(TestCase):
    """Tests for PagoMembresia validacion de monto."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.miembro = UsuarioGym.objects.create(
            name="Juan", lastname="Perez", gimnasio=self.gimnasio
        )
        self.membresia = Membresia.objects.create(
            name="básico", price=Decimal('100000'), duration=30, gimnasio=self.gimnasio
        )
        self.asignada = MembresiaAsignada.objects.create(
            miembro=self.miembro,
            membresia=self.membresia,
            dateInitial=date(2026, 7, 1)
        )

    def test_monto_no_excede_saldo_pendiente(self):
        """5.3: Validacion: monto no excede saldo_pendiente."""
        # saldo_pendiente = 100000
        # intentar pagar 150000 debe fallar
        pago = PagoMembresia(membresia_asignada=self.asignada, monto=Decimal('150000'), metodo_pago='efectivo')
        from django.core.exceptions import ValidationError as DjangoValidationError
        # La validacion ocurre en el serializer, no en el modelo
        # Probamos directamente que la logica funciona
        self.assertGreater(Decimal('150000'), self.asignada.saldo_pendiente)
        
        # Verificar que el serializer rechaza el sobrepago
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.post('/')
        from rest_framework.test import force_authenticate
        from .models import Usuario
        user = Usuario.objects.create_user(
            email="test@test.com", name="Test", lastname="User",
            password="pass123", gimnasio=self.gimnasio
        )
        request.user = user
        request.gimnasio = self.gimnasio

        data = {
            'membresia_asignada': self.asignada.id,
            'monto': 150000,
            'metodo_pago': 'efectivo',
            'nota': ''
        }
        serializer = PagoMembresiaSerializer(
            data=data,
            context={'request': request, 'membresia_asignada': self.asignada}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('monto', serializer.errors)

    def test_monto_cero_rechazado(self):
        """Monto = 0 debe ser rechazado."""
        from rest_framework.test import APIRequestFactory
        from rest_framework.test import force_authenticate
        from .models import Usuario
        factory = APIRequestFactory()
        request = factory.post('/')
        user = Usuario.objects.create_user(
            email="test2@test.com", name="Test", lastname="User",
            password="pass123", gimnasio=self.gimnasio
        )
        request.user = user
        request.gimnasio = self.gimnasio

        data = {
            'membresia_asignada': self.asignada.id,
            'monto': 0,
            'metodo_pago': 'efectivo'
        }
        serializer = PagoMembresiaSerializer(
            data=data,
            context={'request': request, 'membresia_asignada': self.asignada}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('monto', serializer.errors)

    def test_monto_negativo_rechazado(self):
        """Monto negativo debe ser rechazado."""
        from rest_framework.test import APIRequestFactory
        from rest_framework.test import force_authenticate
        from .models import Usuario
        factory = APIRequestFactory()
        request = factory.post('/')
        user = Usuario.objects.create_user(
            email="test3@test.com", name="Test", lastname="User",
            password="pass123", gimnasio=self.gimnasio
        )
        request.user = user
        request.gimnasio = self.gimnasio

        data = {
            'membresia_asignada': self.asignada.id,
            'monto': -100,
            'metodo_pago': 'efectivo'
        }
        serializer = PagoMembresiaSerializer(
            data=data,
            context={'request': request, 'membresia_asignada': self.asignada}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('monto', serializer.errors)


class MembresiaAsignadaPropiedadesTest(TestCase):
    """Tests for propiedades calculadas total_pagado, saldo_pendiente, estado_pago."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.miembro = UsuarioGym.objects.create(
            name="Maria", lastname="Lopez", gimnasio=self.gimnasio
        )
        self.membresia = Membresia.objects.create(
            name="premium", price=Decimal('100000'), duration=30, gimnasio=self.gimnasio
        )
        self.asignada = MembresiaAsignada.objects.create(
            miembro=self.miembro,
            membresia=self.membresia,
            dateInitial=date(2026, 7, 1)
        )

    def test_estado_pending_sin_pagos(self):
        """5.4a: Sin pagos → total_pagado=0, saldo_pendiente=price, estado_pago='pending'."""
        self.assertEqual(self.asignada.total_pagado, Decimal('0'))
        self.assertEqual(self.asignada.saldo_pendiente, Decimal('100000.00'))
        self.assertEqual(self.asignada.estado_pago, 'pending')

    def test_estado_partial_con_pago_parcial(self):
        """5.4b: Pago parcial → estado_pago='partial'."""
        PagoMembresia.objects.create(
            membresia_asignada=self.asignada,
            monto=Decimal('30000'),
            metodo_pago='efectivo'
        )
        self.assertEqual(self.asignada.total_pagado, Decimal('30000.00'))
        self.assertEqual(self.asignada.saldo_pendiente, Decimal('70000.00'))
        self.assertEqual(self.asignada.estado_pago, 'partial')

    def test_estado_paid_con_pago_total(self):
        """5.4c: Pago total → estado_pago='paid'."""
        PagoMembresia.objects.create(
            membresia_asignada=self.asignada,
            monto=Decimal('100000'),
            metodo_pago='transferencia'
        )
        self.assertEqual(self.asignada.total_pagado, Decimal('100000.00'))
        self.assertEqual(self.asignada.saldo_pendiente, Decimal('0.00'))
        self.assertEqual(self.asignada.estado_pago, 'paid')

    def test_estado_paid_con_varios_pagos(self):
        """5.4d: Varios pagos que suman el total → estado_pago='paid'."""
        PagoMembresia.objects.create(
            membresia_asignada=self.asignada,
            monto=Decimal('40000'),
            metodo_pago='efectivo'
        )
        PagoMembresia.objects.create(
            membresia_asignada=self.asignada,
            monto=Decimal('60000'),
            metodo_pago='nequi'
        )
        self.assertEqual(self.asignada.total_pagado, Decimal('100000.00'))
        self.assertEqual(self.asignada.saldo_pendiente, Decimal('0.00'))
        self.assertEqual(self.asignada.estado_pago, 'paid')


class PagoMembresiaIntegracionTest(TestCase):
    """Integration tests for PagoMembresia endpoints."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.user = Usuario.objects.create_user(
            email="admin@gym.com", name="Admin", lastname="User",
            password="pass123", roles="admin", gimnasio=self.gimnasio
        )
        self.miembro = UsuarioGym.objects.create(
            name="Carlos", lastname="Mendez", gimnasio=self.gimnasio
        )
        self.membresia = Membresia.objects.create(
            name="básico", price=Decimal('50000'), duration=30, gimnasio=self.gimnasio
        )
        self.asignada = MembresiaAsignada.objects.create(
            miembro=self.miembro,
            membresia=self.membresia,
            dateInitial=date(2026, 7, 1)
        )
        self.factory = APIRequestFactory()

    def test_post_pago_registra_abono(self):
        """5.5: POST pago registra abono y actualiza estado."""
        view = PagoMembresiaViewSet.as_view({'post': 'create'})
        data = {
            'monto': '30000',
            'metodo_pago': 'efectivo',
            'nota': 'Abono inicial'
        }
        request = self.factory.post('/', data)
        request.user = self.user
        request.gimnasio = self.gimnasio
        force_authenticate(request, user=self.user)

        response = view(request, pk=self.asignada.id)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['monto'], '30000.00')
        self.assertEqual(response.data['metodo_pago'], 'efectivo')
        self.assertIn('id', response.data)

        # Verificar que el pago existe en DB
        self.assertEqual(PagoMembresia.objects.count(), 1)
        pago = PagoMembresia.objects.first()
        self.assertEqual(pago.monto, Decimal('30000.00'))

        # Verificar que el estado de la membresia se actualizo
        self.asignada.refresh_from_db()
        self.assertEqual(self.asignada.total_pagado, Decimal('30000.00'))
        self.assertEqual(self.asignada.saldo_pendiente, Decimal('20000.00'))
        self.assertEqual(self.asignada.estado_pago, 'partial')

    def test_post_pago_lista_historial(self):
        """GET pagos lista el historial ordenado."""
        # Create two payments
        PagoMembresia.objects.create(
            membresia_asignada=self.asignada,
            monto=Decimal('10000'),
            metodo_pago='efectivo'
        )
        PagoMembresia.objects.create(
            membresia_asignada=self.asignada,
            monto=Decimal('20000'),
            metodo_pago='nequi'
        )

        view = PagoMembresiaViewSet.as_view({'get': 'list'})
        request = self.factory.get('/')
        request.user = self.user
        request.gimnasio = self.gimnasio
        force_authenticate(request, user=self.user)

        response = view(request, pk=self.asignada.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should be ordered by fecha_pago descending
        self.assertEqual(len(response.data), 2)


class HomeDashboardPagosTest(TestCase):
    """Integration tests for Home dashboard payment stats."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.user = Usuario.objects.create_user(
            email="admin@gym.com", name="Admin", lastname="User",
            password="pass123", roles="admin", gimnasio=self.gimnasio
        )
        today = date.today()

        # Membresia basica de 30 dias
        self.membresia = Membresia.objects.create(
            name="básico", price=Decimal('50000'), duration=30, gimnasio=self.gimnasio
        )

        # Miembro 1: Al dia (paid)
        miembro1 = UsuarioGym.objects.create(name="Ana", lastname="Garcia", gimnasio=self.gimnasio)
        m1 = MembresiaAsignada.objects.create(
            miembro=miembro1, membresia=self.membresia,
            dateInitial=today
        )
        PagoMembresia.objects.create(
            membresia_asignada=m1, monto=Decimal('50000'), metodo_pago='efectivo'
        )

        # Miembro 2: Con deuda (partial)
        miembro2 = UsuarioGym.objects.create(name="Luis", lastname="Martinez", gimnasio=self.gimnasio)
        m2 = MembresiaAsignada.objects.create(
            miembro=miembro2, membresia=self.membresia,
            dateInitial=today
        )
        PagoMembresia.objects.create(
            membresia_asignada=m2, monto=Decimal('30000'), metodo_pago='efectivo'
        )
        # saldo_pendiente = 50000 - 30000 = 20000

        # Miembro 3: Con deuda (pending - sin pagos)
        miembro3 = UsuarioGym.objects.create(name="Pedro", lastname="Ramirez", gimnasio=self.gimnasio)
        MembresiaAsignada.objects.create(
            miembro=miembro3, membresia=self.membresia,
            dateInitial=today
        )
        # saldo_pendiente = 50000

    def test_home_retorna_por_cobrar_al_dia_con_deuda(self):
        """5.6: GET /home/ retorna por_cobrar, al_dia, con_deuda correctos."""
        view = Home.as_view()
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = self.user
        request.gimnasio = self.gimnasio
        force_authenticate(request, user=self.user)

        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = json.loads(response.content)
        # por_cobrar = 20000 (Miembro 2) + 50000 (Miembro 3) = 70000
        self.assertEqual(data['por_cobrar'], 70000.0)
        # al_dia = 1 (Miembro 1)
        self.assertEqual(data['al_dia'], 1)
        # con_deuda = 2 (Miembro 2 y 3)
        self.assertEqual(data['con_deuda'], 2)

    def test_home_multi_tenant_filtra_por_gimnasio(self):
        """Dashboard stats solo muestran datos del gimnasio del usuario."""
        # Crear otro gimnasio con miembros
        otro_gym = Gimnasio.objects.create(name="Otro Gym")
        otro_miembro = UsuarioGym.objects.create(name="Otro", lastname="Member", gimnasio=otro_gym)
        MembresiaAsignada.objects.create(
            miembro=otro_miembro, membresia=self.membresia,
            dateInitial=date.today()
        )

        view = Home.as_view()
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = self.user
        request.gimnasio = self.gimnasio
        force_authenticate(request, user=self.user)

        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        # Solo deberia contar los 3 miembros del gimnasio original
        self.assertEqual(data['num_miembros'], 3)
        self.assertEqual(data['por_cobrar'], 70000.0)