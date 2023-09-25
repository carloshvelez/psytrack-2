import React from 'react'
import { Form, TimePicker, Space, DatePicker, Button } from 'antd'

function FormularioProgramarSesion(props) {
    return (
        <Form
            title="Agregar sesion"
            name="agregar_sesion"
            labelCol={{
                span: 24
            }}
            wrapperCol={{

                span: 24
            }}
            onFinish={props.manejarEnvio}
            onFinishFailed={props.manejarFalla}
            autoComplete="off">
            <Space wrap>
                <Form.Item
                    name="fecha"
                    label="Fecha de la siguiente sesión:"
                    rules={[
                        {
                            type: 'object',
                            required: true,
                            message: 'Por favor seleccione una fecha'
                        }
                    ]}
                >
                    <DatePicker format="DD-MM-YYYY" placeholder="Seleccione la fecha" />
                </Form.Item>
                <Form.Item
                    name="hora"
                    label="Hora programada de sesión es:"
                    rules={[
                        {
                            type: 'object',
                            required: true,
                            message: 'Por favor seleccione una hora'
                        }
                    ]}
                >
                    <TimePicker use12Hours format="h:mm a" placeholder="Seleccione la hora" />
                </Form.Item>
            </Space>

            <Form.Item >
                <Button type="primary" htmlType="submit">
                    Programar sesión
                </Button>
            </Form.Item>

        </Form>
    )
}

export default FormularioProgramarSesion