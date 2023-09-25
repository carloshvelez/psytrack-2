from rest_framework import serializers, routers, viewsets
from .models import Usuario, Paciente, Otro_significativo, Sesiones
from datetime import date
from . import adds






class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["first_name",
            "last_name",
            "username",
            "email",
            "password",
            "password_confirm"            
            ]
        extra_kwargs = {
        'password': {
            'write_only': True 
        },
        'password_confirm': {
            'write_only': True  
        }
    }

        
    def validate(self, data):
        password = data.get("password")
        password_confirm = data.get("password_confirm")
        if password != password_confirm:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data
    
    def create(self, validated_data):
        user = Usuario(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class PacienteResumenSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Paciente
        fields = ["apellidos", "nombre", "edad_actual", "telefono_celular", "correo_electronico"]

        def validate(self, data):
            data = adds.mapear_opciones_respuesta(data)                
            return data

        def create(self, validated_data, request):
            terapeuta = Usuario.objects.get(pk=4)##request.user
            validated_data["terapeuta"]= terapeuta
            contacto_emergencia = validated_data["contacto_emergencia"]
            personas_convive = validated_data["personas_convive"]
            lista_personas_convive = [
                Otro_significativo.objects.get_or_create(**persona)[0]
                for persona in personas_convive
            ]
            lista_contacto_emergencia = [
                Otro_significativo.objects.get_or_create(**persona)[0]
                for persona in contacto_emergencia
            ]
            datos_nuevo_paciente = {clave:valor 
                                   for clave, valor in validated_data.items()
                                   if clave not in ["contacto_emergencia", "personas_convive"]}

            nuevo_paciente = Paciente(**datos_nuevo_paciente)
            nuevo_paciente.save()
            nuevo_paciente.personas_convive.set(lista_personas_convive)
            nuevo_paciente.contacto_emergencia.set(lista_contacto_emergencia)
        




class Otro_significativoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Otro_significativo
        fields = "__all__"

class ResultadosPacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ["apellidos", "nombre", "edad_actual", "telefono_celular", "correo_electronico", "motivo_consulta", "estado", "id"]

   

class PacienteSerializer(serializers.ModelSerializer):
    personas_convive = Otro_significativoSerializer(many=True)
    contacto_emergencia = Otro_significativoSerializer(many=True)

    class Meta:
        model = Paciente
        exclude = ("terapeuta",)

    def create(self, validated_data):
     
        personas_convive_data = validated_data.pop("personas_convive")
        contactos_emergencia_data = validated_data.pop("contacto_emergencia")
        ##validated_data = adds.mapear_opciones_respuesta(validated_data)
        terapeuta = Usuario.objects.get(pk=4) #request.user
        validated_data["terapeuta"] = terapeuta
        paciente = Paciente.objects.create(**validated_data)

        for persona_convive_data in personas_convive_data:
            persona_convive, creado = Otro_significativo.objects.get_or_create(
                **persona_convive_data
            )
            paciente.personas_convive.add(persona_convive)
        for contacto_emergencia_data in contactos_emergencia_data:
            contacto_emergencia, creado = Otro_significativo.objects.get_or_create(
                **contacto_emergencia_data
            )
            paciente.contacto_emergencia.add(contacto_emergencia)
        return paciente


class SesionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesiones
        fields = "__all__"
