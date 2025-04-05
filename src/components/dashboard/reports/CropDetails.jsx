import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosInstance";
import Rentabilidad from './Rentabilidad';
import Rendimiento from './Rendimiento';
import TabContent from './TabContent';
import ExportModal from './ExportModal';
import "../../../css/CropDetail.css";

const CropDetails = ({ selectedCropId, selectedFarmName, onClose }) => {
  const [cropDetails, setCropDetails] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [culturalWorks, setCulturalWorks] = useState([]);
  const [lotDetails, setLotDetails] = useState(null); // Estado para los detalles del lote
  const [harvestDate, setHarvestDate] = useState("NO realizada"); // Estado para la fecha de cosecha
  const [varietyName, setVarietyName] = useState("Cargando..."); // Nuevo estado para el nombre de la variedad
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('rentabilidad'); // Cambiar el tab activo inicial a rentabilidad
  const [cultivoTotalCost, setCultivoTotalCost] = useState(0); // Estado para el costo total del cultivo

  // Función para recibir el costo total del cultivo de TotalCostsTable2
  const handleTotalCostUpdate = (totalCost) => {
    setCultivoTotalCost(totalCost); // Actualizamos el estado con el costo total del cultivo
  };
  useEffect(() => {
    if (!selectedCropId) {
      console.error("Error: selectedCropId es undefined o null.");
      return;
    }

    const fetchCropDetails = async () => {
      try {
        const response = await axiosInstance.get(`/crops/${selectedCropId}`);
        console.log("Crop details:", response.data);
        setCropDetails(response.data);
        
        // Si el cultivo tiene un lote relacionado, obtener sus detalles
        if (response.data.plotId) {
          console.log("plotId:", response.data.plotId);  // Asegúrate que plotId tiene valor
          fetchLotDetails(response.data.plotId);  // Si plotId está disponible, buscar los detalles del lote
        } else {
          console.error("plotId no encontrado en los detalles del cultivo.");
        }

        // Obtener el nombre de la variedad
        if (response.data.varietyId) {
          console.log("Fetching variety name for ID:", response.data.varietyId);
          fetchVarietyName(response.data.varietyId);
        } else {
          console.warn("Variety ID is not available in crop details.");
          setVarietyName("No disponible");
        }

        // Obtener la fecha de cosecha desde la nueva ruta
        fetchHarvestDate(selectedCropId);
      } catch (error) {
        console.error("Error fetching crop details:", error);
      }
    };

    const fetchInputs = async () => {
      try {
        const response = await axiosInstance.get(`/cultivos/${selectedCropId}/insumos`);
        setInputs(response.data);
      } catch (error) {
        console.error("Error fetching crop inputs:", error);
      }
    };

    const fetchCulturalWorks = async () => {
      try {
        const response = await axiosInstance.get(`/crops/${selectedCropId}/cultural-works`);
        setCulturalWorks(response.data);
      } catch (error) {
        console.error("Error fetching cultural works:", error);
      }
    };

    const fetchLotDetails = async (plotId) => {
      try {
        const response = await axiosInstance.get(`/land/${plotId}`);
        setLotDetails(response.data);
      } catch (error) {
        console.error("Error fetching lot details:", error);
      }
    };

    const fetchVarietyName = async (varietyId) => {
      try {
        const response = await axiosInstance.get(`/get-variety/${varietyId}`);
        console.log("Variety name response:", response.data);
        if (response.data && response.data.nombre) {
          setVarietyName(response.data.nombre);
        } else {
          setVarietyName("No disponible");
        }
      } catch (error) {
        console.error("Error fetching variety name:", error);
        setVarietyName("No disponible");
      }
    };

    const fetchHarvestDate = async (cropId) => {
      try {
        const response = await axiosInstance.get(`/harvest/crops/${cropId}`);
        const harvestData = response.data.cosechas?.[0]?.fecha_cosecha; // Obtener la primera cosecha si existe
        setHarvestDate(harvestData ? new Date(harvestData).toLocaleDateString() : "NO realizada");
      } catch (error) {
        console.error("Error fetching harvest date:", error);
      }
    };

    fetchCropDetails();
    fetchInputs();
    fetchCulturalWorks();
  }, [selectedCropId]);

  // Función para recibir el total del costo del cultivo
  const handleTotalCostChange = (totalCost) => {
    setCultivoTotalCost(totalCost);  // Actualizamos el estado con el total del costo
  };

  if (!selectedCropId) {
    return <p>Por favor, selecciona un cultivo válido para ver los detalles.</p>;
  }

  if (!cropDetails) {
    return <p>Cargando detalles del cultivo...</p>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rendimiento':
        return <Rendimiento />;
      case 'rentabilidad':
        return (
          <Rentabilidad
            plantingDate={cropDetails.plantingDate || "No disponible"}
            harvestDate={harvestDate}
            expenses={cropDetails.expenses || []}
            income={cropDetails.income || []}
            cultivoId={selectedCropId}
          />
        );
      case 'tab':
        return <TabContent />;
      default:
        return null;
    }
  };
  
  return (
    <div className="crop-details">
      <button onClick={() => setShowExportModal(true)} className="export-button">Exportar Informe</button>
      <h3>Detalles del Cultivo: {cropDetails.cropName}</h3>
      <p>Finca: {selectedFarmName || "No disponible"}</p>
      <p>Variedad: {varietyName}</p> {/* Mostrar el nombre de la variedad */}
      <p>Lote: {cropDetails.plotId || "No disponible"}</p>
      <p>Área cultivada:{" "} {lotDetails?.area ? `${(lotDetails.area / 10000).toFixed(2)} hectáreas` : "No disponible"}</p>
      <p>Fecha de siembra: {cropDetails.plantingDate ? new Date(cropDetails.plantingDate).toLocaleDateString() : "No disponible"}</p>
      <p>Fecha estimada de cosecha: {cropDetails.estimatedHarvestDate ? new Date(cropDetails.estimatedHarvestDate).toLocaleDateString() : "No disponible"}</p>
      <p>Fecha de cosecha: {harvestDate}</p>

      <div className="tabs">
        <button onClick={() => setActiveTab('rentabilidad')} className={activeTab === 'rentabilidad' ? 'active' : ''}>
          Rentabilidad
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
      
     
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          cropDetails={cropDetails}
          varietyName = {varietyName}
          lotDetails={lotDetails}
          farmName = {selectedFarmName}
          farmId = {cropDetails.farm?.id || cropDetails.farmId || null} // Pasamos farmId
          farmLocation ={ lotDetails ? `${lotDetails.ciudad || "Ciudad desconocida"} - ${lotDetails.departamento || "Departamento desconocido"}` : "No disponible"}
          inputs={inputs}
          culturalWorks={culturalWorks}
          cultivoTotalCost={cultivoTotalCost}
          cultivoId={selectedCropId}
        />
      )}
    </div>
  );
};

export default CropDetails;
