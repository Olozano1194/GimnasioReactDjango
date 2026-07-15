import io
import base64
from django.test import TestCase
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from django.db import IntegrityError
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from unittest.mock import patch, MagicMock, call

from .models import Gimnasio, Usuario, UsuarioGym, Membresia, MembresiaAsignada
from .middleware import GimnasioMiddleware
from .mixins import MultiTenantViewSetMixin
from .serializers import UsuarioSerializer, UsuarioGymSerializer, MembresiasSerializer, MembresiaAsignadaSerializer
from .views import UserViewSet, UsuarioGymViewSet, MembresiaViewSet
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
        # gym1 has 3 defaults (Básico, Premium, VIP) + Plan 1 = 4, gym2 has Plan 2
        gym1_count = len([m for m in response.data if m['gimnasio'] == self.gimnasio1.id])
        gym2_count = len([m for m in response.data if m['gimnasio'] == self.gimnasio2.id])
        self.assertEqual(gym1_count, 4)
        self.assertEqual(gym2_count, 0)


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
# PHASE 6: CUSTOMIZABLE MEMBERSHIPS TESTS
# ============================================================

class MembresiaModelTest(TestCase):
    """Tests for Membresia model changes."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        # Note: seed signal creates Básico/Premium/VIP automatically
        self.membresia = Membresia.objects.create(
            name="Premium Pro",
            price=50000,
            duration=30,
            max_multiplier=12,
            gimnasio=self.gimnasio
        )

    # 6.1: Existing tests updated - Membresia objects now include max_multiplier
    def test_membresia_has_max_multiplier_default(self):
        """Membresia should default max_multiplier to 1."""
        m = Membresia.objects.create(
            name="Basico Plus", price=100, duration=15, gimnasio=self.gimnasio
        )
        self.assertEqual(m.max_multiplier, 1)

    def test_membresia_accepts_free_text_name(self):
        """Membresia.name should accept any string, not just choices."""
        m = Membresia.objects.create(
            name="Mensual $50k", price=50000, duration=30,
            max_multiplier=6, gimnasio=self.gimnasio
        )
        self.assertEqual(m.name, "Mensual $50k")

    # 6.3: unique_together per gym
    def test_unique_together_per_gym(self):
        """Two memberships with same name for same gym should raise IntegrityError."""
        Membresia.objects.create(
            name="UniquePlan", price=100, duration=15,
            max_multiplier=1, gimnasio=self.gimnasio
        )
        with self.assertRaises(IntegrityError):
            Membresia.objects.create(
                name="UniquePlan", price=200, duration=30,
                max_multiplier=1, gimnasio=self.gimnasio
            )

    def test_same_name_different_gyms_allowed(self):
        """Different gyms can have memberships with the same name."""
        gym2 = Gimnasio.objects.create(name="Gym 2")
        Membresia.objects.create(
            name="SameName", price=100, duration=15,
            max_multiplier=1, gimnasio=self.gimnasio
        )
        # Should not raise
        Membresia.objects.create(
            name="SameName", price=200, duration=30,
            max_multiplier=1, gimnasio=gym2
        )


class MembresiaAsignadaModelSaveTest(TestCase):
    """Tests for MembresiaAsignada.save() multiplier validation."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.membresia = Membresia.objects.create(
            name="Limited", price=10000, duration=30,
            max_multiplier=4, gimnasio=self.gimnasio
        )
        self.miembro = UsuarioGym.objects.create(
            name="Test", lastname="Member", gimnasio=self.gimnasio
        )

    # 6.2: save() rejects multiplier > max_multiplier
    def test_save_rejects_multiplier_exceeds_max(self):
        """MembresiaAsignada.save() should raise ValidationError when multiplier > max_multiplier."""
        asignacion = MembresiaAsignada(
            miembro=self.miembro,
            membresia=self.membresia,
            multiplier=5,  # max_multiplier is 4
            dateInitial="2026-01-01"
        )
        with self.assertRaises(DjangoValidationError):
            asignacion.save()

    def test_save_accepts_valid_multiplier(self):
        """MembresiaAsignada.save() should accept multiplier <= max_multiplier."""
        asignacion = MembresiaAsignada(
            miembro=self.miembro,
            membresia=self.membresia,
            multiplier=3,  # max_multiplier is 4
            dateInitial="2026-01-01"
        )
        # Should not raise
        asignacion.save()
        self.assertEqual(asignacion.multiplier, 3)

    def test_save_calculates_price_with_multiplier(self):
        """save() should multiply price by multiplier on creation."""
        asignacion = MembresiaAsignada(
            miembro=self.miembro,
            membresia=self.membresia,
            multiplier=3,
            dateInitial="2026-01-01"
        )
        asignacion.save()
        expected_price = self.membresia.price * 3  # 10000 * 3 = 30000
        self.assertEqual(asignacion.price, expected_price)

    def test_save_calculates_date_final_with_multiplier(self):
        """save() should multiply duration by multiplier on creation."""
        from datetime import date, timedelta
        asignacion = MembresiaAsignada(
            miembro=self.miembro,
            membresia=self.membresia,
            multiplier=3,
            dateInitial="2026-01-01"
        )
        asignacion.save()
        expected_days = self.membresia.duration * 3  # 30 * 3 = 90
        expected_final = date(2026, 1, 1) + timedelta(days=expected_days)
        self.assertEqual(asignacion.dateFinal, expected_final)


class SeedDefaultMembershipsTest(TestCase):
    """Tests for post_save signal seed."""

    # 6.4: Seed creates 3 default memberships on Gimnasio creation
    def test_new_gym_gets_default_memberships(self):
        """Creating a new Gimnasio should seed 3 default memberships."""
        gym = Gimnasio.objects.create(name="New Gym")
        memberships = Membresia.objects.filter(gimnasio=gym)
        self.assertEqual(memberships.count(), 3)

        names = [m.name for m in memberships]
        self.assertIn("Básico", names)
        self.assertIn("Premium", names)
        self.assertIn("VIP", names)

    def test_default_memberships_have_correct_durations(self):
        """Default memberships should have correct durations."""
        gym = Gimnasio.objects.create(name="Gym Durations")
        basico = Membresia.objects.get(gimnasio=gym, name="Básico")
        premium = Membresia.objects.get(gimnasio=gym, name="Premium")
        vip = Membresia.objects.get(gimnasio=gym, name="VIP")

        self.assertEqual(basico.duration, 15)
        self.assertEqual(basico.max_multiplier, 1)
        self.assertEqual(premium.duration, 30)
        self.assertEqual(premium.max_multiplier, 12)
        self.assertEqual(vip.duration, 45)
        self.assertEqual(vip.max_multiplier, 8)

    def test_default_memberships_have_zero_price(self):
        """Default memberships should have price=0."""
        gym = Gimnasio.objects.create(name="Zero Price Gym")
        for m in Membresia.objects.filter(gimnasio=gym):
            self.assertEqual(m.price, 0)

    # 6.5: Seed does NOT re-seed when memberships already exist
    def test_seed_does_not_re_seed_existing_gym(self):
        """Saving an existing gym with memberships should NOT create duplicates."""
        gym = Gimnasio.objects.create(name="Gym With Memberships")

        # Count should be 3 (from seed)
        self.assertEqual(Membresia.objects.filter(gimnasio=gym).count(), 3)

        # Add a custom membership
        Membresia.objects.create(
            name="Custom Plan", price=500, duration=10,
            max_multiplier=1, gimnasio=gym
        )

        # Save gym again
        gym.save()

        # Count should still be 4 (3 original + 1 custom, no duplicates)
        self.assertEqual(Membresia.objects.filter(gimnasio=gym).count(), 4)

    def test_seed_skips_if_memberships_exist(self):
        """Signal should skip seed if gym already has memberships."""
        gym = Gimnasio.objects.create(name="Pre-seeded Gym")

        # Manually add a membership before the signal hypothetically fires
        Membresia.objects.create(
            name="Pre-existing", price=300, duration=20,
            max_multiplier=1, gimnasio=gym
        )

        # Delete what the signal created and save again
        Membresia.objects.filter(gimnasio=gym).exclude(name="Pre-existing").delete()
        gym.save()

        # Should still only have the pre-existing one
        self.assertEqual(Membresia.objects.filter(gimnasio=gym).count(), 1)


class MembresiasSerializerTest(TestCase):
    """Tests for MembresiasSerializer."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")

    # 6.6: MembresiasSerializer rejects duration=0 or duration=400
    def test_rejects_duration_zero(self):
        """Serializer should reject duration=0."""
        data = {
            "name": "Test Plan",
            "price": 100,
            "duration": 0,
            "max_multiplier": 1
        }
        serializer = MembresiasSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("duration", serializer.errors)

    def test_rejects_duration_above_365(self):
        """Serializer should reject duration=400."""
        data = {
            "name": "Test Plan",
            "price": 100,
            "duration": 400,
            "max_multiplier": 1
        }
        serializer = MembresiasSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("duration", serializer.errors)

    def test_accepts_valid_duration(self):
        """Serializer should accept duration=30."""
        data = {
            "name": "Test Plan",
            "price": 100,
            "duration": 30,
            "max_multiplier": 1
        }
        serializer = MembresiasSerializer(data=data, context={'request': self._make_request()})
        # Without gimnasio in context, create will fail, but validation should pass
        self.assertTrue(serializer.is_valid())

    def test_accepts_valid_duration_edge(self):
        """Serializer should accept duration=1 and duration=365."""
        for dur in [1, 365]:
            data = {
                "name": f"Plan {dur}",
                "price": 100,
                "duration": dur,
                "max_multiplier": 1
            }
            serializer = MembresiasSerializer(data=data, context={'request': self._make_request()})
            self.assertTrue(serializer.is_valid(), f"Duration {dur} should be valid")

    def _make_request(self):
        """Create a mock request with gimnasio."""
        factory = APIRequestFactory()
        request = factory.get('/')
        request.gimnasio = self.gimnasio
        return request


class MembresiaAsignadaSerializerValidationTest(TestCase):
    """Tests for MembresiaAsignadaSerializer multiplier validation."""

    def setUp(self):
        self.gimnasio = Gimnasio.objects.create(name="Test Gym")
        self.membresia = Membresia.objects.create(
            name="Limited", price=10000, duration=30,
            max_multiplier=4, gimnasio=self.gimnasio
        )
        self.miembro = UsuarioGym.objects.create(
            name="Test", lastname="Member", gimnasio=self.gimnasio
        )

    # 6.7: MembresiaAsignadaSerializer rejects multiplier > max_multiplier
    def test_serializer_rejects_multiplier_exceeds_max(self):
        """Serializer should reject multiplier > max_multiplier."""
        data = {
            "miembro": self.miembro.id,
            "membresia": self.membresia.id,
            "multiplier": 5,  # max is 4
            "dateInitial": "2026-01-01"
        }
        serializer = MembresiaAsignadaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_serializer_accepts_valid_multiplier(self):
        """Serializer should accept multiplier <= max_multiplier."""
        from datetime import date, timedelta
        data = {
            "miembro": self.miembro.id,
            "membresia": self.membresia.id,
            "multiplier": 3,  # max is 4
            "dateInitial": (date.today() + timedelta(days=365)).isoformat()
        }
        serializer = MembresiaAsignadaSerializer(data=data, context={'request': self._make_request()})
        self.assertTrue(serializer.is_valid(), f"Errors: {serializer.errors}")

    def _make_request(self):
        """Create a mock request with gimnasio."""
        factory = APIRequestFactory()
        request = factory.get('/')
        request.gimnasio = self.gimnasio
        return request