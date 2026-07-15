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
        # Add unique_together constraint
        migrations.AlterUniqueTogether(
            name='membresia',
            unique_together={('gimnasio', 'name')},
        ),
    ]
