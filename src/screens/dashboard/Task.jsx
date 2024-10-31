// Tasks.jsx
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

const Tasks = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axiosInstance.get('/crops/all');
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, []);

  useEffect(() => {
    const fetchTasksForCrop = async () => {
      if (!selectedCropId) return;

      try {
        const response = await axiosInstance.get(`/crops/${selectedCropId}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasksForCrop();
  }, [selectedCropId]);

  const handleCropSelection = (cropId) => {
    setSelectedCropId(cropId);
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
          <h2>Cultivos</h2>
          {crops.map((crop) => (
            <CropCard
              key={crop.id}
              cropName={crop.cropName}
              onClick={() => handleCropSelection(crop.id)}
            />
          ))}
        </Sidebar>
        <Content>
          <TableroKanban tasks={tasks} onTaskUpdate={updateTaskStatusInState} />
        </Content>
      </Container>
    </div>
  );
};

export default Tasks;
