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

const CropView = ({ onSelectAllotment }) => {
  const { loteId } = useParams();
  const [landDetails, setLandDetails] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);
  const [taskEvents, setTaskEvents] = useState([]);
  const [isCreateCropModalOpen, setIsCreateCropModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);

  useEffect(() => {
    // Obtener detalles del lote y cultivo, y eventos de tareas
    const fetchLandAndCropDetails = async () => {
      try {
        const landResponse = await axiosInstance.get(`/land/${loteId}`);
        setLandDetails(landResponse.data);

        const cropResponse = await axiosInstance.get(`/crops/by_land/${loteId}`);
        setCropDetails(cropResponse.data);

        const taskResponse = await axiosInstance.get(`/tasks`);
        setTaskEvents(taskResponse.data);
      } catch (error) {
        console.error('Error fetching land, crop, or task details:', error);
      }
    };

    fetchLandAndCropDetails();
  }, [loteId]);

  // Llamar a `onSelectAllotment` cuando cropDetails esté disponible
useEffect(() => {
  if (cropDetails && cropDetails.length > 0 && landDetails) {
    const selectedCrop = {
      id: loteId,
      nombre: landDetails.nombre,
      sowingDate: cropDetails[0].plantingDate,
    };

    // Llama a `onSelectAllotment` solo si el nuevo valor es diferente
    if (JSON.stringify(selectedCrop) !== JSON.stringify(selectedLote)) {
      onSelectAllotment(selectedCrop);
      setSelectedLote(selectedCrop); // Actualiza `selectedLote` para comparar en futuras ejecuciones
    }
  }
}, [cropDetails, landDetails, loteId, onSelectAllotment, selectedLote]);


  const onAddLote = () => {
    const lote = { id: loteId, nombre: `${loteId}` };
    setSelectedLote(lote);
    setIsCreateCropModalOpen(true);
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
          <button style={buttonCreate} onClick={onAddLote}>
            Crear Cultivo
          </button>
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

export default CropView;
