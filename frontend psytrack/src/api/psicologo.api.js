import axios from 'axios'

const UrlApi = "http://127.0.0.1:8000/psicologo/"

axios.defaults.baseURL = UrlApi


const OtroSignificativoApi = "api/v1/otro_significativo"
const PacienteApi = "api/v1/paciente"
const EstadisticasApi = "api/v1/estadisticas"
const FormularioApi = "api/v1/formularios"
const BucarApi = "api/v1/busqueda"
const SesionesApi = "api/v1/sesiones"
const LoginApi = "/login"
const LogoutApi =  "/logout"
const SignupApi = "/signup"


//LLAMADAS API:
//Autenticación
export const solicitudLogin = (credenciales) => axios.post(LoginApi, credenciales)
export const solicitudLogout = ()=> axios.post(LogoutApi, "")
export const solicitudSignup = (data) => axios.post(SignupApi, data)


//Formularios: 
export const formularioActualizacionPaciente = (paciente_id) => axios.get(`${FormularioApi}/actualizacion/paciente/${paciente_id}`)
export const formularioRegistroPaciente = () => axios.get(FormularioApi + "/registro/paciente")
export const formularioRegistroProfesional = () => axios.get(FormularioApi+"/registro/profesional")

//Paciente:
export const getAllPaciente = () => axios.get(`${PacienteApi}/`)
export const getPaciente =(id_paciente) => axios.get(`${PacienteApi}/${id_paciente}/`)
export const createPaciente = (pacienteData) => axios.post(`${PacienteApi}/`, pacienteData)
export const updatePaciente = (id_paciente, pacienteData) => axios.patch(`${PacienteApi}/${id_paciente}/`, pacienteData)
export const getListaPaciente = () => axios.get(PacienteApi +"/atendidos/")
export const getResumentPaciente = (pacienteId) => axios.get(`${PacienteApi}/${pacienteId}/resumen`)
export const getPacientesActivos = () => axios.get(PacienteApi + "/activos")
export const verificarEmailPaciente = (Email) => axios.get(`${PacienteApi}/verificar_mail?correo=${Email}`)

//Sesiones:
export const getAllSesiones = (pacienteId) => axios.get(`${SesionesApi}/${pacienteId}/lista_paciente_actual`)
export const createSesiones = (sesionData) => axios.post(`${SesionesApi}/`, sesionData)
export const PatchSesiones = (paciente_id, sesionData) => axios.patch(`${SesionesApi}/${paciente_id}/`, sesionData)
export const getSesionesProgramadas = (id_usuario) => axios.get(`${SesionesApi}/${id_usuario}/lista_programadas`)
export const getSesion = (id_sesion) => axios.get(`${SesionesApi}/${id_sesion}/`)

//Varios:
//export const getAllOtroSignificativo = () => OtroSignificativoApi.options("/")
export const getEstadisticas = () => axios.get(EstadisticasApi)
export const buscarUsuario = (campo, termino) => axios.get(`${BucarApi}/?campo=${campo}&termino=${termino}`)


export {axios}

