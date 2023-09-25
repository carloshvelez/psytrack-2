import React, { useState } from 'react'
import { Layout, Typography, Breadcrumb, Menu, theme} from 'antd';
let { Header, Content, Footer, Sider } = Layout
import { LogoutOutlined, FundOutlined, UserOutlined, ProfileOutlined } from '@ant-design/icons';
import { axios } from '../api/psicologo.api';
import Tablero from '../components/Tablero';
import PerfilUsuario from '../components/PerfilUsuario';
import BuscarUsuarios from '../components/BuscarUsuarios';
import AgregarUsuario from '../components/AgregarUsuario';
import RegistrarSesion from '../components/RegistrarSesion';
import ProgramarSesion from '../components/ProgramarSesion';
 



const items_barra_principal = [
    { key: 'Tablero', icon: React.createElement(FundOutlined), label: 'Tablero' },
    { key: 'Usuarios', icon: React.createElement(UserOutlined), label: 'Usuarios', children: [{ key: 'Buscar', label: 'Buscar' }, { key: 'Perfil del usuario', label: 'Perfil del usuario' }, { key: 'Agregar usuario', label: 'Agregar usuario' }] },
    { key: 'Sesiones', icon: React.createElement(ProfileOutlined), label: 'Sesiones', children: [{ key: 'Programar sesion', label: 'Programar sesion' }, { key: 'Registrar', label: 'Registrar sesión' }] }

]

function salir() {
    fetch('logout/')
      .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error('Se presentó un error con el deslogueo')
        }
        console.log('Se cerró la sesión')
        window.location.href = '/'
      })
      .catch()
  }


function Dashboard( {autenticado} ) {
    axios.defaults.headers.common["Authorization"] = `Token ${localStorage.getItem("authToken")}` 
    axios.defaults.headers.common["X-CSRFToken"] = localStorage.getItem("csrfToken")
    
    const [idUsuario, setIdUsuario] = useState(null);
    const [contenido, setContenido] = useState('Tablero');
    const [ruta, setRuta] = useState(['Tablero']);
    const [colapsado, setColpasado] = useState(false);

    function ActualizarContenido(contenido, idUsuario, nombreUsuario) {
        setContenido(contenido)
        setRuta([nombreUsuario, 'Perfil del usuario', 'Usuarios'])
        console.log("Se ejecutó", idUsuario)
        setIdUsuario(idUsuario)
        console.log(idUsuario)
    }

    function ActualizarIdUsuario(id) {
        setIdUsuario(id)
    }

    function VolverABusqueda() {
        setContenido('Buscar')
    }

    function handleMenuItemClick({ item, key, keyPath, domEvent, selectedMenuItem }) {
        setContenido(key)
        setRuta(keyPath)
    }

    const {
        token: { colorBgContainer }
    } = theme.useToken()



    const toggleCollapsed = () => {
        setColpasado(!colapsado)
    };


    return (
        <Layout>
            
            <Content
                style={{
                    padding: '0 50px'
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0'
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    {ruta[2] && <Breadcrumb.Item>{ruta[2]}</Breadcrumb.Item>}
                    <Breadcrumb.Item>{ruta[1]}</Breadcrumb.Item>
                    <Breadcrumb.Item>{ruta[0]}</Breadcrumb.Item>
                </Breadcrumb>
                <Layout
                    style={{
                        padding: '24px 0',
                        background: colorBgContainer
                    }}
                >
                    <Sider
                        collapsible
                        collapsed={colapsado}
                        breakpoint="sm" // Define el punto de quiebre en "sm"
                        onBreakpoint={(broken) => {
                            if (broken) {
                                setColpasado(true);
                            }
                        }}
                        onCollapse={toggleCollapsed}
                        style={{
                            background: colorBgContainer
                        }}
                        width={200}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['sub1']}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={contenido}
                            style={{
                                height: '100%'
                            }}
                            items={items_barra_principal}
                            onClick={handleMenuItemClick}
                        />

                    </Sider>
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280
                        }}
                    >
                        {contenido === 'Tablero' && <Tablero ActualizarContenido={ActualizarContenido} />}
                        {contenido === 'Perfil del usuario' && <PerfilUsuario idUsuario={idUsuario} ActualizarContenido={ActualizarContenido} VolverABusqueda={VolverABusqueda} />}
                        {contenido === 'Buscar' && <BuscarUsuarios ActualizarContenido={ActualizarContenido} />}
                        {contenido === 'Agregar usuario' && <AgregarUsuario />}
                        {contenido === 'Registrar' && <RegistrarSesion />}
                        {contenido === 'Programar sesion' && <ProgramarSesion />}

                    </Content>
                </Layout>
            </Content>
            <Footer
                style={{
                    textAlign: 'center'
                }}
            >
                <Typography.Paragraph> © Carlos Humberto Vélez Ocampo - 2023</Typography.Paragraph>
                <Typography.Paragraph> CS50 Web programming with Python and Javascript</Typography.Paragraph>
            </Footer>
        </Layout>
    )
}

export default Dashboard