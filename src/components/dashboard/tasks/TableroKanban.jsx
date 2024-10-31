// TableroKanban.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';  // Importa el componente de tarjeta de tarea
import axiosInstance from '../../../config/AxiosInstance';

const TableroKanban = ({ tasks, onTaskUpdate }) => {
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
    <div style={styles.boardContainer}>
      <h2 style={styles.title}>Gestión de Tareas</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={styles.columns}>
          {Object.keys(tasksByStatus).map((statusId) => (
            <Droppable key={statusId} droppableId={statusId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    ...styles.column,
                    backgroundColor:
                      statusId === '1'
                        ? '#ffe6e6'
                        : statusId === '2'
                        ? '#fff4cc'
                        : '#e6ffe6',
                  }}
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
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const styles = {
  boardContainer: {
    padding: '20px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  columns: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  column: {
    flex: 1,
    padding: '15px',
    borderRadius: '8px',
    minHeight: '400px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
};

export default TableroKanban;
