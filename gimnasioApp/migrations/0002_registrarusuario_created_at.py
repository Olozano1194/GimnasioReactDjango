# Generated by Django 5.1.4 on 2024-12-11 09:18

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gimnasioApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='registrarusuario',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]