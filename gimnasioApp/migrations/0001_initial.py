# Generated by Django 5.1.4 on 2024-12-20 09:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RegistrarUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=45)),
                ('lastname', models.CharField(max_length=50)),
                ('roles', models.CharField(choices=[('recepcion', 'Recepcionista'), ('admin', 'Administrador')], default='recepcion', max_length=10)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'db_table': 'user',
            },
        ),
        migrations.CreateModel(
            name='RegistrarUsuarioGym',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('lastname', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=10)),
                ('address', models.CharField(max_length=50)),
                ('dateInitial', models.DateField(max_length=50)),
                ('dateFinal', models.DateField(max_length=50)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
            options={
                'verbose_name': 'RegistrarUsuarioGym',
                'verbose_name_plural': 'RegistrarUsuarioGyms',
                'db_table': 'RegistrarUsuarioGym',
            },
        ),
        migrations.CreateModel(
            name='RegistrarUsuarioGymDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('lastname', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=10)),
                ('dateInitial', models.DateField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
            options={
                'verbose_name': 'RegistrarUsuarioGymDay',
                'verbose_name_plural': 'RegistrarUsuarioGymDays',
                'db_table': 'RegistrarUsuarioGymDay',
            },
        ),
        migrations.CreateModel(
            name='Renovacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fechaRenovacion', models.DateField()),
                ('fechaVencimiento', models.DateField()),
                ('es_renovado', models.BooleanField(default=False)),
                ('usuarioGym', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='renovaciones', to='gimnasioApp.registrarusuariogym')),
            ],
            options={
                'verbose_name': 'Renovacion',
                'verbose_name_plural': 'Renovaciones',
                'db_table': 'Renovacion',
            },
        ),
    ]
