# Generated by Django 4.2.5 on 2023-09-25 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('psicologo', '0003_usuario_password_confirm'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paciente',
            name='correo_electronico',
            field=models.EmailField(error_messages={'invalid': 'Ingresa una dirección válidad de correo electrónico', 'null': 'Este campo no puede estar vacío', 'unique': 'Esta dirección de correo electrónico ya está en uso'}, help_text='Ingresa una dirección válida de correo electrónico', max_length=254, verbose_name='Correo electrónico'),
        ),
        migrations.AlterField(
            model_name='paciente',
            name='estrato',
            field=models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6')], help_text='Seleccione un número entre 1 y 6', max_length=3, verbose_name='Estrato socioeconómico'),
        ),
        migrations.AlterField(
            model_name='sesiones',
            name='fecha_programada_sesion',
            field=models.DateField(verbose_name='Fecha de la próxima sesión'),
        ),
        migrations.AlterField(
            model_name='sesiones',
            name='fecha_sesion',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de desarrollo de la sesión'),
        ),
    ]
