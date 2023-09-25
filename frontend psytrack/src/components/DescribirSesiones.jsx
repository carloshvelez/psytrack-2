import React from 'react'
import DescribirUsuario from './DescribirUsuario'
import { Collapse, Typography } from 'antd'

function DescribirSesiones({ sesiones }) {
    if (sesiones.length === 0) {
      return (<Typography.Paragraph type="secondary">Usted aún no ha registrado ninguna sesión para este usuario </Typography.Paragraph>)
    }
  
    let contador = 0
    const items = []
    sesiones.map((sesion) => {
      contador++
      const element = {}
      element.key = contador
      element.label = `Sesión ${contador} (${sesion.Fecha}). Estado: ${sesion['Estado actual']}`
      element.children = <DescribirUsuario usuario={sesion} column={1} vertical={false}></DescribirUsuario>
      items.push(element)
    })
  
    return (
  
      <Collapse items={items} />
    )
  }

export default DescribirSesiones