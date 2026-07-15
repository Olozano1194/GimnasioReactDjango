# Generated manually: apply remaining schema changes
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gimnasioApp', '0003_seed_max_multiplier_data'),
    ]

    operations = [
        # Alter name from varchar(10) to varchar(100)
        migrations.AlterField(
            model_name='membresia',
            name='name',
            field=models.CharField(max_length=100),
        ),
        # Alter multiplier field type to match PositiveIntegerField
        migrations.AlterField(
            model_name='membresiaasignada',
            name='multiplier',
            field=models.PositiveIntegerField(default=1, help_text='Multiplicador de duración/precio (1 = sin multiplicar)'),
        ),
        # Add unique_together constraint
        migrations.AlterUniqueTogether(
            name='membresia',
            unique_together={('gimnasio', 'name')},
        ),
    ]
