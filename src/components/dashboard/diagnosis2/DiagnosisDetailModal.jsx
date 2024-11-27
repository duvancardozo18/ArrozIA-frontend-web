import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoBase64 from './../../../assets/images/logoBase64';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const recommendations = {
  leaf_blast: {
    name: 'Tizón de la hoja',
    description:
      'Es una enfermedad fúngica que afecta principalmente a las hojas jóvenes, causando manchas marrones y necrosis. Si no se controla, puede reducir significativamente el rendimiento del cultivo.',
    recommendation:
      'Aplique fungicidas específicos como Triciclazol o Isoprotiolano. Mejore la ventilación en el campo, reduzca el exceso de fertilización nitrogenada y elimine restos de cultivos infectados.',
  },
  sheath_blight: {
    name: 'Añublo de la vaina',
    description:
      'Una enfermedad causada por el hongo *Rhizoctonia solani*, que ataca principalmente la base de las plantas. Puede extenderse rápidamente en condiciones de alta humedad.',
    recommendation:
      'Use fungicidas sistémicos como Validamicina o Propiconazol. Evite el exceso de fertilizantes y asegúrese de que el agua de riego no permanezca estancada por mucho tiempo.',
  },
  bacterial_leaf_blight: {
    name: 'Tizón bacteriano de la hoja',
    description:
      'Causada por la bacteria *Xanthomonas oryzae*, esta enfermedad provoca lesiones amarillas o marrones en las hojas, lo que afecta la fotosíntesis y el crecimiento del cultivo.',
    recommendation:
      'Utilice variedades resistentes a la bacteria. Realice rotaciones de cultivo y aplique productos a base de cobre. Mantenga un drenaje adecuado en el campo.',
  },
  brown_spot: {
    name: 'Mancha marrón',
    description:
      'Un problema asociado a deficiencias de nutrientes, especialmente potasio, que puede reducir la calidad y el rendimiento de los granos.',
    recommendation:
      'Corrija las deficiencias nutricionales con fertilizantes adecuados, especialmente potasio. Reduzca el estrés hídrico y mejore las prácticas de manejo de suelo.',
  },
  healthy: {
    name: 'Sin problemas detectados',
    description:
      'El cultivo no presenta signos de enfermedades o problemas detectados.',
    recommendation:
      'Continúe con las prácticas actuales de manejo. Monitoree regularmente el cultivo para identificar cualquier problema a tiempo.',
  },
};

const DiagnosisDetailModal = ({ open, onClose, diagnosis, cropName, chartData, chartOptions }) => {
  if (!diagnosis) return null;

  const recommendation = recommendations[diagnosis.tipo_problema] || {
    name: 'Problema desconocido',
    description: 'No hay información disponible para este problema.',
    recommendation: 'Consulte a un experto agrícola para más detalles.',
  };

  const exportPDF = () => {
    if (!diagnosis) {
      alert("No hay datos del diagnóstico seleccionados para exportar.");
      return;
    }
  
    const doc = new jsPDF();
  
    // Logo en la esquina superior izquierda
    const logoWidth = 30;
    const logoHeight = 30;
    doc.addImage(logoBase64, 'PNG', 10, 10, logoWidth, logoHeight);
  
    // Fecha en la esquina superior derecha
    doc.setFontSize(10);
    doc.setTextColor(100); // Gris
    const fechaActual = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fechaActual}`, 190, 10, { align: 'right' });
  
    // Título principal
    doc.setFontSize(20);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(22, 160, 133); // Verde
    doc.text('Arroz IA', 105, 20, { align: 'center' });
  
    // Subtítulo
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Negro
    doc.text('Resultados del Diagnóstico', 105, 30, { align: 'center' });
  
    // Línea separadora
    doc.line(20, 35, 190, 35);
  
    // Gráfica del diagnóstico
    const canvas = document.querySelector('canvas'); // Busca el canvas de la gráfica en la vista
    if (canvas) {
      const chartImage = canvas.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 15, 40, 180, 80); // Gráfica en la parte superior
    }
  
    // Información general (bajo la gráfica)
    const generalInfoY = canvas ? 130 : 40; // Ajustar posición según si hay gráfica
    const generalInfo = [
      { campo: 'Nombre del Cultivo', valor: cropName },
      { campo: 'Confianza', valor: `${(diagnosis.confianza_promedio * 10).toFixed(2)}%` },
      { campo: 'Fecha del Diagnóstico', valor: new Date(diagnosis.fecha_diagnostico).toLocaleDateString() },
      { campo: 'Tipo de Problema', valor: recommendation.name },
    ];
  
    doc.autoTable({
      head: [['Campo', 'Valor']],
      body: generalInfo.map((info) => [info.campo, info.valor]),
      startY: generalInfoY,
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }, // Verde
      bodyStyles: { fillColor: [240, 248, 255] }, // Blanco
    });
  
    // Reutilizable para descripción y recomendaciones
    const addSection = (y, title, text) => {
      doc.setFontSize(14);
      doc.setTextColor(22, 160, 133); // Verde
      doc.setFont('Helvetica', 'bold');
      doc.text(title, 20, y);
  
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(0, 0, 0); // Negro
      doc.text(text, 20, y + 10, { maxWidth: 170 });
    };
  
    // Descripción del problema
    const descriptionY = doc.lastAutoTable.finalY + 10;
    addSection(descriptionY, 'Descripción del Problema:', recommendation.description);
  
    // Recomendaciones
    const recommendationY = descriptionY + 30;
    addSection(recommendationY, 'Recomendación:', recommendation.recommendation);
  
    // Guardar el PDF
    doc.save(`diagnostico_${diagnosis.id}.pdf`);
  };
  
  
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxWidth: '800px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Detalles del Diagnóstico
        </Typography>

        {/* Información General */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Nombre del Cultivo:</strong> {cropName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Confianza:</strong>{' '}
              {diagnosis.confianza_promedio
                ? `${(diagnosis.confianza_promedio * 10).toFixed(2)}%`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Fecha:</strong>{' '}
              {diagnosis.fecha_diagnostico
                ? new Date(diagnosis.fecha_diagnostico).toLocaleDateString()
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Tipo de Problema:</strong> {recommendation.name}
            </Typography>
          </Grid>
        </Grid>

        {/* Descripción del Problema */}
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Descripción:</strong> {recommendation.description}
        </Typography>

        {/* Recomendación */}
        <Typography variant="body2" sx={{ mb: 3 }}>
          <strong>Recomendación:</strong> {recommendation.recommendation}
        </Typography>

        {/* Gráfica */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Resultados del Diagnóstico
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Acciones */}
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button variant="outlined" onClick={onClose}>
              Cerrar
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={exportPDF}>
              Exportar Detalles a PDF
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default DiagnosisDetailModal;
