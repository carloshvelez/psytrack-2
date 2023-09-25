import React, {useState, useEffect} from 'react'
import {Select, Input, Typography, Divider, Table } from 'antd'
import { buscarUsuario } from '../api/psicologo.api'
let { Search } = Input
let { Option } = Select




function BuscarUsuarios({ ActualizarContenido }) {
    // Configuración columnas tabla
    const columnas_tabla_busqueda = [
        { title: 'Apellido(s) / nombre', dataIndex: "apellidos_nombre", render: (text, record) => <a onClick={() => manejarClickTabla(record.id, record.apellidos_nombre)}>{text}</a>, sorter: (a, b) => a.apellidos_nombre.localeCompare(b.apellidos_nombre) },
        { title: 'Edad', dataIndex: 'edad_actual', sorter: (a, b) => a.edad_actual - b.edad_actual },
        { title: 'Teléfono celular', dataIndex: 'telefono_celular', sorter: (a, b) => a.telefono_celular - b.telefono_celular },
        { title: 'Correo electrónico', dataIndex: 'correo_electronico', sorter: (a, b) => a.correo_electronico.localeCompare(b.correo_electronico) },
        { title: 'Estado', dataIndex: 'estado', sorter: (a, b) => a.estado.localeCompare(b.estado) },
        { title: 'Motivo de consulta', dataIndex: 'motivo_consulta', sorter: (a, b) => a.motivo_consulta.localeCompare(b.motivo_consulta) }
    ]
    

    // Configuración clic tabla
    function manejarClickTabla(id, apellidosNombre) {        
        ActualizarContenido('Perfil del usuario', id, apellidosNombre)
    }

    const [campo, setCampo] = useState('cualquiera')
    const [termino, setTermino] = useState(null)
    const [data, setData] = useState(null)

    function onSelect(value) {
        setCampo(value)
    }
    function onSearch(value) {
        setTermino(value)
    }

    function onChange(event) {
        setTermino(event.target.value)
    }

    const selectAntes = (
        <Select
            defaultValue="cualquiera"
            onChange={onSelect}
        >
            <Option value="cualquiera">Cualquier campo</Option>
            <Option value="nombre">Nombre</Option>
            <Option value="apellidos">Apellido</Option>
            <Option value="motivo_consulta">Motivo de consulta</Option>
        </Select>
    )

    useEffect(() => {
        async function buscar(){
            let resultados = await buscarUsuario(campo, termino)
            resultados = resultados.data
            setData(resultados)
        }
        buscar()
    }, [campo, termino])
    
    

    if (data === null) {
        return (
            <div className="buscar">
                <Typography.Title level={2}>Buscar usuarios</Typography.Title>
                <Divider />
                <Typography.Title level={3}>Cargando...</Typography.Title>
                <Divider />
            </div>
        )
    }

    else{
        //agrego campos apellidos_nombre a la data, para que la tabla renderice así el campo.
        data.map(usuario=>{
            usuario["apellidos_nombre"] = `${usuario.apellidos} ${usuario.nombre}`
        })        
        return (

            <div className="buscar">
                <Typography.Title level={2}>Buscar Usuarios</Typography.Title>
                <Divider />
                <Search enterButton="Buscar usuario" onChange={onChange} addonBefore={selectAntes}></Search>
                <Divider />
                {data.mensaje ? <Typography.Title level={3}>{data.mensaje}</Typography.Title> : <Table columns={columnas_tabla_busqueda} dataSource={data} scroll={{ x: true }} />}
    
            </div>    
        )
        }    
}

export default BuscarUsuarios