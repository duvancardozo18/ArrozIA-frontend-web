import React, { useState, useContext, useEffect } from "react";
import { Header } from "../../components";
import ColumLands from "../../components/dashboard/soilsanalysis/ColumLands";
import ColumSoilAnalysis from "../../components/dashboard/soilsanalysis/ColumSoilAnalysis";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import "../../css/SoilAnalysis.css";
import axiosInstance from "../../config/AxiosInstance";
import CreateSoilAnalysisModal from "../../components/dashboard/soilsanalysis/CreateSoilAnalysisModal";

const SoilAnalysis = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [soilAnalyses, setSoilAnalyses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // Inicializar como null

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el usuario es administrador
  const checkIfAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/is_admin`);
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  // Obtener los lotes según el rol del usuario
  const fetchLands = async () => {
    if (isAdmin === null) return; // Evita la llamada si isAdmin aún no ha sido definido
    try {
      const url = isAdmin ? "/lands" : `/users/${userId}/lots`;
      const response = await axiosInstance.get(url);
      if (Array.isArray(response.data)) {
        setLands(response.data);
      } else {
        console.error("La respuesta de /lands no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener lotes:", error);
    }
  };  

  useEffect(() => {
    checkIfAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin !== null) { // Esperar a que se determine el rol del usuario
      fetchLands();
    }
  }, [isAdmin]);

  const fetchSoilAnalysesForLand = async (landId) => {
    try {
      const response = await axiosInstance.get(`/soil_analysis/${landId}`);
      setSoilAnalyses(response.data || []);
    } catch (error) {
      console.error("Error al obtener análisis edafológico:", error);
    }
  };

  const handleLandSelect = async (land) => {
    setSelectedLand(land);
    await fetchSoilAnalysesForLand(land.id);
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
