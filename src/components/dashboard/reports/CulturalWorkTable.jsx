import React from 'react';
import '../../../css/CropInputsTable.scss';

const CultivoInsumosTable = () => {
  const labores = [
    { 
      fechaInicio: '12/02/2024 9:00 am', 
      fechaFin: '12/02/2024 4:20 pm', 
      actividad: 'Adecuación del terreno', 
      maquinaria: 'Tractor John Deere 5060E', 
      operario: 'Samuel Guzmán', 
      descripcion: 'Se realizó 3 pasones de rastra y un pase con grada pesada por hectárea', 
      valor: 4700000 
    },
    { 
      fechaInicio: '13/02/2024', 
      fechaFin: '13/02/2024', 
      actividad: 'Calabonizado', 
      maquinaria: 'Tractor John Deere 5060E', 
      operario: 'Samuel Guzmán', 
      descripcion: '', 
      valor: 1000000 
    },
    { 
      fechaInicio: '15/02/2024', 
      fechaFin: '15/02/2024', 
      actividad: 'Aplicación de Herbicida', 
      maquinaria: 'Glifosato', 
      operario: 'Carlos Silva', 
      descripcion: '', 
      valor: 300000 
    },
    { 
      fechaInicio: '18/02/2024', 
      fechaFin: '18/02/2024', 
      actividad: 'Aplicación de fungicida', 
      maquinaria: 'Azoxystrobin', 
      operario: 'Carlos Silva', 
      descripcion: '', 
      valor: 300000 
    },
    { 
      fechaInicio: '20/02/2024', 
      fechaFin: '20/02/2024', 
      actividad: 'Siembra', 
      maquinaria: 'Tractor John Deere 5060E', 
      operario: 'Samuel Guzmán', 
      descripcion: 'Implemento sembrador', 
      valor: 4000000 
    },
    { 
      fechaInicio: '20/02/2024', 
      fechaFin: '20/02/2024', 
      actividad: 'Riego', 
      maquinaria: 'No aplica', 
      operario: 'Mario Villalba', 
      descripcion: 'Suplemento diario para el riego hasta parte del regador', 
      valor: 500000 
    },
    { 
      fechaInicio: '21/02/2024', 
      fechaFin: '21/02/2024', 
      actividad: 'Inspección de campo', 
      maquinaria: 'No aplica', 
      operario: 'Carlos Silva', 
      descripcion: '', 
      valor: 300000 
    },
    { 
      fechaInicio: '25/02/2024', 
      fechaFin: '25/02/2024', 
      actividad: 'Aplicación de abonos', 
      maquinaria: 'No aplica', 
      operario: 'Carlos Silva', 
      descripcion: '25 días después de germinada', 
      valor: 300000 
    },
    { 
      fechaInicio: '07/03/2024', 
      fechaFin: '07/03/2024', 
      actividad: 'Aplicación de abonos', 
      maquinaria: 'No aplica', 
      operario: 'Carlos Silva', 
      descripcion: '', 
      valor: 300000 
    },
    { 
      fechaInicio: '25/07/2024', 
      fechaFin: '25/07/2024', 
      actividad: 'Aplicación de abonos', 
      maquinaria: 'No aplica', 
      operario: 'Carlos Silva', 
      descripcion: '', 
      valor: 300000 
    },
    { 
      fechaInicio: '19/08/2024', 
      fechaFin: '19/08/2024', 
      actividad: 'Cosecha', 
      maquinaria: 'Combinada Kubota DC - 105X', 
      operario: 'Carlos Silva', 
      descripcion: 'Recolección 120 bultos (granel)', 
      valor: 600000 
    },
    { 
      fechaInicio: '19/08/2024', 
      fechaFin: '19/08/2024', 
      actividad: 'Transporte de cosecha', 
      maquinaria: 'No aplica', 
      operario: 'Mario Losada', 
      descripcion: 'Recolección al molino', 
      valor: 1875000 
    },
  ];

  const total = labores.reduce((sum, item) => sum + (item.valor || 0), 0);

  return (
    <div className="cultivo-insumos-table">
      <h4>Labores Culturales</h4>
      <table>
        <thead>
          <tr>
            <th>Fecha Inicio</th>
            <th>Fecha de culminación</th>
            <th>Actividad</th>
            <th>Maquinaria / Insumo</th>
            <th>Operario</th>
            <th>Descripción</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {labores.map((labor, index) => (
            <tr key={index}>
              <td>{labor.fechaInicio}</td>
              <td>{labor.fechaFin}</td>
              <td>{labor.actividad}</td>
              <td>{labor.maquinaria}</td>
              <td>{labor.operario}</td>
              <td>{labor.descripcion}</td>
              <td>{labor.valor ? `$${labor.valor.toLocaleString()}` : ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="6">Valor Total</td>
            <td>{`$${total.toLocaleString()}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CultivoInsumosTable;
