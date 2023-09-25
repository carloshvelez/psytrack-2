import React, {useState, useEffect} from 'react'
import { Typography, Result, Space, Divider,  } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import FormularioProgramarSesion from './FormularioProgramarSesion'
import DescribirUsuario from './DescribirUsuario';
import SelectUsuario from './SelectUsuario';
import { createSesiones, getResumentPaciente, getListaPaciente } from '../api/psicologo.api'
import { formatearFechaYYYYMMDD, formatearHoraHHMM, mostrarFechaHora } from '../utils/utils';

const ZonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone



function ProgramarSesion() {
    const [usuarioActual, setUsuarioActual] = useState(null)
    const [idUsuarioActual, setIdUsuarioActual] = useState(null)
    const [usuariosActivos, setUsuariosActivos] = useState(null)
    const [sesionProgramada, setSesionProgramada] = useState(false)
    const [fechaProgramada, setFechaProgramada] = useState(null)
    const [horaProgramada, setHoraProgramada] = useState(null)

    // Función para el manejo del cambio en el selecionador
    const manejarCambio = (value) => {
        const usuario = value
        setIdUsuarioActual(usuario)
        getResumentPaciente(usuario)
        .then(respuesta => setUsuarioActual(respuesta.data))       
    }

    // Función para manejar el envio:
    function enviarFormularioNuevaSesion(values) {
        setFechaProgramada(values.fecha.$d)
        setHoraProgramada(values.hora.$d)
        let dataProgramacion = {
            "fecha_programada_sesion": formatearFechaYYYYMMDD(values.fecha.$d),
            "hora_programada": formatearHoraHHMM(values.hora.$d),
            "paciente": idUsuarioActual,
            "zona_horaria": ZonaHoraria
        }
        createSesiones(dataProgramacion)
        .then(resultado => setSesionProgramada(true))
    };

    function fallaFormularioNuevaSesion(value) {
        console.log('Falló', value)
    }

    // Consulta de usuarios activos
    useEffect(() => {
        async function obtenerLista(){
            let lista = await getListaPaciente()
            setUsuariosActivos(lista.data)
        }
        obtenerLista()
        
    }, [])

    if (usuariosActivos === null) {
        return <Typography.Title level={2}>Cargando...</Typography.Title>
    } else if (sesionProgramada === true) {
        return (
            <Result
                icon={<SmileOutlined />}
                title={`Hemos programado la sesión de ${usuarioActual.Nombre} ${usuarioActual.Apellidos} para el ${mostrarFechaHora(fechaProgramada, 'fecha')} a las ${mostrarFechaHora(horaProgramada, 'hora')}.`}
            />
        )
    } else {
       
        return (
            <div className="registrarSesion">
                <Typography.Title level={2}>Programar sesión</Typography.Title>
                <Typography.Paragraph>Recuerde que para programar una sesión, el usuario debe tener el servicio activo</Typography.Paragraph>
                <Typography.Paragraph>Va a programar sesión para el usuario:</Typography.Paragraph>

                <Space direction="vertical" className="componente-centrado">

                    <SelectUsuario opciones={usuariosActivos} manejarCambio={manejarCambio} style={{ marginBottom: '25px' }} id="componente-select" />
                    <Divider />
                    {usuarioActual && <DescribirUsuario titulo={'Usuario:'} usuario={usuarioActual} />}

                    <Divider />

                    {usuarioActual
                        ? <div>
                            <Typography.Title level={3} id="titulo-programar-sesion">A continuación, elija hora y fecha de la siguiente sesión:</Typography.Title>

                            <FormularioProgramarSesion manejarEnvio={enviarFormularioNuevaSesion} manejarFalla={fallaFormularioNuevaSesion} /> </div>
                        : ''}
                </Space>

            </div>

        )
    }
}

export default ProgramarSesion