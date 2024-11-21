import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';
import NewCrop from '../crops/CreateCropModal';
import LoanMessage from './LoanMessage';
import VegetativeCard from '../vegetativecycle/VegetativeCard';
import CalendarComponent from './CalendarComponent';
import EventCard from './EventCard';
import TaskDialog from './TaskDialog';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SpaIcon from '@mui/icons-material/Spa';
import styled from 'styled-components';
import HarvestForm from '../lands/HarvestForm';
import ExpensesForm from '../lands/ExpensesForm';
import CostsDataTable from '../lands/CostsDataTable';
import HarvestsDataTable from '../lands/HarvestsDataTable';

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
    background-color: #007bff;
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
  const [selectedLote, setSelectedLote] = useState(null);
  const [activeSection, setActiveSection] = useState('laboresCulturales');
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
          const fetchedCropId = cropResponse.data[0].id;
          setCultivoNombre(cropResponse.data[0].cropName);
          setCultivoId(fetchedCropId);

          const taskResponse = await axiosInstance.get(`/crops/${fetchedCropId}/tasks`);
          const formattedTasks = taskResponse.data.map((task) => ({
            title: task.descripcion,
            start: new Date(task.fecha_estimada),
            end: new Date(task.fecha_estimada),
            id: task.id,
            usuario_id: task.usuario_id, // Añadir el usuario_id
            labor_cultural_id: task.labor_cultural_id,
            es_mecanizable: task.es_mecanizable, // Añadir es_mecanizable
          }));
          setTaskEvents(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching land, crop, or task details:', error);
      }
    };

    fetchLandAndCropDetails();
  }, [loteId]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const plantingDate = cropDetails?.length > 0 ? cropDetails[0].plantingDate : null;

  const handleOpenTaskDialog = () => {
    setIsTaskDialogOpen(true);
  };

  const onAddLote = () => {
    const lote = { id: loteId, nombre: `${loteId}` };
    setSelectedLote(lote);
    setIsCreateCropModalOpen(true);
  };

  if (!landDetails || !cropDetails) {
    return <div>No se encontró información válida</div>;
  }

  console.log('Tareas enviadas a EventCard desde ViewLand:', taskEvents); // Log para verificar las tareas enviadas a EventCard

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
        <StyledButton
          onClick={() => handleSectionChange('laboresCulturales')}
          variant={activeSection === 'laboresCulturales' ? 'contained' : 'outlined'}
        >
          Labores Culturales
        </StyledButton>
        <StyledButton
          onClick={() => handleSectionChange('cicloVegetativo')}
          variant={activeSection === 'cicloVegetativo' ? 'contained' : 'outlined'}
        >
          Ciclo Vegetativo
        </StyledButton>
        <StyledButton
          onClick={() => handleSectionChange('gastos')}
          variant={activeSection === 'gastos' ? 'contained' : 'outlined'}
        >
          Gastos
        </StyledButton>
        <StyledButton
          onClick={() => handleSectionChange('cosecha')}
          variant={activeSection === 'cosecha' ? 'contained' : 'outlined'}
        >
          Cosecha
        </StyledButton>
      </ButtonContainer>

      {activeSection === 'laboresCulturales' && (
        <>
          <ButtonContainer>
            <GreenButton onClick={handleOpenTaskDialog}>Asignar Labor</GreenButton>
          </ButtonContainer>
          <CalendarComponent events={taskEvents} />
          <EventCard events={taskEvents} />
        </>
      )}
      {activeSection === 'cicloVegetativo' && <VegetativeCard plantingDate={plantingDate} />}
      {activeSection === 'gastos' && (
        <>
          <ExpensesForm cultivoId={cultivoId} />
          <CostsDataTable cultivoId={cultivoId} />
        </>
      )}
      {activeSection === 'cosecha' && (
        <>
          <HarvestForm cultivoId={cultivoId} />
          <HarvestsDataTable cultivoId={cultivoId} />
        </>
      )}

      {isTaskDialogOpen && (
        <TaskDialog
          open={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          onSave={(taskData) => console.log('Tarea guardada:', taskData)}
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
    </div>
  );
};

export default ViewLand;