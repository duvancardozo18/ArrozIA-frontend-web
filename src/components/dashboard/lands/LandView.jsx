import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axiosInstance from '../../../config/AxiosInstance';
import EditCropModal from '../crops/EditCropModal';

const CropView = () => {
  const { fincaSlug, loteSlug, cultivoSlug } = useParams();
  const [cropDetails, setCropDetails] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date()); // Estado para la fecha seleccionada

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await axiosInstance.get(`land/26`);
        const cropData = response.data;
        
        // Verificar y convertir las fechas a objetos Date
        const plantingDate = cropData.plantingDate ? new Date(cropData.plantingDate) : null;
        const estimatedHarvestDate = cropData.estimatedHarvestDate ? new Date(cropData.estimatedHarvestDate) : null;

        // Si las fechas son válidas, establecer la fecha del calendario
        setCropDetails({
          ...cropData,
          plantingDate,
          estimatedHarvestDate
        });

        // Establecer la fecha inicial del calendario
        if (plantingDate) {
          setCalendarDate(plantingDate);
        }

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
    } catch (error) {
      console.error('Error al eliminar el cultivo:', error);
    }
  };

  const handleDateChange = (date) => {
    setCalendarDate(date); // Actualizar la fecha seleccionada en el calendario
  };

  if (!cropDetails) {
    return <div>Cargando información del cultivo...</div>;
  }

  return (
    <div>
      <h1>{cropDetails.nombre}</h1>
      <p>Finca: {cropDetails.finca_id}</p>

      {/* Mostrar calendario */}
      <div>
        <h3>Seleccionar Fecha</h3>
        <Calendar
          onChange={handleDateChange} // Maneja los cambios de fecha
          value={calendarDate} // Fecha seleccionada
          minDate={cropDetails.plantingDate || new Date()} // Limitar la fecha mínima
          maxDate={cropDetails.estimatedHarvestDate || new Date()} // Limitar la fecha máxima
        />
      </div>

      <button onClick={openEditModal}>Actualizar Información</button>
      <button onClick={handleDeleteCrop}>Eliminar Cultivo</button>

      {isEditModalOpen && (
        <EditCropModal crop={cropDetails} closeModal={closeEditModal} />
      )}
    </div>
  );
};

export default CropView;
