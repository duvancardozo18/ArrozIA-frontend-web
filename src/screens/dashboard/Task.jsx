import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/dashboard/Header';
import { AuthContext } from '../../config/AuthProvider';
import { Navigate } from 'react-router-dom';
import CropCard from '../../components/dashboard/tasks/CropCard';
import TableroKanban from '../../components/dashboard/tasks/TableroKanban';
import styled from 'styled-components';
import axiosInstance from '../../config/AxiosInstance';

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const Sidebar = styled.div`
  width: 30%;
  padding-right: 20px;
  border-right: 1px solid #ddd;
`;

const Content = styled.div`
  width: 70%;
  padding-left: 20px;
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

const NoTasksMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-top: 20px;
`;

const Tasks = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCropName, setSelectedCropName] = useState(''); // Estado para el nombre del cultivo
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es administrador
  const checkIfAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/is_admin`);
      setIsAdmin(response.data.is_admin); // Usar la respuesta para determinar si es admin
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
      console.log('Fincas obtenidas:', response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  useEffect(() => {
    checkIfAdmin(); // Verificar si el usuario es administrador al cargar el componente
  }, []);

  useEffect(() => {
    if (isAdmin !== null) { // Esperar a que se determine el rol del usuario
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
        console.log(`Cultivos obtenidos para la finca ${selectedFarmId}:`, response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCropsForFarm();
  }, [selectedFarmId]);

  // Obtener tareas relacionadas al cultivo seleccionado
  useEffect(() => {
    const fetchTasksForCrop = async () => {
      if (!selectedCropId) return;

      try {
        const response = await axiosInstance.get(`/crops/${selectedCropId}/tasks`);
        setTasks(response.data);
        console.log(`Tareas obtenidas para el cultivo ${selectedCropId}:`, response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setTasks([]); // Limpiar tareas si no hay ninguna
        } else {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchTasksForCrop();
  }, [selectedCropId]);

  const handleFarmSelection = (event) => {
    const farmId = event.target.value;
    console.log('Finca seleccionada:', farmId);
    setSelectedFarmId(farmId);
    setSelectedCropId(null);
    setSelectedCropName(''); // Limpiar el nombre del cultivo al cambiar finca
    setCrops([]);
    setTasks([]);
  };

  const handleCropSelection = (cropId, cropName) => {
    console.log('Cultivo seleccionado:', cropId);
    setSelectedCropId(cropId);
    setSelectedCropName(cropName); // Actualizar el nombre del cultivo seleccionado
  };

  const updateTaskStatusInState = (taskId, newStatusId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, estado_id: newStatusId } : task
      )
    );
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Tareas" />
      <Container>
        <Sidebar>
          <h2>Fincas</h2>
          <StyledSelect onChange={handleFarmSelection} value={selectedFarmId || ''}>
            <option value="" disabled>Selecciona una finca</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.nombre}</option>
            ))}
          </StyledSelect>

          {selectedFarmId && (
            <>
              <h2 style={{ marginTop: '20px' }}>Cultivos</h2>
              {crops.map((crop) => (
                <CropCard
                  key={crop.id}
                  cropName={crop.cropName}
                  onClick={() => handleCropSelection(crop.id, crop.cropName)} // Pasa el nombre del cultivo
                  isSelected={selectedCropId === crop.id}
                />
              ))}
            </>
          )}
        </Sidebar>
        <Content>
          {tasks.length === 0 ? (
            <NoTasksMessage>Este cultivo no tiene tareas disponibles.</NoTasksMessage>
          ) : (
            <TableroKanban tasks={tasks} onTaskUpdate={updateTaskStatusInState} selectedCropName={selectedCropName} />
          )}
        </Content>
      </Container>
    </div>
  );
};

export default Tasks;
