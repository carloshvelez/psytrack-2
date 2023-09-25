import React, { useEffect, useState } from 'react'
import { SmileOutlined } from "@ant-design/icons"
import { Typography, Result, Divider, Space, } from "antd"
import DescribirUsuario from './DescribirUsuario'
import SelectUsuario from './SelectUsuario'
import FormularioRegistrarSesion from './FormularioRegistrarSesion'
import { PatchSesiones, getSesionesProgramadas, getSesion, getPacientesActivos } from '../api/psicologo.api'
import { formatearFechaYYYYMMDD, formatearHoraHHMM } from '../utils/utils'
const ZonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone


function RegistrarSesion() {
    const [usuariosActivos, setUsuariosActivos] = useState(null)
    const [usuarioActual, setUsuarioActual] = useState(null)
    const [idUsuarioActual, setIdUsuarioActual] = useState(null)
    const [idSesionElegida, setIdSesionElegida] = useState(null)
    const [infoSesionElegida, setInfoSesionElegida] = useState(null)
    const [infoSesionProgramada, setInfoSesionProgramada] = useState(null)
    const [sesionesProgramadas, setSesionesProgramadas] = useState(null)
    const [guardadoExitoso, setGuardadoExitoso] = useState(false)




    function manejarEnvio(values) {
        setInfoSesionProgramada(values)
        let dataSesion = {
            zona_horaria: ZonaHoraria,
            ...values,
            sesion_id: idSesionElegida
        }
        dataSesion.fecha_sesion = formatearFechaYYYYMMDD(dataSesion.fecha_sesion.$d)
        dataSesion.hora_fin_sesion = formatearHoraHHMM(dataSesion.hora_fin_sesion.$d)
        dataSesion.hora_inicio_sesion = formatearHoraHHMM(dataSesion.hora_inicio_sesion.$d)

        console.log(dataSesion)
        PatchSesiones(idSesionElegida, dataSesion)
            .then(resultado => setGuardadoExitoso(true))
    }

    const manejarFalla = (values) => {

    }

    const manejarCambioUsuario = (value) => {
        const usuario = value
        setIdUsuarioActual(usuario)
        getSesionesProgramadas(usuario)
            .then(respuesta => setSesionesProgramadas(respuesta.data))
    }

    const manejarCambioSesion = (value) => {
        const idSesion = value
        setIdSesionElegida(idSesion)
        getSesion(idSesion)
            .then(respuesta => setInfoSesionElegida(respuesta.data))
    }

    useEffect(() => {
        async function obtener_lista() {
            let lista = await getPacientesActivos()
            setUsuariosActivos(lista.data)
        }
        obtener_lista()
    }, [])

    if (usuariosActivos === null) {
        return <Typography.Title level={2}>Cargando...</Typography.Title>
    } else if (guardadoExitoso === true) {
        return (
            <Result
                icon={<SmileOutlined />}
                title={`Hemos registrado la sesión de ${infoSesionElegida['Usuario del servicio']}, con estado ${infoSesionProgramada.estado} `}
            />
        )
    } else {
        return (
            <>
                <Typography.Title level={2}>Registrar una nueva sesión</Typography.Title>
                <Typography.Paragraph>Por favor seleccione un usuario y luego una sesión programada; posteriormente registre el desarrollo de la sesión</Typography.Paragraph>
                <Typography.Paragraph type="danger">Recuerde que si no ha programado una sesión, no podrá registrarla en este modulo</Typography.Paragraph>
                <Space direction="vertical">
                    <Space>
                        <Typography.Text>Usuario:</Typography.Text><SelectUsuario opciones={usuariosActivos} manejarCambio={manejarCambioUsuario} style={{ marginBottom: '25px' }} />
                    </Space>
                    {sesionesProgramadas && <Space>
                        <Typography.Text>Fecha y hora programadas:</Typography.Text><SelectUsuario opciones={sesionesProgramadas} manejarCambio={manejarCambioSesion}></SelectUsuario>
                    </Space>}
                </Space>
                {infoSesionElegida
                    ? <>
                        <Divider />
                        <DescribirUsuario usuario={infoSesionElegida} />
                        <Divider />
                        <FormularioRegistrarSesion manejarEnvio={manejarEnvio} manejarFalla={manejarFalla} />
                    </>
                    : null}
            </>
        )
    }
};

export default RegistrarSesion