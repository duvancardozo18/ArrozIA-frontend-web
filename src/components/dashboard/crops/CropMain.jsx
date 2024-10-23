import React, { useState, useEffect } from 'react';
import CropTable from './CropTable';
import NewCrop from './CreateCropModal';
import EditCropModal from '../../dashboard/crops/EditCropModal';
import DeleteCropModal from '../../dashboard/modal/DeleteModal';
import axiosInstance from '../../../config/AxiosInstance';
import { useLocation } from 'react-router-dom';

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

const CropMain = () => {
  const location = useLocation();
  const { crops: initialCrops, landId, allotment: initialAllotment } = location.state || {};
  const [crops, setCrops] = useState(initialCrops || []);
  const [selectedAllotment, setSelectedAllotment] = useState(initialAllotment || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [deletingCrop, setDeletingCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Datos iniciales de crops:", initialCrops);
  console.log("ID del lote (landId):", landId);
  console.log("Alotamiento seleccionado:", selectedAllotment);
    const fetchAllotmentAndCrops = async () => {
      if (landId) {
        try {
          setLoading(true);
          if (!selectedAllotment) {
            const allotmentResponse = await axiosInstance.get(`/lands/${landId}`);
            setSelectedAllotment(allotmentResponse.data);
          }
          
          if (!initialCrops || initialCrops.length === 0) {
            const cropsResponse = await axiosInstance.get(`/crops?land_id=${landId}`);
            setCrops(cropsResponse.data);
          }
        } catch (error) {
          console.error('Error fetching allotment or crops:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAllotmentAndCrops();
  }, [landId, initialCrops, selectedAllotment]);

  const handleAddCrop = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (cropId) => {
    try {
      await axiosInstance.delete(`/delete/crop/${cropId}`);
      setCrops(crops.filter((crop) => crop.id !== cropId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const confirmDeleteCrop = (crop) => {
    setDeletingCrop(crop);
    setIsDeleteModalOpen(true);
  };

  const refreshCrops = async () => {
    try {
      const response = await axiosInstance.get(`/crops?land_id=${landId}`);
      if (response.status === 200) {
        setCrops(response.data);
      } else {
        console.error('Error al obtener los cultivos:', response);
      }
    } catch (error) {
      console.error('Error al obtener los cultivos:', error);
    }
  };
  
  if (loading) {
    return <div>Cargando información del lote y cultivos...</div>;
  }

  return (
    <div className="box-crop">
      {selectedAllotment ? (
        <>
          <h2>{selectedAllotment.nombre}</h2>
          
          {crops.length > 0 ? (
            <CropTable
              crops={crops}
              onAddCrop={handleAddCrop}
              onEditCrop={handleEditCrop}
              onDeleteCrop={confirmDeleteCrop}
            />
          ) : (
            <div>
              <p>No hay cultivos asignados a este lote.</p>
              <button  style={buttonCreate} onClick={handleAddCrop} className="add-lote-btn">
                  Crear Cultivo
            </button>
            </div>
          )}

          {isAddModalOpen && (
            <NewCrop
              show={isAddModalOpen}
              closeModal={() => setIsAddModalOpen(false)}
              onSave={() => {
                setIsAddModalOpen(false);
                refreshCrops();
              }}
              selectedAllotment={selectedAllotment}
            />
          )}

          {isEditModalOpen && (
            <EditCropModal
              show={isEditModalOpen}
              crop={editingCrop}
              closeModal={() => setIsEditModalOpen(false)}
              onSave={() => {
                setIsEditModalOpen(false);
                refreshCrops();
              }}
            />
          )}

          {isDeleteModalOpen && deletingCrop && (
            <DeleteCropModal
              show={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => handleDelete(deletingCrop.id)}
            />
          )}
        </>
      ) : (
        <p>No se ha seleccionado ningún lote. Por favor, seleccione un lote para ver sus cultivos.</p>
      )}
    </div>
  );
};

export default CropMain;