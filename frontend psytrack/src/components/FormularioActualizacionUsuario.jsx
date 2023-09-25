import React, {useEffect, useState} from 'react'
import { SmileOutlined } from '@ant-design/icons'
import { Form, Typography, Result, Button } from 'antd'
import Campos from './campos'
import { formularioActualizacionPaciente, updatePaciente } from '../api/psicologo.api'


function FormularioActualizacionUsuario(props) {
    const [contenido, setContenido] = useState(null)
    const [cambios, setCambios] = useState(null)
    const [exito, setExito] = useState(null)

    useEffect(() => {
        async function obtenerFormulario(){
            let formulario = await formularioActualizacionPaciente(props.usuario)            
            setContenido(Object.values(formulario.data))
        }
        obtenerFormulario()        
    }, [])

    useEffect(() => {
        if (exito === true) {
          // Establecer exito en false después de un cierto período de tiempo
          const timeoutId = setTimeout(() => {
            setExito(false);
          }, 10000)
        }}, [exito, setExito])

    function manejarCambio(values) {
        setCambios({
            ...cambios,
            ...values
        })
    }

    function manejarEnvio(values) {
        if (cambios != null) {
            updatePaciente(props.usuario, cambios)
            .then(()=>{
                setExito(true)
            } )           
        }
    }
    if (contenido === null) {
        return (<Typography.Title level={3}>Cargando</Typography.Title>)
    } else if (exito === true) {        
        return (                        
            <Result
                icon={<SmileOutlined />}
                title={'Hemos Actualizado la información del usuario. Después de 10 segundos podrá editar nuevamente la información, si así lo desea.'}
                
            />
            
        )
    } else {
        const valoresIniciales = {}
        contenido.forEach((campo) => {
            valoresIniciales[`${campo.nombre}`] = typeof campo.valor === 'string' ? campo.valor.charAt(0).toUpperCase() + campo.valor.slice(1) : campo.valor // Capitaliza si el campo es cadena de texto, de lo contrario lo deja tal como está
        })
        valoresIniciales.estrato = String(valoresIniciales.estrato) // convierto estrato a string para que el formulario lo tome como opción válida.

        return (
            <>
                <Typography.Title>Formulario de edición de {props.nombre}</Typography.Title>
                <Typography.Paragraph>Recuerde que no todos los cambios pueden ser actualizados en la historia clínica.</Typography.Paragraph>

                <Form
                    name="actualizar_usuario"

                    onValuesChange={manejarCambio}
                    onFinish={manejarEnvio}
                    labelCol={{
                        span: 10
                    }}
                    wrapperCol={{

                        span: 16
                    }}
                    style={{
                        maxWidth: 600
                    }}
                    initialValues={{ ...valoresIniciales }}

                    autoComplete="off">
                    {/* Despliego campos para cada uno de los campos del formulario */}

                    {contenido.map((campo) => {
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
    }
}

export default FormularioActualizacionUsuario