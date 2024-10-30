import React from 'react';
import styled from 'styled-components';
import { FaTractor, FaSeedling, FaWater, FaBug } from 'react-icons/fa';

// Styled-components para estilizar el contenedor de eventos y las tarjetas
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Card = styled.div`
  width: 400px;
  padding: 20px;
  margin: 15px;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-right: 15px;
  border-right: 1px solid #ddd;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 2;
  padding-left: 15px;
`;

const EventTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const EventDate = styled.p`
  font-size: 1em;
  color: #777;
`;

const EventDescription = styled.p`
  font-size: 1em;
  color: #333;
`;

const Responsible = styled.p`
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1em;
  margin-top: 10px;
  width: fit-content;
`;

const IconWrapper = styled.div`
  font-size: 2.5em;
  margin-bottom: 10px;
`;

// Componente de íconos personalizados para cada labor
const getLaborIcon = (laborType) => {
  switch (laborType) {
    case 'siembra':
      return <FaSeedling />;
    case 'riego':
      return <FaWater />;
    case 'fumigacion':
      return <FaBug />;
    case 'mecanizacion':
      return <FaTractor />;
    default:
      return <FaSeedling />; // Ícono por defecto si no se encuentra el tipo
  }
};

// Componente de tarjeta de evento
// Componente de tarjeta de evento
const EventCard = ({ cultivoId, descripcion, fechaEstimada, fechaRealizacion, esMecanizable, planeadaAutomaticamente }) => {
  return (
    <Card>
      <LeftColumn>
        {/* Dependiendo de si la tarea es mecanizable o no, mostramos un ícono diferente */}
        <IconWrapper>{esMecanizable ? <FaTractor /> : <FaSeedling />}</IconWrapper>
        <EventDate>{`Estimada: ${fechaEstimada}`}</EventDate>
        <EventDate>{`Realizada: ${fechaRealizacion}`}</EventDate>
      </LeftColumn>
      <RightColumn>
        <EventTitle>{`Cultivo ID: ${cultivoId}`}</EventTitle>
        <EventDescription>{descripcion}</EventDescription>
        <Responsible>{`Automáticamente Planeada: ${planeadaAutomaticamente ? 'Sí' : 'No'}`}</Responsible>
      </RightColumn>
    </Card>
  );
};


// Lista de eventos con valor por defecto para events
// Componente de tarjeta de evento
const EventList = ({ events = [] }) => {
  //console.log(events);
  return (
    <Container>
      <Title>Labores Pendientes</Title>
      <CardGrid>
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={index}
              cultivoId={event.cultivoId}
              descripcion={event.descripcion}
              fechaEstimada={event.fechaEstimada}
              fechaRealizacion={event.fechaRealizacion}
              esMecanizable={event.esMecanizable}
              planeadaAutomaticamente={event.planeadaAutomaticamente}
            />
          ))
        ) : (
          <p>No hay eventos pendientes.</p>
        )}
      </CardGrid>
    </Container>
  );
};



export default EventList;
