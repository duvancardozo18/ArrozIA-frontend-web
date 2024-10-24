import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import axiosInstance from '../../../config/AxiosInstance';
import NewCrop from '../crops/CreateCropModal';
import '../../../css/Farms.scss';

const AllotmentTable = ({ lands, onAddLote, onEditLote, onDeleteLote, onSelectAllotment, selectedAllotment }) => {
  const [hasLotes, setHasLotes] = useState(false); // Estado para verificar si hay lotes
  const navigate = useNavigate();  // Utiliza useNavigate para la navegación

    // Estado para controlar la apertura del modal de crear cultivo
    const [isCreateCropModalOpen, setIsCreateCropModalOpen] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null); // Guardar el lote seleccionado

      // Función para manejar la apertura del modal de crear cultivo
  const onCreateCrop = (lote) => {
    setSelectedLote(lote);  // Asigna el lote seleccionado
    setIsCreateCropModalOpen(true);  // Abre el modal
  };

    // Función para gestionar cultivos, redirigiendo a la ruta específica
    const checkLotes = async (lote) => { // Pass lote as an argument
      if (!lote || !lote.id) {
        console.error("Lote is undefined or missing ID.");
        return;
      }
      try {
        const response = await axiosInstance.get(`/land/${lote.id}`);
        console.log("Full response from :", response.data);
      
        if (response.data.lotes_exist) {
          setHasLotes(true);
        } else {
          setHasLotes(false);
        }
      } catch (error) {
        console.error("Error fetching lotes:", error);
        setHasLotes(false);
      }
    };
    
  
  useEffect(() => {
    checkLotes();  // Call the function when the component mounts
  }, []);
  

  const handleViewCrops = (lote) => {
    navigate(`/land/${lote.id}/crop`);  // Redirige a una ruta específica con el ID del lote
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
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: '30px',
    display: 'block',
  };

  const agricultural = {
    padding: '10px 20px',
    border: '1px solid #28a745',
    backgroundColor: 'white',
    color: '#28a745',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '4px',
    fontWeight: 'bold',
  };

  return (
    <div className="lote-table-container">
      <div className="header">
      <button style={buttonCreate} onClick={onAddLote}>
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
                        handleViewCrops(lote);  // Redirigir a la ruta de gestionar cultivos
                      }}
                      style={agricultural}
                    >
                      Gestionar Cultivo
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
