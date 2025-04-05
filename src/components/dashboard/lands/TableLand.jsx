import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import '../../../css/Farms.css';

const AllotmentTable = ({ lands, onAddLote, onEditLote, onDeleteLote, onSelectAllotment, selectedAllotment }) => {
  const [hasLotes, setHasLotes] = useState(false);
  const [crops, setCrops] = useState([]); // Estado para almacenar los cultivos
  const navigate = useNavigate();

  const [isCreateCropModalOpen, setIsCreateCropModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);

  const onCreateCrop = (lote) => {
    setSelectedLote(lote);
    setIsCreateCropModalOpen(true);
  };

  const checkLotes = async (lote) => {
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

  // Función para obtener cultivos por ID del lote (land_id)
  const fetchCropsByLand = async (landId) => {
    try {
      const response = await axiosInstance.get(`/crops/by_land/${landId}`);
      setCrops(response.data);
      console.log("Cultivos obtenidos para el lote:", response.data); // Imprimir la información del cultivo
    } catch (error) {
      console.error("Error al obtener cultivos por lote:", error);
    }
  };

  // Efecto para obtener cultivos cuando el lote cambia
  useEffect(() => {
    if (selectedAllotment && selectedAllotment.id) {
      fetchCropsByLand(selectedAllotment.id);
    }
  }, [selectedAllotment]);

  useEffect(() => {
    checkLotes();
  }, []);

  const handleViewCrops = (lote) => {
    navigate(`/land/${lote.id}/crop`);
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
                onClick={() => {
                  console.log("Lote seleccionado en TableLand:", lote);
                  onSelectAllotment(lote);
                }}
                style={{
                  backgroundColor: selectedAllotment && selectedAllotment.id === lote.id ? '#f0f8ff' : 'transparent',
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
                      handleViewCrops(lote);
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

      {/* Muestra los cultivos asociados al lote seleccionado */}
      {selectedAllotment && crops.length > 0 && (
        <div className="crops-list">
          <h3>Cultivos en el lote: {selectedAllotment.nombre}</h3>
          <ul>
            {crops.map((crop) => (
              <li key={crop.id}>
                {crop.cropName} - {crop.varietyName} - Fecha de siembra: {crop.plantingDate}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllotmentTable;
