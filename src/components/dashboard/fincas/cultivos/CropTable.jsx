import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../../../screens/farm/Finca.scss';

const CropTable = ({ crops, onAddCrop, onEditCrop, onDeleteCrop, onSelectCrop, selectedCrop }) => {

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
    boxShadow: '0 0 0 5px rgba(20, 184, 20, 0.4)',
    color: '#fff',
  };

  return (
    <div className="crop-table-container">
      <div className="header">
        <button onClick={onAddCrop} className="add-crop-btn">
          <AddCircleIcon />
        </button>
      </div>
      <hr className="separator" />
      <table className="crop-table">
        <thead>
          <tr>
            <th>Nombre del Cultivo</th>
            <th>Variedad</th>
            <th>Fecha de Siembra</th>
            <th>Fecha Estimada de Cosecha</th>
            <th>Lote</th>
            <th>Área Cultivada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {crops.length > 0 ? (
            crops.map((crop, index) => (
              <tr 
                key={index} 
                onClick={() => onSelectCrop(crop)}
                style={{
                  backgroundColor: selectedCrop && selectedCrop.id === crop.id ? '#f0f8ff' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <td>{crop.cropName}</td>
                <td>{crop.varietyId}</td>
                <td>{crop.plantingDate}</td>
                <td>{crop.estimatedHarvestDate}</td>
                <td>{crop.plotId}</td>
                <td>{crop.cultivatedArea} {crop.areaUnit}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); onEditCrop(crop); }}>
                    <EditIcon style={{ color: '#007BFF' }} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteCrop(crop); }}>
                    <DeleteIcon style={{ color: '#FF4D4F' }} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay cultivos disponibles. Agrega un nuevo cultivo.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CropTable;