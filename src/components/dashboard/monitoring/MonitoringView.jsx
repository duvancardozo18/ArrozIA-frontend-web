import React, { useState, useContext, useEffect } from "react";
import Header from "../Header";
import CropCard from "../tasks/CropCard";
import ColumMonitoring from "./ColumMonitoring";
import { AuthContext } from "../../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosInstance";
import CreateMonitoringModal from "./CreateMonitoringModal";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 30%;
  padding-right: 20px;
  border-right: 1px solid #ddd;

  @media (max-width: 768px) {
    width: 100%;
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
`;

const Content = styled.div`
  width: 70%;
  padding-left: 20px;

  @media (max-width: 768px) {
    width: 100%;
    padding-left: 0;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
  transition: box-shadow 0.3s ease;

  &:focus {
    box-shadow: 0 0 5px 2px rgba(0, 128, 0, 0.4); /* Sombra verde */
  }
`;

const MonitoringView = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [monitorings, setMonitorings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Obtener las fincas según el rol del usuario
  const fetchFarms = async () => {
    try {
      const url = isAdmin ? "/farms" : `/users/${userId}/farms`;
      const response = await axiosInstance.get(url);
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  // Obtener monitoreos relacionados al cultivo seleccionado
  const fetchMonitoringsForCrop = async () => {
    if (!selectedCrop) return;

    try {
      const response = await axiosInstance.get(`/monitoring/by_crop/${selectedCrop.id}`);
      console.log("obtener monitoreos del cultivo", response.data);
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
      fetchFarms();
    }
  }, [isAdmin]);

  // Obtener cultivos relacionados a la finca seleccionada
  useEffect(() => {
    const fetchCropsForFarm = async () => {
      if (!selectedFarmId) return;

      try {
        const response = await axiosInstance.get(`/farms/${selectedFarmId}/crops`);
        setCrops(response.data);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };

    fetchCropsForFarm();
  }, [selectedFarmId]);

  useEffect(() => {
    fetchMonitoringsForCrop();
  }, [selectedCrop]);

  const handleFarmSelection = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    setSelectedCrop(null); // Limpiar el cultivo seleccionado al cambiar de finca
    setCrops([]);
    setMonitorings([]);
  };

  const handleCropSelection = (crop) => {
    setSelectedCrop(crop);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshMonitorings = () => {
    fetchMonitoringsForCrop();
  };

  return (
    <div className="content-area">
      <Header title="Monitoreo de Cultivos" />
      <Container>
        <Sidebar>
          <h2>Fincas</h2>
          <StyledSelect onChange={handleFarmSelection} value={selectedFarmId || ""}>
            <option value="" disabled>
              Selecciona una finca
            </option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.nombre}
              </option>
            ))}
          </StyledSelect>

          {selectedFarmId && (
            <>
              <h2 style={{ marginTop: "20px" }}>Cultivos</h2>
              {crops.map((crop) => (
                <CropCard
                  key={crop.id}
                  cropName={crop.cropName}
                  onClick={() => handleCropSelection(crop)}
                  isSelected={selectedCrop?.id === crop.id}
                />
              ))}
            </>
          )}
        </Sidebar>
        <Content>
          {selectedCrop ? (
            <ColumMonitoring
              selectedCrop={selectedCrop}
              monitorings={monitorings}
              onOpenModal={() => setIsModalOpen(true)}
              refreshMonitorings={refreshMonitorings}
              isAdmin={isAdmin} // Pasa la prop de administrador
              // setMonitoring={setMonitoring}
            />
          ) : (
            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
                color: "#555",
                marginTop: "20px",
              }}
            >
              Selecciona un cultivo para ver los monitoreos.
            </p>
          )}
        </Content>
      </Container>

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