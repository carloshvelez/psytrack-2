import React from 'react'
import { Avatar, List, Typography } from 'antd'

function colorAleatorio() {
    const listaColores = ['#00474f', '#006d75', '#08979c', '#ffa94d', '#b37feb',
      '#6ab04c', '#f783ac', '#6d6d6d', '#fdbb2d', '#3ea6ff']
    const indiceAleatorio = Math.floor(Math.random() * listaColores.length + 1)
    return listaColores[indiceAleatorio]
  }

function Lista(props) {
    function manejarClick(idUsuario, apellidosNombre) {
        props.ActualizarContenido('Perfil del usuario', idUsuario, apellidosNombre)
    }
    return (
        <List
            itemLayout="horizontal"
            dataSource={props.data}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: colorAleatorio() }}>{item.nombre[0]}{item.apellido[0]} </Avatar>}
                        title={<Typography.Link onClick={() => manejarClick(item.id, `${item.apellido} ${item.nombre}`)} >{item.nombre} {item.apellido} </Typography.Link>}
                        description={`Atención el ${item.fecha_atencion}, a las ${item.hora}`}
                    />
                </List.Item>
            )}
        />
    )
}

export default Lista