from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Gimnasio, Membresia

DEFAULT_MEMBERSHIPS = [
    {'name': 'Básico', 'duration': 15, 'max_multiplier': 1, 'price': 0},
    {'name': 'Premium', 'duration': 30, 'max_multiplier': 12, 'price': 0},
    {'name': 'VIP', 'duration': 45, 'max_multiplier': 8, 'price': 0},
]


@receiver(post_save, sender=Gimnasio)
def seed_default_memberships(sender, instance, created, **kwargs):
    if created and not instance.membresias.exists():
        Membresia.objects.bulk_create([
            Membresia(gimnasio=instance, **m) for m in DEFAULT_MEMBERSHIPS
        ])
