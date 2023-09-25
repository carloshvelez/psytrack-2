import React from 'react'
import { Typography, Layout } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { solicitudLogout, axios } from '../api/psicologo.api'


let {Header} = Layout



function BarraSuperior( {autenticar, autenticado} ) {
  
  let location = useLocation();

  function salir() {
    solicitudLogout()    
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];   
    delete axios.defaults.headers.common["X-CSRFToken"] 
    autenticar(false)          
    }
    
   
  return (
    <>
    <Header
                
                style={{
                    backgroundColor: '#00474f',
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: 'wrap'
                }}
            >
                <Typography.Title style={{ color: 'white' }} level={3}>PSYTRACK</Typography.Title>

                {autenticado ? <Link to="/" id="login-link" onClick={salir}>Salir <span> &nbsp;</span> <LogoutOutlined /></Link>:
                location.pathname === "/login" || location.pathname ==="/"?
                <Link to="/signup" id="login-link" >Registrarse <span> &nbsp;</span> </Link>:
                <Link to="/login" id="login-link" >Iniciar sesión <span> &nbsp;</span> </Link>}
                
            </Header>

            <Outlet></Outlet>
    
    </>
    
  )
}

export default BarraSuperior

