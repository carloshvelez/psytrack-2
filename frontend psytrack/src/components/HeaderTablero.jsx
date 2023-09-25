import React from 'react'
import {Statistic, Typography, Avatar} from 'antd'

function HeaderTablero(props) {
    return (
        <div id="primera-linea-tablero">
            <div
                id="terapeuta-tablero" >
                <Avatar shape="square" size={50} style={{ backgroundColor: '#3994a8' }}>CV </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: "25px" }}>
                    <Typography.Paragraph strong style={{ margin: '0' }}>Hola</Typography.Paragraph>
                    <Typography.Paragraph id="logueado-como">Estás logueado como <strong>{props.terapeuta}</strong></Typography.Paragraph>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <Statistic title="Usuarios activos" value={props.usuarios_activos} valueStyle={{ textAlign: 'right' }} />
                <Statistic title="Usuarios totales" value={props.usuarios_totales} valueStyle={{ textAlign: 'right' }} />
                <Statistic title="Total sesiones" value={props.total_sesiones} valueStyle={{ textAlign: 'right' }} />
            </div>
        </div>
    )
}

export default HeaderTablero