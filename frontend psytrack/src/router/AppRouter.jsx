import { Route, Router, Routes } from "react-router-dom";
import BarraSuperior from "../components/BarraSuperior";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Signup from "../pages/Signup";
import RutaPrivada from "../components/RutaPrivada"
import { useEffect, useState } from "react";
import React from 'react'


const AppRouter = () => {
  const [autenticado, setAutenticado] = useState(false)
  
  useEffect(()=>{
    let token = localStorage.getItem("authToken")
    if (token){    
    setAutenticado(true)
  }
  

  }, [])
  
  
  function autenticar( auth ){
    setAutenticado(auth)}  
  
  return (
    <Routes>
        <Route path="/" element={<BarraSuperior autenticar={autenticar} autenticado={autenticado}/>}>          
            
            <Route index element={<Login autenticar={autenticar} autenticado={autenticado} />}></Route>           
            <Route element={<RutaPrivada autenticado={autenticado}/>}>
              <Route path="/dashboard" element={<Dashboard autenticado ={autenticado}/>} />              
            </Route>                       
            <Route path="/login" element={<Login autenticar={autenticar} autenticado={autenticado}/>}></Route>
            <Route path="/signup" element={<Signup autenticado={autenticado}/>}></Route> 
            
        </Route> 
            
    </Routes>
  )
}



export default AppRouter