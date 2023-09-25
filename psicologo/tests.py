from django.test import TestCase, Client
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from .models import Paciente, Usuario, Sesiones, Otro_significativo
import psicologo.datos_ficticios as datos_ficticios

# Create your tests here.

class PacienteTestCase(TestCase):
    
    def setUp(self):

        #crear terapeuta:
        t1 = Usuario.objects.create(**datos_ficticios.usuario)
        
        #crear otro significativo: 
        o1 = Otro_significativo.objects.create(**datos_ficticios.otro_significativo)

        #crear paciente:
        datos_paciente = datos_ficticios.paciente
        datos_paciente["terapeuta"] = t1        
        p1 = Paciente.objects.create(**datos_paciente)
        p1.personas_convive.add(o1)
        p1.contacto_emergencia.add(o1)

        
        #crear sesión programada:
        datos_sesion1 = datos_ficticios.sesion_programada
        datos_sesion1["terapeuta"]=t1
        datos_sesion1["paciente"]=p1
        s1 = Sesiones.objects.create(**datos_sesion1)

        #crear sesión atendida:
        datos_sesion2 = datos_ficticios.sesion_atendida
        datos_sesion2["terapeuta"]=t1
        datos_sesion2["paciente"]=p1
        s2 = Sesiones.objects.create(**datos_sesion2)

        self.token = Token.objects.create(user=Usuario.objects.get(pk=1))

        


    def test_paciente_guardado(self):
        p = Paciente.objects.get(pk=1)
        self.assertTrue(p)

    def test_get_todos_paciente(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        respuesta = c.get("/psicologo/api/v1/paciente/")
        self.assertEqual(respuesta.status_code, 200)     
               
    def test_get_paciente(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        respuesta = c.get("/psicologo/api/v1/paciente/1/")
        self.assertEqual(respuesta.status_code, 200)

    def test_get_pacientes_atentidos(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        respuesta = c.get("/psicologo/api/v1/paciente/atendidos/")
        self.assertEqual(respuesta.status_code, 200)

    def test_get_pacientes_activos(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        respuesta = c.get("/psicologo/api/v1/paciente/activos/")
        self.assertEqual(respuesta.status_code, 200)

    def test_get_pacientes_resumen(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        respuesta = c.get("/psicologo/api/v1/paciente/1/resumen/")        
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(len(respuesta.json()), 6)

    def test_actualizar_paciente(self):
        nuevos_datos = {
            "apellidos": "Alvarez",
            "numero_id": "4544566",
            "nombre": "Alveiro",
            "ocupacion": "Plomero",
            "sexo": "hombre",
            "estado": "suspendido"
        }
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        respuesta = c.patch("/psicologo/api/v1/paciente/1/", nuevos_datos, format="json")
        self.assertEqual(respuesta.status_code, 200)



    
    
    



