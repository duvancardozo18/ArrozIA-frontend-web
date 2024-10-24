import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';
import NewCrop from '../crops/CreateCropModal';
import LoanMessage from './LoanMessage';
import Calendar from './Calendar';
import EventCard from './EventCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SpaIcon from '@mui/icons-material/Spa';
import TaskIcon from '@mui/icons-material/Task';

const buttonCreate = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginBottom: '20px', 
  marginTop: '20px',
  marginLeft: 'auto',
  marginRight: '30px',
  display: 'block',
};

const CropView = () => {
  const { loteId } = useParams();  // Puedes agregar otros parámetros si son necesarios
  const [landDetails, setLandDetails] = useState(null); // Datos del lote
  const [cropDetails, setCropDetails] = useState(null); // Datos de cultivos
  const [taskEvents, setTaskEvents] = useState([]); // Datos de eventos obtenidos de /tasks
  const [isCreateCropModalOpen, setIsCreateCropModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);

  const onAddLote = () => {
    const lote = { id: loteId, nombre: `${loteId}` };
    setSelectedLote(lote);
    setIsCreateCropModalOpen(true);
  };

  useEffect(() => {
    // 1. Obtener detalles del lote
    const fetchLandDetails = async () => {
      try {
        const landResponse = await axiosInstance.get(`/land/${loteId}`);
        setLandDetails(landResponse.data);
        
        // 2. Obtener los cultivos asociados con el loteId
        const cropResponse = await axiosInstance.get(`/crops/by_land/${loteId}`);
        setCropDetails(cropResponse.data);

        // 3. Obtener eventos de tareas desde la ruta /tasks
        const taskResponse = await axiosInstance.get(`/tasks`);
        console.log(taskResponse.data);
        setTaskEvents(taskResponse.data); // Asignar los eventos de la tarea
      } catch (error) {
        console.error('Error fetching land, crop, or task details:', error);
      }
    };

    fetchLandDetails();
  }, [loteId]);

  if (!landDetails || !cropDetails) {
    return <div>No se encontró información válida</div>;
  }

  return (
    <div>
      {/* Mostrar información del lote */}
      <h1>{landDetails.nombre}</h1>
      <p>Finca: {landDetails.finca_id}</p>

      {/* Mostrar botón y LoanMessage solo si no hay cultivos */}
      {cropDetails?.length === 0 ? (
        <>
          <button style={buttonCreate} onClick={onAddLote}>
            Crear Cultivo
          </button>
          <LoanMessage />
        </>
      ) : (
        // Mostrar la tarjeta si hay cultivos
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

      {/* Mostrar el modal de crear cultivo */}
      {isCreateCropModalOpen && selectedLote && (
        <NewCrop 
          selectedAllotment={selectedLote}
          closeModal={() => setIsCreateCropModalOpen(false)}
        />
      )}

      {/* Mostrar calendario y tarjetas de eventos */}
      {cropDetails.length > 0 && (
        <>
          <Calendar />
          <EventCard events={taskEvents} />
        </>
      )}

    </div>
  );
};

export default CropView;
