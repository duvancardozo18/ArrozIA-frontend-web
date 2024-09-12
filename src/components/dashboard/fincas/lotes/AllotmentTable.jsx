import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../../../screens/farm/Finca.scss';

const AllotmentTable = ({ fincaSeleccionada, onAddLote, onEditLote, onDeleteLote }) => {
  const lotes = fincaSeleccionada?.lotes || [];

  return (
    <div className="lote-table-container">
      <div className="header">
        <button onClick={onAddLote} className="add-lote-btn">
          <AddCircleIcon />
        </button>
      </div>
      <hr className="separator" />
      <table className="lote-table">
        <thead>
          <tr>
            <th>Gestionar Cultivos</th>
            <th>Nombre del lote</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Área</th>
            <th>Unidad de área</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lotes.length > 0 ? (
            lotes.map((lote, index) => (
              <tr key={index}>
                <td>Gestionar Cultivos</td>
                <td>{lote.nombre}</td>
                <td>{lote.latitud}</td>
                <td>{lote.longitud}</td>
                <td>{lote.area}</td>
                <td>{lote.unidadArea}</td>
                <td>
                  <button onClick={() => onEditLote(lote)}>
                    <EditIcon style={{ color: '#007BFF' }} />
                  </button>
                  <button onClick={() => onDeleteLote(lote)}>
                    <DeleteIcon style={{ color: '#FF4D4F' }} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay lotes disponibles. Agrega un nuevo lote.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllotmentTable;
