// MyCalendarPage.jsx
import React, { useState } from 'react';
import CalendarComponent from './CalendarComponent';
import VegetativeCycle from './VegetativeCycle';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #007bff; /* Azul */
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #0056b3; /* Azul más oscuro al hacer hover */
    transform: translateY(-3px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 10px 3px rgba(0, 123, 255, 0.4);
  }
`;

const MyCalendarPage = () => {
  const [showVegetativeCycle, setShowVegetativeCycle] = useState(false);

  return (
    <div>
      <StyledButton onClick={() => setShowVegetativeCycle(!showVegetativeCycle)}>
        {showVegetativeCycle ? 'Mostrar Calendario' : 'Mostrar Ciclo Vegetativo'}
      </StyledButton>

      {showVegetativeCycle ? <VegetativeCycle /> : <CalendarComponent />}
    </div>
  );
};

export default MyCalendarPage;
