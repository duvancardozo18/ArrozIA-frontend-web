
import React, { useState, useContext, useEffect } from "react";
import Header from "../Header";
import ColumCards from "./ColumCards";
import ColumMonitoring from "./ColumMonitoring";
import { AuthContext } from "../../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosInstance";
import CreateMonitoringModal from "./CreateMonitoringModal";

const MonitoringView = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [monitorings, setMonitorings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const checkIfAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/is_admin`);
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  // Obtener cultivos según el rol del usuario
  const fetchAssignedFarmCrops = async () => {
    try {
      if (isAdmin) {
        // Si es administrador, obtener todos los cultivos
        const cropsResponse = await axiosInstance.get("/crops/all"); // Ajusta el endpoint si es necesario
        setCrops(cropsResponse.data);
      } else {
        // Si no es administrador, obtener la finca asignada y sus cultivos
        const farmResponse = await axiosInstance.get(`/users/${userId}/farms`);
        const assignedFarm = farmResponse.data[0]; // Suponemos que el usuario tiene asignada una sola finca

        if (assignedFarm) {
          const cropsResponse = await axiosInstance.get(`/farms/${assignedFarm.id}/crops`);
          setCrops(cropsResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  const fetchMonitorings = async (cropId) => {
    try {
      const response = await axiosInstance.get(`/monitoring/by_crop/${cropId}`);
      setMonitorings(response.data || []);
    } catch (error) {
      console.error("Error fetching monitorings:", error);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      fetchAssignedFarmCrops(); // Cargar cultivos de la finca asignada o todos si es admin
    }
  }, [isAdmin]);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    fetchMonitorings(crop.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshMonitorings = () => {
    if (selectedCrop) fetchMonitorings(selectedCrop.id);
  };

  return (
    <div className="content-area">
      <Header title="Monitoreo de Cultivos" />

      {/* Lista de cultivos */}
      <div className="monitoring-view-container">
        <ColumCards crops={crops} selectedCrop={selectedCrop} onSelectCrop={handleCropSelect} />
        <ColumMonitoring
          selectedCrop={selectedCrop}
          monitorings={monitorings}
          onOpenModal={() => setIsModalOpen(true)}
          refreshMonitorings={refreshMonitorings}
        />
      </div>

      {isModalOpen && (
        <CreateMonitoringModal
          closeModal={closeModal}
          fetchMonitorings={refreshMonitorings}
          selectedCrop={selectedCrop}
        />
      )}
    </div>
  );
};

export default MonitoringView;