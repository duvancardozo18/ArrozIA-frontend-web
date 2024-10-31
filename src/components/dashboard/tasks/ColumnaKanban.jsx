// ColumnaKanban.jsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const TaskCard = styled.div`
  padding: 10px;
  margin: 8px 0;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColumnaKanban = ({ title, tasks }) => {
  return (
    <div>
      <h3>{title}</h3>
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
          {(provided) => (
            <TaskCard
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <p>{task.descripcion}</p>
            </TaskCard>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default ColumnaKanban;
