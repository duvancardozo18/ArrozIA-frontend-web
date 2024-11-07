import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import axiosInstance from '../../../config/AxiosInstance';
import styled from 'styled-components';

const BoardContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    text-align: center;
  }
`;

const Columns = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Column = styled.div`
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  min-height: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${({ statusId }) =>
    statusId === '1' ? '#ffe6e6' : statusId === '2' ? '#fff4cc' : '#e6ffe6'};

  h3 {
    margin-bottom: 10px;
    font-size: 18px;

    @media (max-width: 480px) {
      font-size: 16px;
      text-align: center;
    }
  }
`;

const NoTasksMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-top: 40px;
`;

const TableroKanban = ({ tasks, onTaskUpdate, selectedCropName }) => {
  // Clasificar tareas por estado
  const tasksByStatus = {
    1: tasks.filter(task => task.estado_id === 1), // Pendiente
    2: tasks.filter(task => task.estado_id === 2), // En Progreso
    3: tasks.filter(task => task.estado_id === 3), // Completada
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const newStatusId = parseInt(destination.droppableId);
    const taskId = parseInt(draggableId);

    if (newStatusId !== parseInt(source.droppableId)) {
      console.log(`Actualizando tarea ${taskId} al estado ${newStatusId}`);

      // Actualizar el estado en el backend
      try {
        const response = await axiosInstance.put(`/tasks/${taskId}`, {
          estado_id: newStatusId,
        });

        console.log("Respuesta del backend:", response.data);

        // Actualizar el estado en el frontend
        onTaskUpdate(taskId, newStatusId);
      } catch (error) {
        console.error('Error al actualizar la tarea:', error);
      }
    }
  };

  return (
    <BoardContainer>
      <Title>Gestión de Tareas {selectedCropName && `- ${selectedCropName}`}</Title>
      
      {tasks.length === 0 ? (
        <NoTasksMessage>Este cultivo no tiene tareas disponibles.</NoTasksMessage>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Columns>
            {Object.keys(tasksByStatus).map((statusId) => (
              <Droppable key={statusId} droppableId={statusId}>
                {(provided) => (
                  <Column
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    statusId={statusId}
                  >
                    <h3>{statusId === '1' ? 'Pendiente' : statusId === '2' ? 'En Progreso' : 'Completada'}</h3>
                    {tasksByStatus[statusId].map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Column>
                )}
              </Droppable>
            ))}
          </Columns>
        </DragDropContext>
      )}
    </BoardContainer>
  );
};

export default TableroKanban;
