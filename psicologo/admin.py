from django.contrib import admin
from .models import Usuario, Paciente, Otro_significativo, Sesiones
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.admin import UserAdmin
from .forms import FormularioUsuario


class FomularioCambioUsuario(UserChangeForm):
    class Meta:
        model = Usuario
        fields = "__all__"


class UsuarioAdmin(UserAdmin):
    add_form = FormularioUsuario

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "first_name",
                    "last_name",
                    "username",
                    "email",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


# Register your models here.
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Paciente)
admin.site.register(Otro_significativo)
admin.site.register(Sesiones)
