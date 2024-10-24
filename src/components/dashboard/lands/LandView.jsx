import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';
import NewCrop from '../crops/CreateCropModal';
import LoanMessage from './LoanMessage';
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

const CropView = () => {
  const { loteId } = useParams();  
  const [landDetails, setLandDetails] = useState(null); // Datos del lote
  const [cropDetails, setCropDetails] = useState(null); // Datos de cultivos
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
        
        // 2. Con el loteId, obtener los cultivos asociados
        const cropResponse = await axiosInstance.get(`/crops/by_land/${loteId}`);
        setCropDetails(cropResponse.data);
      } catch (error) {
        console.error('Error fetching land or crop details:', error);
      }
    };

    fetchLandDetails();
  }, [loteId]);

  if (!landDetails || !cropDetails) {
    return <div>Cargando información del lote y cultivos...</div>;
  }

  return (
    <div>
      {/* Mostrar información del lote */}
      <h1>{landDetails.nombre}</h1>
      <p>Finca: {landDetails.finca_id}</p>

      {/* Mostrar botón y LoanMessage solo si no hay cultivos */}
      {cropDetails.length === 0 ? (
        <>
          <button style={buttonCreate} onClick={onAddLote}>
            Crear Cultivo
          </button>
          <LoanMessage />
        </>
      ) : (
        // Mostrar la tarjeta si hay cultivos
        <Card  sx={{ mt: 4 }}>
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
    </div>
  );
};

export default CropView;
