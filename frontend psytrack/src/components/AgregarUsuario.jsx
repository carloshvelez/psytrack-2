import React, {useState, useEffect} from 'react'
import {Form, Typography, Divider, Button, Result} from 'antd'
import {SmileOutlined} from '@ant-design/icons'
import Campos from './campos'
import { formularioRegistroPaciente } from '../api/psicologo.api'
import { createPaciente } from '../api/psicologo.api'
import { formatearFechaYYYYMMDD } from '../utils/utils'


function AgregarUsuario() {
    const [formularioEnviado, setFormularioEnviado] = useState(false)
    
    const [form] = Form.useForm()
    function enviarFormularioRegistro(values) {
        let fecha_nacimiento = formatearFechaYYYYMMDD(values.fecha_nacimiento.$d)
        values.fecha_nacimiento = fecha_nacimiento
        async function nuevoPaciente() {
            await createPaciente(values)
            setFormularioEnviado(true)
        }
        nuevoPaciente()        
    }
    function errorAlEnviar() {
        console.log('Error al enviar')
    }

    // Hacer la consulta para recoger los datos necesarios para construir el formulario.

    const [formulario, setFormulario] = useState(null)
    
    
    

    useEffect(() => {
        async function recuperarFormulario(){
            let datosFormulario = await formularioRegistroPaciente()
            datosFormulario = datosFormulario.data
            datosFormulario = Object.values(datosFormulario)
            setFormulario(datosFormulario)
            localStorage.setItem("datosFormulario", JSON.stringify(datosFormulario))
        }

        let datosFormularioAlmacenados = localStorage.getItem("datosFormulario");
        

        if (datosFormularioAlmacenados){
            let datosFormulario = JSON.parse(datosFormularioAlmacenados)
            setFormulario(datosFormulario)
        }

        else{            
            recuperarFormulario()
        }

        
                
    }, [])

    // Renderizar mientras no se ha ejecutado la promesa:
    if (formulario === null ) {        
        
        return (
            <div className="agregar">
                <Typography.Title level={2}>Agregar un nuevo usuario del servicio</Typography.Title>
                <Divider />
                <p>Recuperando formulario</p>
            </div>
        )
    }

    // renderizar al ejecutar la promesa
    else if (formularioEnviado === false) {
        return (
            <>
                <Typography.Title level={2}>Agregar un nuevo usuario del servicio</Typography.Title>

                <Divider />
                <Typography.Title level={3} id="componente-formulario">Formulario de apertura de historia clínica:</Typography.Title>
                <Form
                    name="agregar_usuario"
                    labelCol={{
                        span: 10
                    }}
                    wrapperCol={{

                        span: 16
                    }}
                    style={{
                        maxWidth: 600
                    }}
                    initialValues={{
                        remember: true
                    }}
                    onFinish={enviarFormularioRegistro}
                    onFinishFailed={errorAlEnviar}
                    autoComplete="off">
                    {/* Despliego campos para cada uno de los campos del formulario */}

                    {formulario.map((campo) => {
                        return (
                            <Campos {...campo} />

                        )
                    })}

                    <Form.Item
                        wrapperCol={{
                            offset: 21,
                            span: 8
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Enviar
                        </Button>
                    </Form.Item>

                </Form>
            </>
        )
    } else {
        return (
            <Result
                icon={<SmileOutlined />}
                title={'Ha agregado a su usuario con éxito'}
            />
        )
    }
}

export default AgregarUsuario