import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../../css/Farms.scss';
import NewCrop from '../crops/CreateCropModal';  // Asegúrate que el path sea correcto

const AllotmentTable = ({ lands, onAddLote, onEditLote, onDeleteLote, onViewCrops, onSelectAllotment, selectedAllotment }) => {
  // Estado para controlar la apertura del modal de crear cultivo
  const [isCreateCropModalOpen, setIsCreateCropModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null); // Guardar el lote seleccionado

  // Función para manejar la apertura del modal de crear cultivo
  const onCreateCrop = (lote) => {
    setSelectedLote(lote);  // Asigna el lote seleccionado
    setIsCreateCropModalOpen(true);  // Abre el modal
  };

  // Estilos en línea para el botón
  const buttonStyle = {
    backgroundColor: '#f3f7fe',
    color: '#14B814',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    width: '100px',
    height: '45px',
    transition: '0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#14B814',
    boxShadow: '0 0 0 5px rgba(20, 184, 20, 0.4)',  // Un verde más claro y con transparencia
    color: '#fff',
  };

  const buttonCreate = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px', 
    marginTop:'20px',
    marginLeft: 'auto',
    marginRight: '30px',
    display: 'block',
  };

  return (
    <div className="lote-table-container">
      <div className="header">
        <button  style={buttonCreate} onClick={onAddLote} className="add-lote-btn">
          Crear Lote
        </button>
      </div>
      <hr className="separator" />
      <table className="lote-table">
        <thead>
          <tr>
            <th>Lote</th>
            <th>Acciones</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lands.length > 0 ? (
            lands.map((lote, index) => (
              <tr 
                key={index} 
                onClick={() => onSelectAllotment(lote)} // Seleccionar el lote cuando se hace clic en una fila
                style={{
                  backgroundColor: selectedAllotment && selectedAllotment.id === lote.id ? '#f0f8ff' : 'transparent', // Resaltar el lote seleccionado
                  cursor: 'pointer'
                }}
              >
                <td>{lote.nombre}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); onEditLote(lote); }}>
                    <EditIcon style={{ color: '#007BFF' }} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteLote(lote); }}>
                    <DeleteIcon style={{ color: '#FF4D4F' }} />
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCrops(lote);  // Pasa el lote seleccionado a onViewCrops
                    }}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.target.style, buttonHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.target.style, buttonStyle);
                    }}
                  >
                    Gestionar Cultivo
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // Evita que se seleccione la fila al hacer clic
                      onCreateCrop(lote);  // Abre el modal de crear cultivo
                    }}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#f0f8ff',  // Color diferente para "Crear Cultivo"
                    }}
                    onMouseEnter={(e) => {
                      Object.assign(e.target.style, { ...buttonHoverStyle, backgroundColor: '#218838' });
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.target.style, { ...buttonStyle, backgroundColor: '#f0f8ff' });
                    }}
                  >
                    Crear Cultivo
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

      {/* Mostrar el modal de crear cultivo */}
      {isCreateCropModalOpen && (
        <NewCrop 
          selectedAllotment={selectedLote}  // Pasa el lote seleccionado al modal
          closeModal={() => setIsCreateCropModalOpen(false)}  // Cierra el modal
        />
      )}

    </div>
  );
};

export default AllotmentTable;
