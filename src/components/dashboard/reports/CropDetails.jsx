// CropDetails.jsx
import React, { useEffect, useState } from 'react';
import GeneralInfoCard from './GeneralInfoCard';
import ExportModal from './ExportModal';
import axiosInstance from "../../../config/AxiosInstance";
import Rentabilidad from './Rentabilidad';
import Rendimiento from './Rendimiento';
import TabContent from './TabContent';

const CropDetails = ({ selectedCropId, onClose }) => {
  const [cropDetails, setCropDetails] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('rendimiento');

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await axiosInstance.get(`/crops/${selectedCropId}`);
        setCropDetails(response.data);
      } catch (error) {
        console.error("Error fetching crop details:", error);
      }
    };

    if (selectedCropId) {
      fetchCropDetails();
    }
  }, [selectedCropId]);

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
            expenses={cropDetails.expenses || []} 
            income={cropDetails.income || []} 
            onExport={() => setShowExportModal(true)} // Prop para mostrar el modal de exportación
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
      <h3>{cropDetails.cropName}</h3>
      <p>Finca: {cropDetails.farm?.cropName || "No disponible"}</p>
      <p>Variedad: {cropDetails.varietyId || "No disponible"}</p>
      <p>Lote: {cropDetails.plotId || "No disponible"}</p>
      <p>Área cultivada: {cropDetails.cultivatedArea} {cropDetails.areaUnit}</p>
      <p>Fecha de siembra: {cropDetails.plantingDate}</p>
      <p>Fecha estimada de cosecha: {cropDetails.estimatedHarvestDate}</p>
      <p>Fecha de cosecha: {cropDetails.harvestDate ? cropDetails.harvestDate : "NO realizada"}</p>

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

      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
};

export default CropDetails;
