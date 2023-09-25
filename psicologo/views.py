from django.shortcuts import render
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework import viewsets, status, generics, permissions, routers
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .serializers import (
    UsuarioSerializer,
    PacienteSerializer,
    Otro_significativoSerializer,
    SesionesSerializer,
    ResultadosPacienteSerializer,
    PacienteResumenSerializer,    
)
from . import serializers
from .models import Usuario, Paciente, Otro_significativo, Sesiones
from .adds import form_a_dict
from .forms import FormularioPaciente, FormularioActualizarPaciente, FormularioUsuario
from django.db.models import Q
from django.http import HttpResponse
from django.contrib.auth import logout


def index(request):
    return render(request, "index.html")


@api_view(["POST"])
def login(request):
    usuario = get_object_or_404(Usuario, username=request.data["username"])
    if not usuario.check_password(request.data["password"]):
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    token, created =Token.objects.get_or_create(user=usuario)
    token_csrf = get_token(request)
    serializer= UsuarioSerializer(instance=usuario)
    return Response({"token": token.key, "token_csrf":token_csrf, "user": serializer.data})
    
@api_view(["POST"])
def signup(request):
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save() 
        usuario = Usuario.objects.get(pk=usuario.id)                             
        
        token = Token.objects.create(user=usuario)     
       
        return Response({"registrado": True}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_protect
@api_view(["POST"])
def log_out(request):
    logout(request)
    return Response({"mensaje": "Cierre de sesión exitoso"})
    
@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
     return Response(f"Passed for {request.user.email}")





# Create your views here.
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class PacienteView(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer
    queryset = Paciente.objects.all()
   

    def list(self, request, *args, **kwargs):
        pacientes = self.get_queryset()
        pacientes = pacientes.filter(terapeuta = request.user)
        serialized_data = [paciente.serialize_completo() for paciente in pacientes]
        return Response(serialized_data)
    
    def retrieve(self, request, *args, **kwargs):
        paciente = self.get_object()
        serialized_data = paciente.serialize_completo()
        return Response(serialized_data)
    
    @action(detail=True, methods=["GET"])
    def resumen(self, request, pk):
        paciente = Paciente.objects.get(pk=pk)        
        serialized_data = paciente.serialize_info_general()
        return Response(serialized_data)
    
    @action(detail=False, methods=["GET"])
    def atendidos(self, request):
        terapeuta = request.user.id
       
        pacientes = Paciente.objects.filter(terapeuta=terapeuta, estado="activo")
        respuesta = [
                (
                    {
                        "value": paciente.id,
                        "label": f"{paciente.apellidos} {paciente.nombre}",
                    }
                )
                for paciente in pacientes
            ]        
        return Response (respuesta)
    
    @action(detail=False, methods=["GET"])
    def activos(self, request):
        terapeuta = request.user.id
       
        pacientes = Paciente.objects.filter(terapeuta=terapeuta, estado="activo")
        respuesta = [
                (
                    {
                        "value": paciente.id,
                        "label": f"{paciente.apellidos} {paciente.nombre}",
                    }
                )
                for paciente in pacientes
            ]        
        return Response (respuesta)
    
    @action(detail=False, methods=["GET"])
    def verificar_mail(self, request):
        correo = self.request.query_params.get("correo", None)
        if correo:
            terapeuta = request.user.id
            if Paciente.objects.filter(terapeuta=terapeuta).filter(correo_electronico=correo).exists():
                return Response({"existe": True})
            return Response({"existe": False})
    


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class Crear_sesionView(APIView):
    def post(self, request, format=None):
        terapeuta = request.user.id
        request.data["terapeuta"] = terapeuta
        serializer= SesionesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    

    

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class SesionesView(viewsets.ModelViewSet):
    serializer_class= SesionesSerializer
    queryset=Sesiones.objects.all()

    def list(self, request, *args, **kwargs):        
        sesiones = self.get_queryset().filter(terapeuta = request.user)
        serializer = self.serializer_class(sesiones, many=True)
        return Response(serializer.data)    
   

    def create(self, request, *args, **kwargs):
        terapeuta = request.user.id
        request.data["terapeuta"] = terapeuta
        serializer= SesionesSerializer(data=request.data)
        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        sesion = self.get_object()
        serialized_data = {
                "Fecha Programada": sesion.fecha_programada_sesion.strftime("%d-%m-%Y"),
                "Hora programada": sesion.hora_programada.strftime("%I:%M %p"),
                "Usuario del servicio": f"{sesion.paciente.nombre} {sesion.paciente.apellidos}",
                "Zona horaria en la que se programó": sesion.zona_horaria
            }
        return Response(serialized_data)

    @action(detail=True, methods=["GET"])
    def lista_programadas(self, request, pk):
        paciente = Paciente.objects.get(pk=pk)
        sesiones_programadas = paciente.sesiones.all().filter(estado="programada")
        lista_sesiones = [
            (
                {
                    "value": sesion.id,
                    "label": f"{sesion.fecha_programada_sesion.strftime('%d-%m-%Y')}; {sesion.hora_programada.strftime('%I:%M %p')}",
                }
            )
            for sesion in sesiones_programadas
        ]
          
        return Response (lista_sesiones)
    
    @action(detail=True, methods=["GET"])
    def lista_paciente_actual(self, request, pk):
        terapeuta = request.user.id
        sesiones = Sesiones.objects.filter(terapeuta=terapeuta, paciente__id=pk)
        sesiones = sesiones.filter(~Q(estado="programada"))
        serializer = [sesion.serialize_perfil() for sesion in sesiones]        
        return Response(serializer)
    
    
    
   
       






@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class Otro_significativoView(viewsets.ModelViewSet):
    serializer_class = Otro_significativoSerializer
    queryset = Otro_significativo.objects.all()

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class Cuestionario_registroView(APIView):
    def get(self, request):
        return Response(form_a_dict(FormularioPaciente()))

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class Cuestionario_actualizacionView(APIView):
    def get(self, request, id_paciente):
        return Response(form_a_dict(FormularioActualizarPaciente(instance=Paciente.objects.get(pk=id_paciente))))


class Cuestionario_usuarioView(APIView):
    def get(self, request):
       
        return Response(form_a_dict(FormularioUsuario()))
    


    
    


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class Busqueda_usuariosView(ListAPIView):
    serializer_class = ResultadosPacienteSerializer
    queryset = Paciente.objects.all()

    def get_queryset(self):
        terapeuta = self.request.user.id
        queryset = Paciente.objects.all()
        campo = self.request.query_params.get("campo", None)
        termino = self.request.query_params.get("termino", None)

        if termino == "null":
            consulta = queryset.filter(terapeuta=terapeuta)

        elif campo == "cualquiera":
            consulta = queryset.filter(
            Q(terapeuta=terapeuta)
            & (
                Q(nombre__icontains=termino)
                | Q(apellidos__icontains=termino)
                | Q(motivo_consulta__icontains=termino)
                | Q(correo_electronico__icontains=termino)
            )
        )
            
        else:
            campo_dinamico = {f"{campo}__icontains": termino}
            consulta = queryset.filter(
                Q(terapeuta=terapeuta) & Q(**campo_dinamico)
            )

        return consulta
    

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class Data_tableroView(APIView):
    def get(self, request):
        terapeuta = request.user
      

        # Obtengo info próximas sesiones:
        proximas_sesiones = Sesiones.objects.filter(
            Q(terapeuta=terapeuta.id) & Q(estado="programada")
        ).order_by("fecha_programada_sesion")[:8]
        proximos_pacientes = [
            (
                {
                    "id": sesion.paciente.id,
                    "nombre": sesion.paciente.nombre,
                    "apellido": sesion.paciente.apellidos,
                    "fecha_atencion": sesion.fecha_programada_sesion.strftime("%d-%m-%Y"),
                    "hora": sesion.hora_programada.strftime("%I:%M %p"),
                }
            )
            for sesion in proximas_sesiones
        ]

        # obtengo info últimas sesiones
        ultimas_sesiones = Sesiones.objects.filter(
            Q(terapeuta=terapeuta.id) & ~Q(estado="programada")
        ).order_by("-fecha_sesion")[:8]
        ultimos_pacientes = [
            (
                {
                    "id": sesion.paciente.id,
                    "nombre": sesion.paciente.nombre,
                    "apellido": sesion.paciente.apellidos,
                    "fecha_atencion": sesion.fecha_sesion.strftime("%d-%m-%Y"),
                    "hora": sesion.hora_inicio_sesion.strftime("%I:%M %p"),
                }
            )
            for sesion in ultimas_sesiones
        ]

        # obtengo info estadísticas
        usuarios_activos = Paciente.objects.filter(
            Q(terapeuta=terapeuta.id) & Q(estado="activo")
        ).count()
        usuarios_totales = Paciente.objects.filter(terapeuta=terapeuta.id).count()
        total_sesiones = Sesiones.objects.filter(terapeuta=terapeuta.id).count()
        estadisticas = [
            {
                "terapeuta": terapeuta.username,
                "usuarios_activos": usuarios_activos,
                "usuarios_totales": usuarios_totales,
                "total_sesiones": total_sesiones,
            }
        ]
        

        # retorno respuesta respuesta
        return Response(
            {
                "proximos_pacientes": proximos_pacientes,
                "ultimos_pacientes": ultimos_pacientes,
                "estadisticas": estadisticas,
            },
            status=status.HTTP_200_OK,
        )


