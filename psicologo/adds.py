from django.db import models
# import pytz
import datetime
from zoneinfo import ZoneInfo
from .opciones_seleccion import (
    ORIENTACIONES_SEXUALES,
    SEXOS,
    ESTADOS_CIVILES,
    ESTADOS,
    OPCIONES_ESTADO_CITA,
    ESTRATOS,
)


def form_a_dict(form):
    form_dict = {
        "fields": {},
        #'widgets': {},
        "labels": {},
        "help_texts": {},
        "errors": {},
        "field_types": {},
        "required_fields": {},
        "choices": {},
    }
    for field_name, field in form.fields.items():
        # Obtener el valor del campo en el formulario y usar None como valor predeterminado si no está definido
        field_value = (
            form[field_name].value() if form[field_name].value() is not None else None
        )
        # Agregar información del campo al diccionario
        form_dict["fields"][field_name] = field_value
        # form_dict['widgets'][field_name] = str(field.widget)
        form_dict["labels"][field_name] = str(field.label)
        form_dict["help_texts"][field_name] = (
            str(field.help_text)
            .replace("<ul>", "")
            .replace("<li>", "")
            .replace("</li>", "")
            .replace("</ul>", "")
        )
        form_dict["errors"][field_name] = form[field_name].errors
        form_dict["field_types"][field_name] = field.widget.__class__.__name__
        form_dict["required_fields"][field_name] = field.required
        if isinstance(field, models.CharField) and field.choices:
            form_dict["choices"][field_name] = {v: k for k, v in field.choices}
        elif field.__class__.__name__ == "TypedChoiceField":
            form_dict["choices"][field_name] = {v: k for k, v in field.choices}
        else:
            form_dict["choices"][field_name] = {}

    campos_agrupados = {}
    formulario_dict = form_dict
    # Iterar sobre las claves de 'fields'
    for field_name in formulario_dict["fields"]:
        # Obtener los valores correspondientes a cada campo
        valor = formulario_dict["fields"][field_name]
        etiqueta = formulario_dict["labels"][field_name]
        ayuda = formulario_dict["help_texts"][field_name]
        errores = formulario_dict["errors"][field_name]
        tipo_campo = formulario_dict["field_types"][field_name]
        requerido = formulario_dict["required_fields"][field_name]
        opciones = formulario_dict["choices"][field_name]

        # Crear un diccionario con los valores agrupados por campo
        campos_agrupados[field_name] = {
            "nombre": field_name,
            "valor": valor,
            "etiqueta": etiqueta,
            "ayuda": ayuda,
            "errores": errores,
            "tipo_campo": tipo_campo,
            "requerido": requerido,
            "opciones": opciones,
        }
    return campos_agrupados


def transformar_utc_a_zona_usuario(hora_utc, zona_usuario):
    """Devuelve la hora UTC en la zona que se pasa como argumento"""

    # Hora en el argumento es UTC.
    hora_utc = hora_utc.replace(tzinfo=ZoneInfo("UTC"))
    # Zona horaria del usuario
    tz = ZoneInfo(zona_usuario)   
    return hora_utc.astimezone(tz)


def mapear_opciones_respuesta(diccionario):
    """Toma un diccionario con claves y valores; verifica si entre las claves están aquellas que requieren mapeo, y mapea de acuerdo a las opciones de respuesta."""

    opciones = [ORIENTACIONES_SEXUALES, SEXOS, ESTADOS_CIVILES, ESTADOS, ESTRATOS]
    claves = ["orientacion_sexual", "sexo", "estado_civil", "estado", "estrato"]

    indice_opciones = 0
    for clave in claves:
        try:
            diccionario[clave] = [
                x for x, y in opciones[indice_opciones] if y == diccionario[clave]
            ][0]
            indice_opciones += 1
        except:
            indice_opciones += 1

    return diccionario
