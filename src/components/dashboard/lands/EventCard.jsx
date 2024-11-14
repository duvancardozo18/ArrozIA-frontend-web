import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTractor, FaSeedling, FaWater, FaBug } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';

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

const LaborCultural = styled.p`
  font-size: 1em;
  color: #333;
  font-weight: bold;
  margin-top: 10px;
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
const EventCard = ({ title, start, end, userName }) => {
  console.log('Nombre del usuario recibido en EventCard:', userName); // Log para verificar el nombre del usuario
  return (
    <Card>
      <LeftColumn>
        {/* Dependiendo de si la tarea es mecanizable o no, mostramos un ícono diferente */}
        <IconWrapper>{getLaborIcon(title)}</IconWrapper>
        <EventDate>{`Fecha de Inicio: ${start}`}</EventDate>
        <EventDate>{`Fecha de Finalización: ${end}`}</EventDate>
      </LeftColumn>
      <RightColumn>
        <EventDescription>{`Título: ${title}`}</EventDescription>
        <Responsible>{`Responsable: ${userName}`}</Responsible>
      </RightColumn>
    </Card>
  );
};

const EventList = ({ events = [] }) => {
  const [eventsWithUserNames, setEventsWithUserNames] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: users } = await axiosInstance.get("/users"); // Obtener la lista de usuarios

        // Mapear eventos con los nombres de usuario correspondientes
        const updatedEvents = events.map((event) => {
          const user = users.find((u) => u.id === event.usuario_id);
          const userName = user ? user.nombre : 'Desconocido';
          return {
            ...event,
            responsable: userName,
            start: new Date(event.start).toLocaleDateString(),
            end: new Date(event.end).toLocaleDateString(),
          };
        });

        setEventsWithUserNames(updatedEvents);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchUsers();
  }, [events]);

  return (
    <Container>
      <Title>Labores Pendientes</Title>
      <CardGrid>
        {eventsWithUserNames.length > 0 ? (
          eventsWithUserNames.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              start={event.start}
              end={event.end}
              userName={event.responsable} // Usando responsable para mostrar el nombre del usuario
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