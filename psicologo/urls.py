from django.urls import path, include, re_path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from . import views


router = routers.DefaultRouter()

router.register(r"usuario",  views.UsuarioView, "usuario")
router.register(r"paciente",  views.PacienteView, "paciente")
router.register(r"otro_significativo",  views.Otro_significativoView, "otro")
router.register(r"sesiones", views.SesionesView, "sesiones")


urlpatterns = [
    #Autenticación
    path("psytrack", views.index, name="psytrack_app"),
    
    re_path("login", views.login),
    re_path("signup", views.signup),
    re_path("logout", views.log_out),
    re_path("test", views.test_token),
    
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="Psicologo API")),
    
    path(
        "api/v1/formularios/registro/paciente/",
         views.Cuestionario_registroView.as_view(),
        name="registro-paciente",
    ),
    path(
        "api/v1/formularios/actualizacion/paciente/<int:id_paciente>/",
         views.Cuestionario_actualizacionView.as_view(),
        name="acualizacion-paciente",
    ),
    path(
        "api/v1/formularios/registro/profesional/",
         views.Cuestionario_usuarioView.as_view(),
        name="registro-profesional",
    ),
    path(
        "api/v1/estadisticas/",
         views.Data_tableroView.as_view(),
        name="estadisticas",
    ),
    path(
        "api/v1/busqueda/",
         views.Busqueda_usuariosView.as_view(),
        name="busqueda"
    ),   
    
]

