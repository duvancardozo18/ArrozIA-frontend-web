import React, { useContext, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual'; // Asegúrate de instalar lodash si no lo tienes
import { AuthContext } from "../../config/AuthProvider";
import Header from '../../components/dashboard/Header';
import axiosInstance from '../../config/AxiosInstance';
import { Navigate } from 'react-router-dom';
import '../../css/Crop.scss';
import VegetativeCard from "../../components/dashboard/vegetativecycle/VegetativeCard";
import EditStageModal from "../../components/dashboard/vegetativecycle/EditStageModal";

const VegetativeCycle = ({ selectedAllotment }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [vegetativeStages, setVegetativeStages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchVegetativeCycle = async () => {
      if (!selectedAllotment || !selectedAllotment.sowingDate) {
        console.error("selectedAllotment o la fecha de siembra no están definidos.");
        return;
      }
  
      try {
        const response = await axiosInstance.post('/crop-cycle/generate-cycle', {
          sowingDate: selectedAllotment.sowingDate,
        });
        console.log("Datos de etapas:", response.data); // Verificar si cada etapa tiene un id
        // Solo actualiza el estado si los datos han cambiado
        if (!isEqual(response.data, vegetativeStages)) {
          setVegetativeStages(response.data);
        }
      } catch (error) {
        console.error("Error al obtener el ciclo vegetativo:", error);
      }
    };
    
  
    fetchVegetativeCycle();
  }, [selectedAllotment, vegetativeStages]); // Incluye `vegetativeStages` para verificar cambios

  const handleEditStage = (stage) => {
    // Elimina la validación de id para mostrar el modal aunque no exista un id
    console.log("Stage en handleEditStage:", stage);
    setSelectedStage(stage);
    setIsModalOpen(true);
  };
  
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStage(null);
  };


};

export default VegetativeCycle;
