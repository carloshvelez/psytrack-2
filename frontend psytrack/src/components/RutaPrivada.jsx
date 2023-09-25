
import React from "react";
import { Outlet, Navigate } from "react-router-dom"



function RutaPrivada({children, autenticado }) {  
  if (!autenticado){
    return <Navigate to="/login" />
  }

  return children ? children : <Outlet />
}

export default RutaPrivada