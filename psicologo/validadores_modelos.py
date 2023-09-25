from django.core.exceptions import ValidationError

from datetime import date
import re


## CONSTANTES
EDAD_MINIMA_ATENCION = 5


## VALIDADORES
def validar_fecha_anterior(valor):
    """Valida que la fecha sea anterior al dia actual"""
    if valor < date.today():
        raise ValidationError("La fecha debe de ser mayor a la proporcionada")


def validar_edad(valor):
    """Valida que el usuario tenga más que la edad mínima y  menos que 130 años"""
    diferencia_delta_dias = (date.today() - valor).days
    edad = diferencia_delta_dias / 365.25
    if edad < EDAD_MINIMA_ATENCION:
        raise ValidationError(
            "En esta institución no se atienden personas menores de f'{EDAD_MINIMA_ATENCION}' años"
        )

    if edad > 130:
        raise ValidationError(
            "Actualmente es muy difícil que usted atienda a una persona mayor de 130 años"
        )


def validar_formato_fecha(valor):
    """Valida que el formato de la fecha sea correcto"""
    # convertir fecha a cadena:
    fecha = valor.strftime("%Y-%m-%d")
    coincide = re.match(r"^\d{2}-\d{2}-\d{4}$", fecha)
    if not coincide:
        raise ValidationError('La fecha debe estar en el formato "dd-mm-aaaa"')

    dia, mes, año = map(int, valor.split("-"))
    if not (1 <= dia <= 31) or not (1 <= mes <= 12):
        raise ValidationError(
            'Asegúrese de escribir correctamente el dia y mes en el formato correcto "dd-mm-aaa"'
        )


def validar_estrato(valor):
    """Valida que el estrato ingresado esté entre 1 y 6"""
    if not (1 <= valor <= 6):
        raise ValidationError("El estrato debe ser un número entre 1 y 6")
