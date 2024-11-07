/*import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
//import axiosInstance from '../../../config/AxiosInstance';

const DiagnosisDetailView = ({ diagnosisId, open, onClose }) => {
  const [diagnosisDetails, setDiagnosisDetails] = useState(null);

  useEffect(() => {
    if (diagnosisId) {
      const fetchDiagnosisDetails = async () => {
        try {
          const response = await axiosInstance.get(`/diagnosis/${diagnosisId}`);
          setDiagnosisDetails(response.data);
        } catch (error) {
          console.error('Error fetching diagnosis details:', error);
        }
      };

      fetchDiagnosisDetails();
    }
  }, [diagnosisId]);

  if (!diagnosisDetails) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalles del Diagnóstico</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Imágenes Analizadas</Typography>
        <Grid container spacing={2}>
          {diagnosisDetails.images.map((image, index) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={image.url}
                  alt={`Imagen ${index + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Problemas Detectados</Typography>
        {diagnosisDetails.problems.map((problem, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="subtitle1">Nombre del Problema: {problem.nombre_problema}</Typography>
              <Typography variant="body2">Porcentaje de Confianza: {problem.porcentaje_confianza}%</Typography>
            </CardContent>
          </Card>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosisDetailView;*/

// DiagnosisDetailView.jsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
// import axiosInstance from '../../../config/AxiosInstance';

const DiagnosisDetailView = ({ diagnosisId, open, onClose }) => {
  const [diagnosisDetails, setDiagnosisDetails] = useState(null);

  useEffect(() => {
    if (diagnosisId) {
      // Datos simulados para pruebas
      const simulatedData = {
        images: [
          { url: 'https://via.placeholder.com/140' },
          { url: 'https://via.placeholder.com/140' },
          { url: 'https://via.placeholder.com/140' },
        ],
        problems: [
          { nombre_problema: 'Plaga', porcentaje_confianza: 85 },
          { nombre_problema: 'Enfermedad', porcentaje_confianza: 90 },
          { nombre_problema: 'Deficiencia', porcentaje_confianza: 75 },
        ],
      };

      // Simula una carga de datos en lugar de la llamada al backend
      setDiagnosisDetails(simulatedData);
    }
  }, [diagnosisId]);

  if (!diagnosisDetails) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalles del Diagnóstico</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Imágenes Analizadas</Typography>
        <Grid container spacing={2}>
          {diagnosisDetails.images.map((image, index) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={image.url}
                  alt={`Imagen ${index + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Problemas Detectados</Typography>
        {diagnosisDetails.problems.map((problem, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="subtitle1">Nombre del Problema: {problem.nombre_problema}</Typography>
              <Typography variant="body2">Porcentaje de Confianza: {problem.porcentaje_confianza}%</Typography>
            </CardContent>
          </Card>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosisDetailView;

