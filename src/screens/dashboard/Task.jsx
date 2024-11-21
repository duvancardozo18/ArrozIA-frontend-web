import React, { useContext, useEffect, useState, useRef } from 'react';
import Header from '../../components/dashboard/Header';
import { AuthContext } from '../../config/AuthProvider';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../../config/AxiosInstance';
import CropCard from '../../components/dashboard/tasks/CropCard';
import TableroKanban from '../../components/dashboard/tasks/TableroKanban';

// Styled components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
`;

const ContainerBox = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  margin: 20px auto;
`;

const Content = styled.div`
  width: 100%;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const Sidebar = styled.div`
  flex: 1;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
`;

const NoTasksMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-top: 20px;
`;

const CropNavigation = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  .crop-navigation-scroll {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    gap: 10px;
    width: 100%;

    /* Esconder scrollbar */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; /* IE 10+ */
    scrollbar-width: none; /* Firefox */
  }

  @media (max-width: 768px) {
    .crop-navigation-scroll {
      width: 90%; /* Limitar ancho en móviles */
    }
  }

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
  }
`;


// Tasks Component
const Tasks = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCropName, setSelectedCropName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollRef = useRef(null);

  const checkIfAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/is_admin`);
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchFarms = async () => {
    try {
      const url = isAdmin ? '/farms' : `/users/${userId}/farms`;
      const response = await axiosInstance.get(url);
      setFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
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

  const fetchCropsForFarm = async (farmId) => {
    try {
      const response = await axiosInstance.get(`/farms/${farmId}/crops`);
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchTasksForCrop = async (cropId) => {
    try {
      const response = await axiosInstance.get(`/crops/${cropId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const handleFarmSelection = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    setCrops([]);
    setTasks([]);
    setSelectedCropId(null);
    setSelectedCropName('');
    fetchCropsForFarm(farmId);
  };

  const handleCropSelection = (cropId, cropName) => {
    setSelectedCropId(cropId);
    setSelectedCropName(cropName);
    fetchTasksForCrop(cropId);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header />
      <h2>Tareas</h2>
      <Container>
        <ContainerBox>
          <Sidebar>
            <h3>Fincas</h3>
            <StyledSelect onChange={handleFarmSelection} value={selectedFarmId || ''}>
              <option value="" disabled>
                Selecciona una finca
              </option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.nombre}
                </option>
              ))}
            </StyledSelect>
          </Sidebar>
          <Content>
            {selectedFarmId && (
              <>
                <h3>Cultivos</h3>
                <CropNavigation>
                  <button className="arrow-button" onClick={scrollLeft}>
                    {'<'}
                  </button>
                  <div className="crop-navigation-scroll" ref={scrollRef}>
                    {crops.map((crop) => (
                      <CropCard
                        key={crop.id}
                        cropName={crop.cropName}
                        onClick={() => handleCropSelection(crop.id, crop.cropName)}
                        isSelected={selectedCropId === crop.id}
                      />
                    ))}
                  </div>
                  <button className="arrow-button" onClick={scrollRight}>
                    {'>'}
                  </button>
                </CropNavigation>
                {tasks.length === 0 && <NoTasksMessage>No tienes tareas asignadas.</NoTasksMessage>}
              </>
            )}
          </Content>
        </ContainerBox>
      </Container>

      {tasks.length > 0 && (
        <TableroKanban
          tasks={tasks}
          onTaskUpdate={(taskId, newStatusId) =>
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === taskId ? { ...task, estado_id: newStatusId } : task
              )
            )
          }
          selectedCropName={selectedCropName}
        />
      )}
    </div>
  );
};

export default Tasks;
