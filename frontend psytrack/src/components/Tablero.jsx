import React, {useState, useEffect} from 'react'
import {Typography, Divider, Row, Col} from 'antd'
import Lista from './Lista'
import HeaderTablero from './HeaderTablero'
import { getEstadisticas } from '../api/psicologo.api'



function Tablero({ ActualizarContenido }) {
    const [resultado, setResultado] = useState(null)
    useEffect(() => {
        async function  getDataTablero(){
            let data = await getEstadisticas()             
            setResultado(data.data)            
        }
        getDataTablero()
    }, [])

    if (resultado === null) {
        return (<div><div><Typography.Title level={3}>Descargando información</Typography.Title></div></div>)
    } else {
        const proximos_pacientes = resultado.proximos_pacientes
        const ultimos_pacientes = resultado.ultimos_pacientes
        const estadisticas = resultado.estadisticas
        //const terapeuta = resultado.terapeuta
        return (<div className="tablero">
            <Typography.Title level={2}>Tablero</Typography.Title>

            <Divider></Divider>
            <HeaderTablero {...estadisticas[0]}></HeaderTablero>

            <Row>
                <Col sm={24} md={11}>
                    <Typography.Title level={3}>Próximos usuarios</Typography.Title>
                    <Lista data={proximos_pacientes} ActualizarContenido={ActualizarContenido}></Lista>
                </Col>
                <Col sm={24} md={2}>
                </Col>
                <Col sm={24} md={11}>
                    <Typography.Title level={3}>Usuarios recientemente atendidos</Typography.Title>
                    <Lista data={ultimos_pacientes} ActualizarContenido={ActualizarContenido}></Lista>
                </Col>
            </Row>
        </div>)
    }
}

export default Tablero