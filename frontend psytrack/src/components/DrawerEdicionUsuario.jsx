import React, {useEffect, useState} from 'react'
import { Button, Drawer } from 'antd'
import FormularioActualizacionUsuario from './FormularioActualizacionUsuario'

function DrawerEdicionUsuario(props) {
    const [abrir, setAbrir] = useState(false)
    function mostrarDrawer() {
      setAbrir(true)
    }
  
    function ocultarDrawer() {
      props.obtenerPaciente()
      setAbrir(false)
    }
    return (
      <>
        <Button onClick={mostrarDrawer} type="primary"> Editar usuario</Button>
        <Drawer
          placement="right"
          onClose={ocultarDrawer}
          open={abrir}
          width={'45%'}
          title="Editar el usuario actual">
          <FormularioActualizacionUsuario usuario={props.usuario} nombre={props.nombre}></FormularioActualizacionUsuario>
        </Drawer>
      </>
    )
  }

export default DrawerEdicionUsuario