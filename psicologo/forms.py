from django import forms
from .models import Paciente, Usuario
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class ConfirmPasswordMixin(forms.Form):
    password = forms.CharField(
        label="Contraseña",
        widget=forms.PasswordInput,
        strip=True,
    )

    password_confirm = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput,
        strip=True,
    )

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password1")
        password_confirm = cleaned_data.get("password2")

        if password and password_confirm and password != password_confirm:
            raise ValidationError(
                "Las contraseñas no coinciden. Por favor, inténtalo de nuevo."
            )

        return cleaned_data


class FormularioPaciente(forms.ModelForm):
    # password2 = forms.CharField(label='Confirmar contraseña', widget=forms.PasswordInput)

    class Meta:
        model = Paciente
        exclude = ["terapeuta"]


class FormularioActualizarPaciente(forms.ModelForm):
    # password2 = forms.CharField(label='Confirmar contraseña', widget=forms.PasswordInput)

    class Meta:
        model = Paciente
        exclude = [
            "terapeuta",
            "nombre",
            "apellidos",
            "numero_id",
            "contacto_emergencia",
            "personas_convive",
            "fecha_nacimiento",
        ]


class FormularioUsuario(forms.ModelForm, ConfirmPasswordMixin):
    class Meta:
        model = Usuario
        fields = (
            "first_name",
            "last_name",
            "username",
            "email"            
        )

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user
