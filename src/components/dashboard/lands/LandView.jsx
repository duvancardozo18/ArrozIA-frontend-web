import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';
import NewCrop from '../crops/CreateCropModal';
import LoanMessage from './LoanMessage';
import Calendar from './MyCalendarPage';
import EventCard from './EventCard';
import TaskDialog from './TaskDialog';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SpaIcon from '@mui/icons-material/Spa';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  && {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    color: white;
    background-color: #007bff; /* Azul */
    &:hover {
      background-color: #0056b3;
    }
  }
`;

const GreenButton = styled(Button)`
  && {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    color: white;
    background-color: #28a745;
    &:hover {
      background-color: #218838;
    }
  }
`;

const ViewLand = ({ onSelectAllotment }) => {
  const { loteId } = useParams();
  const [landDetails, setLandDetails] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);
  const [taskEvents, setTaskEvents] = useState([]);
  const [isCreateCropModalOpen, setIsCreateCropModalOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [showVegetativeCycle, setShowVegetativeCycle] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const [cultivoNombre, setCultivoNombre] = useState('');
  const [cultivoId, setCultivoId] = useState(null);

  useEffect(() => {
    const fetchLandAndCropDetails = async () => {
      try {
        const landResponse = await axiosInstance.get(`/land/${loteId}`);
        setLandDetails(landResponse.data);

        const cropResponse = await axiosInstance.get(`/crops/by_land/${loteId}`);
        setCropDetails(cropResponse.data);

        if (cropResponse.data.length > 0) {
          setCultivoNombre(cropResponse.data[0].cropName);
          setCultivoId(cropResponse.data[0].id);
        }

        const taskResponse = await axiosInstance.get(`/taskslist`);
        setTaskEvents(taskResponse.data);
      } catch (error) {
        console.error('Error fetching land, crop, or task details:', error);
      }
    };

    fetchLandAndCropDetails();
  }, [loteId]);

  const handleOpenTaskDialog = () => {
    setIsTaskDialogOpen(true);
  };

  const onAddLote = () => {
    const lote = { id: loteId, nombre: `${loteId}` };
    setSelectedLote(lote);
    setIsCreateCropModalOpen(true);
  };

  const handleToggleVegetativeCycle = () => {
    setShowVegetativeCycle((prev) => !prev);
  };

  if (!landDetails || !cropDetails) {
    return <div>No se encontró información válida</div>;
  }

  return (
    <div>
      <h1>{landDetails.nombre}</h1>
      <p>Finca: {landDetails.finca_id}</p>

      {cropDetails?.length === 0 ? (
        <>
          <ButtonContainer>
            <GreenButton onClick={onAddLote}>Crear Cultivo</GreenButton>
          </ButtonContainer>
          <LoanMessage />
        </>
      ) : (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {cropDetails[0].cropName}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4} container direction="column" alignItems="center">
                <SpaIcon sx={{ fontSize: 40 }} color="primary" />
                <Typography variant="body1" color="textSecondary" align="center">
                  Variedad: {cropDetails[0].varietyId || 'Desconocida'}
                </Typography>
              </Grid>
              <Grid item xs={4} container direction="column" alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 40 }} color="secondary" />
                <Typography variant="body1" color="textSecondary" align="center">
                  Fecha de siembra: {cropDetails[0].plantingDate}
                </Typography>
              </Grid>
              <Grid item xs={4} container direction="column" alignItems="center">
                <EventAvailableIcon sx={{ fontSize: 40 }} color="success" />
                <Typography variant="body1" color="textSecondary" align="center">
                  Fecha estimada de cosecha: {cropDetails[0].estimatedHarvestDate}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <ButtonContainer>
        <GreenButton onClick={handleOpenTaskDialog}>Asignar Labor</GreenButton>
        
      </ButtonContainer>

      {isTaskDialogOpen && (
        <TaskDialog
          open={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          onSave={(taskData) => console.log("Tarea guardada:", taskData)}
          cultivoNombre={cultivoNombre}
          cultivoId={cultivoId}
        />
      )}

      {isCreateCropModalOpen && selectedLote && (
        <NewCrop 
          selectedAllotment={selectedLote}
          closeModal={() => setIsCreateCropModalOpen(false)}
        />
      )}

      {cropDetails.length > 0 && (
        <>
          <Calendar />
          <EventCard events={taskEvents} />
        </>
      )}

      
    </div>
  );
};

export default ViewLand;
