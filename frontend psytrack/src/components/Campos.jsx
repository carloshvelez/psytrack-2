import React from 'react'
import { Input, DatePicker, Select, Form } from 'antd'
import FormularioDinamico from './FormularioDinamico'
import { verificarEmailPaciente } from '../api/psicologo.api'

function Campos(props) {
   
    const validador_mail = (rule, value)=>{
       return new Promise((resolve, reject) =>{
        console.log(value)
        verificarEmailPaciente(value)
        .then((respuesta)=>{            
            let correoExiste = respuesta.data.existe            
            if (correoExiste){
                reject("El correo electrónico del paciente ya existe en su base de datos. Registre un correo diferente o verifique si ya registró a este paciente en el pasado")
            } else {
                resolve()
            }            
        })

       })
       
        
        
        
    }
    

    const validador_fecha = (rule, value)=>{
        if (!value){
            return Promise.resolve();
        }
        let fechaSeleccionada = new Date(value)
        let fechaActual = new Date()

        let milisegundosEnCincoAnios = 1000 * 60 * 60 * 24 * 365.25 * 5
        let diferencia = fechaActual - fechaSeleccionada

        if (fechaSeleccionada > fechaActual){
            return Promise.reject("La fecha debe de ser menor o igual a la actual")            
        } 

        if (diferencia < milisegundosEnCincoAnios){
            return Promise.reject("El usuario debe tener más de cinco años de edad")            
        } 

        return Promise.resolve()       
    }
    return (
        <Form.Item
        hasFeedback        
            key={props.nombre+props.tipo_campo}
            name={props.nombre}
            label={props.etiqueta}

            rules=
            {props.tipo_campo != 'SelectMultiple' && 
            [
                {
                    required: props.requerido,
                    message: `Debes diligenciar ${props.etiqueta}`
                },
                {
                    type: props.tipo_campo === 'EmailInput' ? 'email':
                    props.tipo_campo === 'DateInput' ? 'date' : 'string'
                },              
                props.tipo_campo != "DateInput" && props.tipo_campo != "Select" ?
                {
                    min: 3,
                    message : "Debe tener al menos tres caracteres"
                }:null,
                {
                    pattern: props.nombre === "telefono_fijo" ? /^6\d{9}$/ : 
                        props.nombre === "telefono_celular" ? /^3\d{9}$/ :
                        /^(.*?)$/,
                    message: props.ayuda
                }, 
                {
                    validator: props.nombre ==="fecha_nacimiento" ? validador_fecha : 
                                props.tipo_campo ==="EmailInput" ? validador_mail: "",
                    trigger: "onBlur"
                },
                
               
            ]
           
            
            }>
            {(props.tipo_campo === 'Textarea')
                ? <Input.TextArea showCount style={{ height: 150, marginBottom: 24 }} placeholder={props.ayuda} />
                : (props.tipo_campo === 'SelectMultiple')
                    ? <FormularioDinamico nombre_campo={props.nombre} etiqueta={props.etiqueta} placeholder={props.ayuda} />
                    : (props.tipo_campo === 'DateInput')
                        ? <DatePicker format="DD-MM-YYYY" placeholder="Seleccione" />
                        : (props.tipo_campo === 'Select')
                            ? <Select placeholder={props.ayuda}>
                                {Object.entries(props.opciones).map((opcion) => <Select.Option value={opcion[1]} key={props.nombre + opcion[1]}>{opcion[0]}</Select.Option>)}
                            </Select>
                            : <Input placeholder={props.ayuda} />}
        </Form.Item>
    )
}

export default Campos