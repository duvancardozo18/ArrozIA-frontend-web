import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosInstance";
import Rentabilidad from './Rentabilidad';
import Rendimiento from './Rendimiento';
import TabContent from './TabContent';
import ExportModal from './ExportModal';

const CropDetails = ({ selectedCropId, onClose }) => {
  const [cropDetails, setCropDetails] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [culturalWorks, setCulturalWorks] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('rendimiento');

  console.log("CropDetails - selectedCropId recibido:", selectedCropId); // Debug

  useEffect(() => {
    if (!selectedCropId) {
      console.error("Error: selectedCropId es undefined o null.");
      return;
    }

    const fetchCropDetails = async () => {
      try {
        console.log("Fetching details for selectedCropId:", selectedCropId);
        const response = await axiosInstance.get(`/crops/${selectedCropId}`);
        setCropDetails(response.data);
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

    fetchCropDetails();
    fetchInputs();
    fetchCulturalWorks();
  }, [selectedCropId]);

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
        console.log("CropDetails - Pasando cultivoId a Rentabilidad:", selectedCropId); // Debug
        return (
          <Rentabilidad
            plantingDate={cropDetails.plantingDate || "No disponible"}
            harvestDate={
              cropDetails.estimatedHarvestDate ||
              cropDetails.harvestDate ||
              "No disponible"
            }
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
      <h3>Detalles del Cultivo: {cropDetails.cropName}</h3>
      <p>Finca: {cropDetails.farm?.cropName || "No disponible"}</p>
      <p>Variedad: {cropDetails.varietyId || "No disponible"}</p>
      <p>Lote: {cropDetails.plotId || "No disponible"}</p>
      <p>Área cultivada: {cropDetails.cultivatedArea} {cropDetails.areaUnit}</p>
      <p>Fecha de siembra: {cropDetails.plantingDate ? new Date(cropDetails.plantingDate).toLocaleDateString() : "No disponible"}</p>
      <p>Fecha estimada de cosecha: {cropDetails.estimatedHarvestDate ? new Date(cropDetails.estimatedHarvestDate).toLocaleDateString() : "No disponible"}</p>
      <p>Fecha de cosecha: {cropDetails.harvestDate ? new Date(cropDetails.harvestDate).toLocaleDateString() : "NO realizada"}</p>

      <div className="tabs">
        <button onClick={() => setActiveTab('rendimiento')} className={activeTab === 'rendimiento' ? 'active' : ''}>
          Rendimiento
        </button>
        <button onClick={() => setActiveTab('rentabilidad')} className={activeTab === 'rentabilidad' ? 'active' : ''}>
          Rentabilidad
        </button>
        <button onClick={() => setActiveTab('tab')} className={activeTab === 'tab' ? 'active' : ''}>
          Tab
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>

      <button onClick={() => setShowExportModal(true)} className="export-button">Exportar Informe</button>
      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)} 
          cropDetails={cropDetails}
          inputs={inputs}
          culturalWorks={culturalWorks}
          cultivoId={selectedCropId} // Pasa el cultivoId
        />
      )}
    </div>
  );
};

export default CropDetails;
