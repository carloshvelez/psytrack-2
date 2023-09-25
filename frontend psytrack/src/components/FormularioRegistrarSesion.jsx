import React from 'react'
import { Form, DatePicker, TimePicker, Input, Select, Button } from 'antd'
let { Option } = Select

function FormularioRegistrarSesion(props) {
    const [form] = Form.useForm()
    form.setFieldsValue({
        estado: 'cumplida'
    })

    return (
        <Form
            name="registrar_sesion"
            labelCol={{
                span: 10
            }}
            wrapperCol={{

                span: 16
            }}
            style={{
                maxWidth: 600
            }}
            onFinish={props.manejarEnvio}
            onFinishFailed={props.manejarFalla}>
            <Form.Item name="fecha_sesion" label="Fecha en la que se realizó la sesión:" rules={[
                {
                    type: 'object',
                    required: true,
                    message: 'Por favor seleccione una fecha'
                }
            ]}
            >
                <DatePicker format="DD-MM-YYYY" placeholder="Seleccione la fecha" />
            </Form.Item>
            <Form.Item name="hora_inicio_sesion" label="Hora de inicio" rules={[{ required: true }]}>
                <TimePicker use12Hours format="h:mm a" placeholder="Hora Inicio"></TimePicker>
            </Form.Item>
            <Form.Item name="hora_fin_sesion" label="Hora de finalización" rules={[{ required: true }]}>
                <TimePicker use12Hours format="h:mm a" placeholder="Hora Fin"></TimePicker>
            </Form.Item>
            <Form.Item name="objetivo_sesion" label="Objetivos de la sesión">
                <Input.TextArea style={{ height: 50 }} placeholder="Ingrese objetivos claros y descriptivos para la sesión que va a registrar"></Input.TextArea>
            </Form.Item>
            <Form.Item name="desarrollo_sesion" label="Desarrollo de la sesión">
                <Input.TextArea style={{ height: 250 }} placeholder="Describa el desarrollo de la sesión. Asegúrese de resumir de manera clara y precisa"></Input.TextArea>
            </Form.Item>
            <Form.Item name="tareas_sesion" label="Tareas para la próxima sesión">
                <Input.TextArea style={{ height: 100 }} placeholder="Haga una lista de las tareas o ejercicios que acordó con su usuario"></Input.TextArea>
            </Form.Item>
            <Form.Item name="estado" label="Estado de la consulta" rules={[{ required: true }]}>
                <Select placeholder="Seleccione el estado de la consulta" >
                    <Option value="cumplida">Cumplida</Option>
                    <Option value="incumplida">Incumplida</Option>
                    <Option value="cancelada_paciente">Cancelada por el paciente</Option>
                    <Option value="cancelada_terapueta">Cancelada por el terapeuta</Option>
                </Select>
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 19,
                    span: 8
                }}>
                <Button
                    type="primary"
                    htmlType="submit">Registrar Sesión</Button>
            </Form.Item>
        </Form>
    )
}

export default FormularioRegistrarSesion