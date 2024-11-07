import React, { useState, useContext, useEffect } from "react";
import { Header } from "../../components";
import ColumLands from "../../components/dashboard/soilsanalysis/ColumLands";
import ColumSoilAnalysis from "../../components/dashboard/soilsanalysis/ColumSoilAnalysis";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import "../../css/SoilAnalysis.scss";
import axiosInstance from "../../config/AxiosInstance";
import CreateSoilAnalysisModal from "../../components/dashboard/soilsanalysis/CreateSoilAnalysisModal";

const SoilAnalysis = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [soilAnalyses, setSoilAnalyses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const fetchLands = async () => {
    try {
      const response = await axiosInstance.get("/lands");
      if (Array.isArray(response.data)) {
        setLands(response.data);
      } else {
        console.error("La respuesta de /lands no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener lotes:", error);
    }
  };

  const fetchSoilAnalysesForLand = async (landId) => {
    try {
      const response = await axiosInstance.get(`/soil_analysis/${landId}`);
      setSoilAnalyses(response.data || []);
    } catch (error) {
      console.error("Error al obtener análisis edafológico:", error);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const handleLandSelect = async (land) => {
    setSelectedLand(land);
    await fetchSoilAnalysesForLand(land.id); // Ensure it completes before opening modal
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshSoilAnalyses = () => {
    if (selectedLand) fetchSoilAnalysesForLand(selectedLand.id);
  };

  return (
    <div className="content-area">
      <Header title="Análisis edafológico" />
      <div className="soil-analysis-view-container">
        <ColumLands lands={lands} selectedLand={selectedLand} onSelectLand={handleLandSelect} />
        <ColumSoilAnalysis 
            selectedLand={selectedLand}
            soilAnalyses={soilAnalyses}
            onOpenModal={() => {
                if (selectedLand) {
                    setIsModalOpen(true);
                } else {
                    console.log("No hay lote seleccionado");
                }
            }}
            refreshSoilAnalyses={refreshSoilAnalyses}
        />
      </div>

      {isModalOpen && (
        <CreateSoilAnalysisModal
          closeModal={closeModal}
          onSave={refreshSoilAnalyses}
          selectedLand={selectedLand}
        />
      )}
    </div>
  );
};

export default SoilAnalysis;
