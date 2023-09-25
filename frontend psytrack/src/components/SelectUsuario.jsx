import React from 'react'
import { Col, Select } from 'antd'


function SelectUsuario(props) {
    return (
        <Col>
        <Select
          className='seleccionador'
          showSearch
          onChange={props.manejarCambio}
          
          placeholder="Busca o selecciona"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={props.opciones}
        />
        </Col>
      )
}

export default SelectUsuario