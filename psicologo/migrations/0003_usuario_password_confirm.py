# Generated by Django 4.2.5 on 2023-09-10 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('psicologo', '0002_alter_paciente_fecha_nacimiento'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='password_confirm',
            field=models.CharField(default='conformacion', help_text='Por favor, ingrese la contraseña nuevamente para confirmarla.', max_length=128, verbose_name='Confirmación de contraseña'),
            preserve_default=False,
        ),
    ]
