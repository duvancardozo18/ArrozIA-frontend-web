// src/components/tasks/TarjetaTarea.jsx

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TarjetaTarea = ({ task, index }) => (
  <Draggable draggableId={task.id.toString()} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{ ...styles.card, ...provided.draggableProps.style }}
      >
        <h4>{task.name}</h4>
        <p>{task.description}</p>
        <p><strong>Fecha de inicio:</strong> {task.startDate}</p>
        {task.status === 'Completada' && (
          <p><strong>Fecha de finalización:</strong> {task.completionDate}</p>
        )}
      </div>
    )}
  </Draggable>
);

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default TarjetaTarea;
