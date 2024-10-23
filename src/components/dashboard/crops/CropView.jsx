import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import EditCropModal from './EditCropModal';

const CropView = () => {
  const { fincaSlug, loteSlug, cultivoSlug } = useParams();
  const [cropDetails, setCropDetails] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await axiosInstance.get(`/crops/${fincaSlug}/${loteSlug}/${cultivoSlug}`);
        setCropDetails(response.data);
      } catch (error) {
        console.error('Error fetching crop details:', error);
      }
    };
    fetchCropDetails();
  }, [fincaSlug, loteSlug, cultivoSlug]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteCrop = async () => {
    try {
      await axiosInstance.delete(`/crops/${cultivoSlug}`);
      alert('Cultivo eliminado exitosamente');
      // Redirigir a otra página si es necesario
    } catch (error) {
      console.error('Error al eliminar el cultivo:', error);
    }
  };

  if (!cropDetails) {
    return <div>Cargando información del cultivo...</div>;
  }

  return (
    <div>
      <h1>{cropDetails.cropName}</h1>
      <p>Variedad: {cropDetails.varietyName}</p>
      <p>Siembra: {new Date(cropDetails.plantingDate).toLocaleDateString()}</p>
      <p>Cosecha: {new Date(cropDetails.estimatedHarvestDate).toLocaleDateString()}</p>

      <button onClick={openEditModal}>Actualizar Información</button>
      <button onClick={handleDeleteCrop}>Eliminar Cultivo</button>

      {isEditModalOpen && (
        <EditCropModal crop={cropDetails} closeModal={closeEditModal} />
      )}
    </div>
  );
};

export default CropView;
