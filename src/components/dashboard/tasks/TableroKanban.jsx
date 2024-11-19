import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import axiosInstance from '../../../config/AxiosInstance';
import styled from 'styled-components';

// Contenedor principal del tablero
const BoardContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

// Título principal
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    text-align: center;
  }
`;

// Contenedor de columnas
const Columns = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  flex: 1;
  padding: 15px;
  border-radius: 10px;
  min-height: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: ${({ statusId }) =>
    statusId === '1' ? '#fbe9e7' : statusId === '2' ? '#fff8e1' : '#e8f5e9'};
  border: 1px solid ${({ statusId }) =>
    statusId === '1' ? '#ffccbc' : statusId === '2' ? '#ffe0b2' : '#c8e6c9'};

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: ${({ statusId }) =>
      statusId === '1' ? '#d84315' : statusId === '2' ? '#ff8f00' : '#388e3c'};
    margin-bottom: 20px; /* Espaciado inferior */
    padding-bottom: 10px;
    border-bottom: 2px solid
      ${({ statusId }) =>
        statusId === '1'
          ? 'rgba(216, 67, 21, 0.5)'
          : statusId === '2'
          ? 'rgba(255, 143, 0, 0.5)'
          : 'rgba(56, 142, 60, 0.5)'}; /* Color opaco */

    @media (max-width: 480px) {
      font-size: 18px;
      text-align: center;
    }
  }
`;



// Mensaje de no tareas
const NoTasksMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #6c757d;
  margin-top: 40px;
  font-style: italic;
`;

const TableroKanban = ({ tasks, onTaskUpdate, selectedCropName }) => {
  // Clasificar tareas por estado
  const tasksByStatus = {
    1: tasks.filter((task) => task.estado_id === 1), // Pendiente
    2: tasks.filter((task) => task.estado_id === 2), // En Progreso
    3: tasks.filter((task) => task.estado_id === 3), // Completada
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

        console.log('Respuesta del backend:', response.data);

        // Actualizar el estado en el frontend
        onTaskUpdate(taskId, newStatusId);
      } catch (error) {
        console.error('Error al actualizar la tarea:', error);
      }
    }
  };

  return (
    <BoardContainer>
      <Title>
        Mis Tareas {selectedCropName && <span>- {selectedCropName}</span>}
      </Title>

      {tasks.length === 0 ? (
        <NoTasksMessage>
          NO tienes tareas asignadas.
        </NoTasksMessage>
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
                    <h3>
                      {statusId === '1'
                        ? 'Pendiente'
                        : statusId === '2'
                        ? 'En Progreso'
                        : 'Completada'}
                    </h3>
                    {tasksByStatus[statusId].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
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
