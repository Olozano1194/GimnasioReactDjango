# Generated manually: seed max_multiplier for existing memberships
from django.db import migrations


def forwards(apps, schema_editor):
    Membresia = apps.get_model('gimnasioApp', 'Membresia')
    Membresia.objects.filter(name__iexact='básico').update(max_multiplier=1)
    Membresia.objects.filter(name__iexact='premium').update(max_multiplier=12)
    Membresia.objects.filter(name__iexact='VIP').update(max_multiplier=8)


def backwards(apps, schema_editor):
    Membresia = apps.get_model('gimnasioApp', 'Membresia')
    Membresia.objects.filter(name__iexact='básico').update(max_multiplier=1)
    Membresia.objects.filter(name__iexact='premium').update(max_multiplier=1)
    Membresia.objects.filter(name__iexact='VIP').update(max_multiplier=1)


class Migration(migrations.Migration):

    dependencies = [
        ('gimnasioApp', '0002_membresia_max_multiplier_and_more'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
