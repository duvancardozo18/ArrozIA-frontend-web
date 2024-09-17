import React, { useState, useEffect } from 'react';
import CropTable from './CropTable';
import NewCrop from '../../../../screens/crops/NewCrop';
import EditCropModal from '../../../../screens/crops/EditCropModal';
import DeleteCropModal from '../../../../screens/crops/DeleteCropModal';
import axiosInstance from '../../../../config/AxiosInstance';
import { useLocation } from 'react-router-dom';

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
      setCrops(response.data);
    } catch (error) {
      console.error('Error refreshing crops:', error);
    }
  };

  if (loading) {
    return <div>Cargando información del lote y cultivos...</div>;
  }

  return (
    <div className="box-crop">
      {selectedAllotment ? (
        <>
          <h2>Gestionando Cultivos del lote: {selectedAllotment.nombre}</h2>
          
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
              <button onClick={handleAddCrop}>Crear Nuevo Cultivo</button>
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