import { Button, Checkbox, Form, Input, Tooltip, Typography, Modal } from "antd";
import { useState, useEffect } from "react";
import { formularioRegistroProfesional, solicitudSignup  } from "../api/psicologo.api";
import { Link, useNavigate, Navigate } from "react-router-dom"
//Función para obtener el token CSRF

async function obtenerCsrfToken() {
  try {
    const respuesta = await fetch("../csrf");
    if (!respuesta.ok) {
      throw new Error("Solicitud no exitosa");
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
import React from 'react'




function Signup({autenticado}) {
  let navigate = useNavigate()
  
  if (autenticado){
    
    navigate("/dashboard")
  }

  let [campos, setCampos] = useState(null);
  let [modalAbierto, setModalAbierto] = useState(false);
  let [mensaje, setMensaje] = useState(null)
  
  //Recuperar formulario y guardar en el estado
  useEffect(() => {
    async function obtenerCuestionario(){
      let formulario = await formularioRegistroProfesional()
      let campos = Object.values(formulario.data)
   
      setCampos(campos)
    }
    obtenerCuestionario()
    
  }, []);

  if (campos === null) {
    return <>Cargando formulario</>;
  }

  //renderizar formulario y establecer lógica de envío
  else {
    const manejarOk = () => {
      navigate("/login")      
    };

    const manejarCancel = () => {
      setModalAbierto(false);
    };

    const onFinish = (values) => {
      
      solicitudSignup(values)
      .then((respuesta)=>{
        
        if (!respuesta.status === 201){
          throw new Error("No se pudo registrar")
        }
        setModalAbierto(true)
      })
      .catch((error)=>{
        let feedback = "No se puedo crear el usuario. Intente con otras credenciales, pues probablemente ya está registrado"
        onFinishFailed(feedback)
        setMensaje(feedback)
      })
      
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return (
      <>
      
      <div id="titulo-login">
        <img src="../../public/images/logo.svg" id="logo-registro"></img>
        <Typography.Title level={2} id="titulo-registro">
          Regístrese como profesional
        </Typography.Title>
      </div>
        <Form
          name="formulario-registro"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 8,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {campos.map((campo) => {
            return (
              <Form.Item
                key={campo.nombre}
                name={campo.nombre}
                messageVariables={{ another: "good" }}
                label={campo.etiqueta}
                dependencies={campo.nombre === "password_confirm" ? ["password"] : []}
                rules={[
                  {
                    required: campo.requerido,
                    message: `Debes diligenciar ${campo.etiqueta}`,
                  },
                  {
                    type: campo.tipo_campo,
                  },
                  {
                    min: 4,
                    message: `${campo.etiqueta} debe tener al menos 3 caracteres`,
                    validateStatus: "warning",
                  },
                  {
                    max: 48,
                  },
                  campo.nombre === "password"
                    ? {
                        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z]).+$",
                        message: `${campo.etiqueta} debe contener letras y números`,
                      }
                    : {},
                  campo.nombre === "password_confirm"
                    ? ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {                           
                            return Promise.resolve();
                          } else {
                            value === getFieldValue("password");
                            return Promise.reject(
                              new Error("Las contraseñas no coinciden")
                            );
                          }
                        },
                      })
                    : null,
                ]}
              >
                {campo.tipo_campo === "PasswordInput" ? (
                  <Input.Password></Input.Password>
                ) : (
                  <Input></Input>
                )}
              </Form.Item>
            );
          })}
          {mensaje && (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Typography.Text type="danger">
                {mensaje}
              </Typography.Text>
            </Form.Item>
          )}
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            
            <Button type="primary" htmlType="submit">
              Registrarse
            </Button>
            <Typography.Text>&nbsp;O&nbsp;</Typography.Text>
            <Link to="/login">
            <Typography.Link >
              Ingresar
            </Typography.Link>
            </Link>
          </Form.Item>
        </Form>
        <Modal
          title="El registro se ha completado"
          open={modalAbierto}
          onOk={manejarOk}
          onCancel={manejarCancel}
          okText="Ir a iniciar sesión"
          cancelText="Cancelar"
        >
          <Typography.Paragraph>
            Hemos creado su usuario como profesional, ahora puede iniciar
            sesión.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Presione "Ir a iniciar sesión" para ir a la página de inicio de
            sesión.
          </Typography.Paragraph>
        </Modal>
      </>
    );
  }
}

function App() {
  return (
    <>
      
      <FormularioRegistro />
    </>
  );
}

export default Signup