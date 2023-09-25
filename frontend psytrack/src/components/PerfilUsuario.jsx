import React, {useState, useEffect} from 'react'
import { Result, List, Typography, Divider, Button } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import DrawerEdicionUsuario from './DrawerEdicionUsuario'
import DescribirSesiones from './DescribirSesiones'
import { getPaciente, getAllSesiones } from '../api/psicologo.api'


function PerfilUsuario({ idUsuario, ActualizarContenido, VolverABusqueda }) {
    if (idUsuario === null) {
        return (
            <Result
                status="404"
                title="No ha seleccionado usuarios"
                subTitle="Seleccione un usuario desde el módulo de búsqueda"
            />
        )
    }

    const [perfilUsuario, setPerfilUsuario] = useState(null)
    const [perfilSesiones, setPerfilSesiones] = useState(null)

    async function obtenerPaciente(){
            
        let sesiones = await getAllSesiones(idUsuario)
        setPerfilSesiones(sesiones.data)
        let perfil = await getPaciente(idUsuario)
        setPerfilUsuario(perfil.data)
    }  

    useEffect(() => {
        
            
        obtenerPaciente()  
        
    }, [])

    if (perfilUsuario === null) {
        return (
            <Result
                status="404"
                title="No ha seleccionado usuarios"
                subTitle="Seleccione un usuario desde el módulo de búsqueda"
            />
        )
    } else {
        //Convierto el perfil de usuario en una lista para que me renderice la lista
        let dataArray = Object.keys(perfilUsuario).map((key)=>({
            titulo: key,
            valor: perfilUsuario[key]
        }))       
        return (
            <>

                <List
                    split={false}
                    size="small"
                    dataSource={dataArray}
                    header={<Typography.Title>{`Perfil de ${dataArray[2].valor} ${dataArray[3].valor}`}</Typography.Title>}
                    footer={<DrawerEdicionUsuario obtenerPaciente={obtenerPaciente} usuario={idUsuario} nombre={`${dataArray[2].valor} ${dataArray[3].valor}`} />}
                    itemLayout="horizontal"
                    grid={{
                        gutter: 16,
                        column: 2
                    }}
                    renderItem={(item, index) => (

                        <List.Item><List.Item.Meta title={item.titulo} description={item.valor} /> </List.Item>
                    )}>
                </List>
                <Divider />
                <Typography.Title level={3}>Notas de sesión registradas en la historia clínica:</Typography.Title>
                <DescribirSesiones sesiones={perfilSesiones}></DescribirSesiones>
                <Divider />
                <Button type="primary" onClick={() => VolverABusqueda()}><RollbackOutlined />Volver al módulo de búsqueda</Button>
            </>

        )
    }
}

export default PerfilUsuario