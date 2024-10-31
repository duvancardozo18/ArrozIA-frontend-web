// TaskCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  background-color: #f9f9f9;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const TaskContent = styled(CardContent)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
  background-color: ${(props) =>
    props.status === 1 ? '#FF7043' : props.status === 2 ? '#FFCA28' : '#66BB6A'};
  align-self: flex-start;
`;

const FieldContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
`;

const TaskCard = ({ task }) => {
  const { descripcion, fecha_estimada, fecha_realizacion, tiempo_hora, estado_id } = task;

  return (
    <StyledCard>
      <TaskContent>
        <Typography variant="h6" component="div">
          {descripcion || 'Sin descripción'}
        </Typography>
        <StatusBadge status={estado_id}>
          {estado_id === 1 ? 'Pendiente' : estado_id === 2 ? 'En Progreso' : 'Completada'}
        </StatusBadge>
        <Divider style={{ margin: '8px 0' }} />
        <FieldContainer>
          <Typography color="textSecondary">Fecha Estimada:</Typography>
          <Typography>{fecha_estimada}</Typography>
        </FieldContainer>
        <FieldContainer>
          <Typography color="textSecondary">Fecha Realización:</Typography>
          <Typography>{fecha_realizacion || 'No realizada'}</Typography>
        </FieldContainer>
        <FieldContainer>
          <Typography color="textSecondary">Tiempo (Horas):</Typography>
          <Typography>{tiempo_hora || 'No asignado'}</Typography>
        </FieldContainer>
      </TaskContent>
    </StyledCard>
  );
};

export default TaskCard;
