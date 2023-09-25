import React from "react";
import { Button, Checkbox, Form, Input, Typography, Row, Col, Image, Space } from 'antd'
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { solicitudLogin, axios } from "../api/psicologo.api";


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

const Login = ({autenticar, autenticado}) => {
  let navigate = useNavigate()
  if (autenticado){
    navigate("/dashboard")
  }
  const [mensaje, setMensaje] = useState(false);  
  const [logueado, setLogueado] = useState(false)
  
  const onFinish = (values) => {
    let credenciales = {
      "username": values.nombre_usuario,
      "password": values.contraseña,
    }
    solicitudLogin(credenciales)
    .then((respuesta)=>{
      
      if (!respuesta.statusText==="OK"){
        throw new Error("Credenciales incorrectas")        
      }
         
      setMensaje(false)   
    
      localStorage.setItem("authToken", respuesta.data.token)  
      localStorage.setItem("csrfToken", respuesta.data.token_csrf) 
      axios.defaults.headers.common["Authorization"] = `Token ${respuesta.data.token}`
      axios.defaults.headers.common["X-CSRFToken"] =respuesta.data.token_csrf      
      
      autenticar(true)
      setLogueado(true)
      
     
    })
    .catch((error) =>{
      setMensaje("Credenciales incorrectas")
    } )   
    
    
    ;
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (logueado){
    
    return <Navigate to="/dashboard"></Navigate>
  }
  return (
    <>      
      
      <div id="titulo-login">
        <img src="../../public/images/logo.svg" id="logo"></img>
        <Typography.Title level={2}>Iniciar Sesión</Typography.Title>
      </div>

      <div id="form-login">
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 8,
          }}
          name="formulario-login"
          initialValues={{
            remember: true,
          }}
          className="login-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre de usuario"
            name="nombre_usuario"
            rules={[
              {
                required: true,
                message: "Ingrese su nombre de usuario",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="contraseña"
            rules={[
              {
                required: true,
                message: "Ingrese su contraseña",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
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
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Ingresar
            </Button>
            <Typography.Text>&nbsp;O&nbsp;</Typography.Text>
            <Typography.Link>
              <Link to="/signup">
              Registrarse
              </Link>
            </Typography.Link>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};


export default Login