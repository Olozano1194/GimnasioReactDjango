# Generated by Django 5.1.4 on 2025-01-25 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=45)),
                ('lastname', models.CharField(max_length=50)),
                ('avatar', models.ImageField(blank=True, default='', null=True, upload_to='fotos/')),
                ('roles', models.CharField(choices=[('recepcion', 'Recepcionista'), ('admin', 'Administrador')], default='recepcion', max_length=10)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Usuario',
                'verbose_name_plural': 'Usuarios',
                'db_table': 'usuario',
            },
        ),
        migrations.CreateModel(
            name='Membresia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('basico', 'Básico'), ('premium', 'Premium'), ('VIP', 'VIP')], default='basico', max_length=10)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('duration', models.PositiveIntegerField()),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Membresia',
                'verbose_name_plural': 'Membresias',
                'db_table': 'membresia',
            },
        ),
        migrations.CreateModel(
            name='UsuarioGym',
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
                'verbose_name': 'UsuarioGym',
                'verbose_name_plural': 'UsuarioGyms',
                'db_table': 'usuarioGym',
            },
        ),
        migrations.CreateModel(
            name='UsuarioGymDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('lastname', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=10)),
                ('dateInitial', models.DateField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
            options={
                'verbose_name': 'UsuarioGymDay',
                'verbose_name_plural': 'UsuarioGymDays',
                'db_table': 'usuarioGymDay',
            },
        ),
    ]
