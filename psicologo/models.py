from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, AbstractBaseUser
from .validadores_modelos import validar_fecha_anterior, validar_edad, validar_estrato, validar_formato_fecha
from .opciones_seleccion import ORIENTACIONES_SEXUALES, SEXOS, ESTADOS_CIVILES, ESTADOS, OPCIONES_ESTADO_CITA, LONGITUD_ID, ESTRATOS
from django.utils.translation import gettext as _
from datetime import date, datetime

# Create your models here.


class UsuarioManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password, username, **extra_fields):
        if not email:
            raise ValueError(_("El correo electrónico es obligatorio"))
        if not first_name:
            raise ValueError(_("El nombre es obligatorio"))
        if not last_name:
            raise ValueError(_("El apellido es obligatorio"))
        if not username:
            raise ValueError(_("Debe proporcionar un nombre de usuario"))
        if not password:
            raise ValueError(_("Debe proporcionar una contraseña"))

        email = self.normalize_email(email)
        usuario = self.model(username=username, email=email,
                             first_name=first_name, last_name=last_name, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, first_name, last_name, password, username, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe especificar is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe especificar is_superuser=True.')

        return self.create_user(email=email, first_name=first_name, last_name=last_name, password=password, username=username, **extra_fields)


class Usuario(AbstractUser):
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email']
    email = models.EmailField(unique=True, blank=False,
                              verbose_name=_("Correo electrónico"))
    groups = models.ManyToManyField(
        Group, related_name='usuarios_en_grupo', verbose_name=_("Grupos"))
    user_permissions = models.ManyToManyField(
        Group, related_name='usuario_con_permiso', verbose_name=_("Permisos de usuario"))
    profesion = models.CharField(verbose_name=_(
        "Profesión"), max_length=50, blank=True)
    anios_experiencia = models.IntegerField(
        verbose_name=_("Años de experiencia"), default=0, blank=True)
    first_name = models.CharField(verbose_name=_(
        "Nombre"), blank=False, max_length=150, help_text="Ingrese su nombre o nombres completos completo")
    last_name = models.CharField(verbose_name=_(
        "Apellidos"), blank=False, max_length=150, help_text="Intrese su apellido o apellidos")
    telefono_celular = models.CharField(
        verbose_name=_("Número de celular"),
        blank=True,
        help_text="El número telefónico debe iniciar con 3 y tener diez dígitos",
        max_length=10,
        validators=[RegexValidator(
            regex=r'^6\d{9}$',
            message="Ingresa un número telefónico válido, que empiece por 6 y de diez dígitos",
        )],
        error_messages={
            "null": "Este campo no puede estar vacío"
        },
    )
    direccion = models.CharField(
        max_length=400,
        blank=True,
        verbose_name=_("Dirección del consultorio"),
        help_text="Ingrese una dirección válida de residencia",
        error_messages={
            "null": "Este campo no puede estar vacío",
        }
    )
    password_confirm = models.CharField(
        verbose_name=_("Confirmación de contraseña"),
        max_length=128,
        blank=False,
        help_text="Por favor, ingrese la contraseña nuevamente para confirmarla.",
    )

    def serialize(self):
        return {
            "nombre": self.first_name,
            "correo": self.email,
            "profesion": self.profesion,
            "años_experiencia": self.anios_experiencia,
            "apellido": self.last_name,
            "telefono": self.telefono_celular,
            "direccion": self.direccion
        }

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}"

    objects = UsuarioManager()


class Otro_significativo (models.Model):
    nombre = models.CharField(max_length=200)
    edad = models.SmallIntegerField()
    ocupacion = models.CharField(max_length=200)
    parentesco = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre


class Paciente(models.Model):
    fecha_registro = models.DateField(
        verbose_name="Fecha del registro inicial",
        auto_now_add=True
    )
    terapeuta = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    apellidos = models.CharField(max_length=100, verbose_name="Apellidos")
    numero_id = models.CharField(
        max_length=LONGITUD_ID, verbose_name="Número de identificación")
    fecha_nacimiento = models.DateField(
        verbose_name="Fecha de nacimiento",
        help_text="Ingrese la fecha de nacimiento en formato dd-mm-aaaa",
        #validators=[validar_fecha_anterior, validar_edad],
    )
    sexo = models.CharField(choices=SEXOS, max_length=50)
    orientacion_sexual = models.CharField(
        choices=ORIENTACIONES_SEXUALES,
        verbose_name="Orientación sexual",
        help_text="Seleccione una orientación sexual",
        max_length=50,
        error_messages={
            "null": "Debes seleccinar una opción",
        }
    )
    estado_civil = models.CharField(choices=ESTADOS_CIVILES, max_length=50)
    estrato = models.CharField(
        max_length=3,
        verbose_name="Estrato socioeconómico",
        help_text="Seleccione un número entre 1 y 6",        
        choices=ESTRATOS,
    )
    ocupacion = models.CharField(
        max_length=250, verbose_name="Ocupación actual")
    direccion = models.TextField(
        max_length=400,
        verbose_name="Dirección de residencia",
        help_text="Ingrese una dirección válida de residencia",
        error_messages={
            "null": "Este campo no puede estar vacío",
        }
    )
    telefono_fijo = models.CharField(
        verbose_name="Número telefónico fijo",
        help_text="Debe iniciar con 6 y tener diez dígitos. Por ejemplo 6012222222",
        max_length=10,
        validators=[RegexValidator(
            regex=r'^6\d{9}$',
            message="Debe empezar por 6 y tener diez dígitos: por ejemplo 6012222222",
        )],
        error_messages={
            "null": "Este campo no puede estar vacío"
        },
    )
    telefono_celular = models.CharField(
        verbose_name="Número telefónico celular",
        help_text="Debe iniciar con 3 y tener diez dígitos",
        max_length=10,
        validators=[RegexValidator(
            regex=r'^3\d{9}$',
            message="Ingresa un número telefónico válido, que empiece por 3 y de diez dígitos",
        )],
        error_messages={
            "null": "Este campo no puede estar vacío"
        },
    )
    correo_electronico = models.EmailField(
        verbose_name="Correo electrónico",
        help_text="Ingresa una dirección válida de correo electrónico",
        max_length=254,
        error_messages={
            "unique": "Esta dirección de correo electrónico ya está en uso",
            "null": "Este campo no puede estar vacío",
            "invalid": "Ingresa una dirección válidad de correo electrónico",
        }
    )

    eps = models.CharField(
        verbose_name="EPS",
        help_text="Ingrese el nombre de la EPS a la que pertenece el usuario",
        max_length=100,
        error_messages={
            "null": "Este campo no puede estar vacío",
        }
    )
    contacto_emergencia = models.ManyToManyField(
        Otro_significativo,
        related_name="paciente_emergencia",
        help_text="Agrega a una o varias personas que serán el contacto de emergencia del usuario",
        verbose_name="Contacto de emergencia")

    personas_convive = models.ManyToManyField(
        Otro_significativo,
        related_name="paciente_convive",
        verbose_name="Personas con las que convive",
        help_text="Agrega a todas las personas con las que el usuario conviva")
    motivo_consulta = models.TextField(
        help_text="Escriba textualmente el motivo de consulta del usuario",
        verbose_name="Motivo de consulta",
    )
    diagnosticos_medicos_actuales = models.TextField(
        help_text="Escriba una lista con todos los diagnósticos médicos que tiene actualmente el usuario",
        verbose_name="Diagnósticos médicos actuales",
    )
    diagnosticos_psiquiatricos_actuales = models.TextField(
        help_text="Escriba una lista con todos los diagnósticos médicos que tiene actualmente el usuario",
        verbose_name="Diagnósticos psiquiátricos actuales",
    )
    estado = models.CharField(
        choices=ESTADOS,
        verbose_name="Estado actual",
        help_text="Seleccione el estado actual del servicio",
        max_length=50,
        error_messages={
            "null": "Debes seleccinar una opción",
        }
    )

    # Propiedad para obtener la edad dinámicamente (que no se almacene estáticamente en la bd)
    @property
    def edad_actual(self):
        hoy = date.today()
        edad = hoy.year - self.fecha_nacimiento.year - \
            ((hoy.month, hoy.day) <
             (self.fecha_nacimiento.month, self.fecha_nacimiento.day))
        return edad

    def serialize_completo(self):
        return {
            "Fecha de registro:": self.fecha_registro,
            "N° historia clínica:": self.id,
            "Nombres:": self.nombre,
            "Apellidos:": self.apellidos,
            "Fecha de nacimiento:": self.fecha_nacimiento,
            "Edad:": self.edad_actual,
            "Número de identificación:": self.numero_id,
            "Ocupación:": self.ocupacion,
            "Estrato:": self.estrato,
            "Sexo:": self.sexo.capitalize(),
            "Estado civil:": self.estado_civil.capitalize(),
            "Teléfono fijo:": self.telefono_fijo,
            "Teléfono celular:": self.telefono_celular,
            "Correo electrónico:": self.correo_electronico,
            "Dirección:": self.direccion,
            "Eps:": self.eps,
            "Motivo de consulta:": self.motivo_consulta,
            "Diagnósticos médicos:": self.diagnosticos_medicos_actuales,
            "Diagnósticos psiquiátricos:": self.diagnosticos_psiquiatricos_actuales,
            "Contacto de emergencia:": "".join(f"{contacto.nombre} ({contacto.parentesco})\n" for contacto in self.contacto_emergencia.all()),
            "Personas con las que convive:": "".join(f"{contacto.nombre} ({contacto.parentesco})\n" for contacto in self.personas_convive.all()),
            "Estado actual del servicio:": self.estado.capitalize(),
        }

    def serialize_info_general(self):
        return {

            "Apellidos": self.apellidos,
            "Nombre": self.nombre,
            "Edad": self.edad_actual,
            "Teléfono fijo": self.telefono_fijo,
            "Teléfono celular": self.telefono_celular,
            "Correo electrónico": self.correo_electronico,

        }

    def __str__(self):
        return f"{self.nombre}, atendido por {self.terapeuta}"


class Sesiones(models.Model):
    terapeuta = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    paciente = models.ForeignKey(
        Paciente, related_name="sesiones", on_delete=models.PROTECT)
    fecha_programada_sesion = models.DateField(
        verbose_name="Fecha de la próxima sesión"
    )
    hora_programada = models.TimeField(
        verbose_name="Hora en la que se desarrollará la sesión",
        help_text="Ingrese una hora en formato válido de 12 horas. Por ejemplo: 04:00 PM",
    )
    fecha_sesion = models.DateField(
        null=True,
        blank=True,
        verbose_name="Fecha de desarrollo de la sesión"
    )
    hora_inicio_sesion = models.TimeField(
        null=True,
        blank=True,
        verbose_name="Hora de inicio de sesión",
        help_text="Ingrese la hora en la que efectivamente inició la sesión",
    )
    hora_fin_sesion = models.TimeField(
        null=True,
        verbose_name="Hora de finalización de la sesión",
        help_text="Ingrese la hora en la que finalizó la sesión",
        blank=True,
    )
    objetivo_sesion = models.TextField(
        null=True,
        verbose_name="Objetivo de la sesión a registrar",
        help_text="Ingrese un objetivo claro y descriptivo para la sesión que va a registrar",
        blank=True,
    )
    desarrollo_sesion = models.TextField(
        null=True,
        verbose_name="Descripción del desarrollo de la sesión",
        help_text="Describa el desarrollo de la sesión. Asegúrese de resumir de manera clara y precisa",
        blank=True,
    )
    tareas_sesion = models.TextField(
        null=True,
        verbose_name="Tareas para la próxima sesión",
        help_text="Haga una lista de las tareas o ejercicios que acordó con su usuario",
        blank=True,
    )
    estado = models.CharField(
        choices=OPCIONES_ESTADO_CITA,
        max_length=25,
        default="programada",
        verbose_name="Estado de la consulta",
        help_text="Seleccione el estado de la consulta"
    )
    zona_horaria = models.CharField(
        max_length=50
    )

    def serialize(self):
        return {
            "terapeuta": self.terapeuta,
            "paciente": f"{self.paciente.nombre} {self.paciente.apellidos}",
            "fecha_programada": self.fecha_programada_sesion,
            "hora_programada": self.hora_programada,
            "fecha_sesion": self.fecha_sesion,
            "hora_inicio": self.hora_inicio_sesion,
            "hora_fin": self.hora_fin_sesion,
            "objetivo_sesion": self.objetivo_sesion,
            "desarrollo_sesion": self.desarrollo_sesion,
            "tareas_sesion": self.tareas_sesion,
            "estado_sesion": self.estado
        }

    def serialize_perfil(self):
        return {
            "Fecha": self.fecha_sesion,
            "Hora de inicio": self.hora_inicio_sesion,
            "Hora de finalización": self.hora_fin_sesion,
            "Objetivo registrado para la sesión": self.objetivo_sesion,
            "Desarrollo de la sesión": self.desarrollo_sesion,
            "Tareas de la sesión": self.tareas_sesion,
            "Estado actual": self.estado.capitalize()
        }

    def __str__(self):
        return f"Sesión programada para {self.fecha_programada_sesion}, en estado {self.estado}"
    # Se requieren métodos adicionales para manejar los condicionales según se haya realizado la sesión o no.
    # Es necesario agregar campos de usuario para complementar el perfil del profesional.
    # En el futuro: anexos, filefield, convertir las tareas en un campo many to many.
