import React from 'react'
import { Descriptions, Space } from 'antd'

function DescribirUsuario(props) {
    let id = 1
    const lista = []
    for (const [clave, valor] of Object.entries(props.usuario)) {
        const infoItem = {
            key: id.toString(),
            label: clave,
            children: valor,
            span: 1.5
        }
        lista.push(infoItem)
        id++
    }

    const defaultColumns = 2

    if (props.vertical === true) {
        return (
            <Space wrap>
                <Descriptions title={props.titulo} items={lista} bordered column={1} />
            </Space>

        )
    }

    return (
        <Space wrap>
            <Descriptions title={props.titulo} items={lista} column={props.column || defaultColumns} />
        </Space>

    )
}

export default DescribirUsuario