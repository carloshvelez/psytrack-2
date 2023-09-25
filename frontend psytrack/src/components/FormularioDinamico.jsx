import React from 'react'
import {Form, Input, Button} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'


function FormularioDinamico(props) {
    return (
        <Form.List name={props.nombre_campo} style={{ marginTop: 35 }}>
            {(fields, { add, remove }) => (
                <>
                    {/* Renderizamos los campos dinámicos */}
                    {fields.map(({ key, name, ...restField }) => (
                        <Form.Item
                            key={key}
                        >
                            <Form.Item
                                {...restField}
                                name={[name, 'nombre']}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingrese el nombre'
                                    }
                                ]}
                                noStyle
                            >
                                <Input type="string" placeholder="Nombres y apellidos" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'edad']}

                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingrese la edad'
                                    }
                                ]}
                                noStyle
                            >

                                <Input type="number" placeholder="Edad" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'ocupacion']}

                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingrese la ocupación'
                                    }
                                ]}
                                noStyle
                            >

                                <Input type="string" placeholder="Ocupación" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'parentesco']}

                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingrese el parentesco'
                                    }
                                ]}
                                noStyle
                            >

                                <Input type="string" placeholder="parentesco" />
                            </Form.Item>

                            {/* Botón para eliminar campos */}
                            {fields.length > 1
                                ? (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(name)}
                                    > </MinusCircleOutlined>
                                )
                                : null}
                        </Form.Item>
                    ))}
                    {/* Botón para agregar nuevos campos */}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                        >
                            {`Agregar ${props.etiqueta}`}
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    )
}

export default FormularioDinamico