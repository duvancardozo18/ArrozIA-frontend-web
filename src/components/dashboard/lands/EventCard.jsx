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

const getLaborIcon = (laborType, isMecanizable) => {
  if (isMecanizable) {
    return <FaTractor />; // Ícono de mecanización para labores mecanizables
  }

  switch (laborType) {
    case 'siembra':
      return <FaSeedling />;
    case 'riego':
      return <FaWater />;
    case 'fumigacion':
      return <FaBug />;
    default:
      return <FaSeedling />; // Ícono por defecto si no se encuentra el tipo
  }
};

// Componente de tarjeta de evento
const EventCard = ({ title, start, end, userName, isMecanizable }) => {
  console.log('Nombre del usuario recibido en EventCard:', userName); // Log para verificar el nombre del usuario
  return (
    <Card>
      <LeftColumn>
        {/* Dependiendo de si la tarea es mecanizable o no, mostramos un ícono diferente */}
        <IconWrapper>{getLaborIcon(title, isMecanizable)}</IconWrapper>
        <EventDate>{`Fecha de Inicio: ${start}`}</EventDate>
        <EventDate>{`Fecha de Finalización: ${end}`}</EventDate>
      </LeftColumn>
      <RightColumn>
        <EventDescription>{`Labor Cultural: ${title}`}</EventDescription>
        <Responsible>{`Responsable: ${userName}`}</Responsible>
      </RightColumn>
    </Card>
  );
};

const EventList = ({ events = [] }) => {
  const [eventsWithDetails, setEventsWithDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuarios y labores culturales
        const [usersResponse, laborsResponse] = await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get("/labor-cultural/read")
        ]);

        const users = usersResponse.data;
        const labors = laborsResponse.data;

        // Mapear eventos con los nombres de usuario y labor cultural correspondientes
        const updatedEvents = events.map((event) => {
          const user = users.find((u) => u.id === event.usuario_id);
          const userName = user ? user.nombre : 'Desconocido';

          const labor = labors.find((l) => l.id === event.labor_cultural_id);
          const laborName = labor ? labor.nombre : 'Labor desconocida';

          return {
            ...event,
            responsable: userName,
            laborCultural: laborName, // Asigna el nombre de la labor cultural
            start: new Date(event.start).toLocaleDateString(),
            end: new Date(event.end).toLocaleDateString(),
            isMecanizable: event.es_mecanizable, // Añadir esMecanizable al evento
          };
        });

        setEventsWithDetails(updatedEvents);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [events]);

  return (
    <Container>
      <Title>Labores Pendientes</Title>
      <CardGrid>
        {eventsWithDetails.length > 0 ? (
          eventsWithDetails.map((event, index) => (
            <EventCard
              key={index}
              title={event.laborCultural} // Usando el nombre de la labor cultural en lugar de title
              start={event.start}
              end={event.end}
              userName={event.responsable} // Usando responsable para mostrar el nombre del usuario
              isMecanizable={event.isMecanizable} // Pasando isMecanizable como prop
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