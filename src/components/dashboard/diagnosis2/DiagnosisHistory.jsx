import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Modal, Box, Checkbox, Grid, TextField, Select, MenuItem, Pagination } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import DiagnosisDetailModal from './DiagnosisDetailModal';
import logoBase64 from './../../../assets/images/logoBase64';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const DiagnosisHistory = ({ selectedCrop, cropName }) => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [openComparison, setOpenComparison] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [problemType, setProblemType] = useState('');

  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Máximo de elementos por página

  // Cargar historial de diagnósticos para el cultivo seleccionado con filtros
  const fetchDiagnoses = async () => {
    if (!selectedCrop) return;
  
    const params = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(problemType && { problem_type: problemType }),
    };
  
    try {
      const response = await axiosInstance.get(`/diagnostics/history/${selectedCrop}`, { params });
      const translatedDiagnoses = response.data.map((diagnosis) => ({
        ...diagnosis,
        translatedProblemType: translationMap[diagnosis.tipo_problema] || 'Otro', // Traducción del tipo de problema
      }));
      setDiagnoses(translatedDiagnoses);
    } catch (error) {
      console.error('Error fetching diagnosis history:', error);
    }
  };
  
  
  

  useEffect(() => {
    fetchDiagnoses();
  }, [selectedCrop]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchDiagnoses();
  };

  const handleOpenModal = async (diagnosisId) => {
    try {
      const response = await axiosInstance.get(`/diagnostics/detail/${diagnosisId}`);
      setSelectedDiagnosis(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching diagnosis details:', error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedDiagnosis(null);
  };

  const handleCloseComparisonModal = () => {
    setOpenComparison(false);
    setSelectedDiagnoses([]);
  };

  const handleSelectDiagnosis = (diagnosisId) => {
    setSelectedDiagnoses((prev) =>
      prev.includes(diagnosisId) ? prev.filter((id) => id !== diagnosisId) : [...prev, diagnosisId]
    );
  };

  
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Datos de la gráfica original
  const chartData = {
    labels: diagnoses.map((diagnosis) => new Date(diagnosis.fecha_diagnostico).toLocaleDateString()),
    datasets: [
      {
        label: 'Confianza Promedio',
        data: diagnoses.map((diagnosis) => diagnosis.confianza_promedio * 10),
        fill: false,
        borderColor: '#4caf50',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Confianza Promedio a lo Largo del Tiempo'
      }
    }
  };

  // Comparar dos diagnósticos seleccionados
  const handleCompareDiagnoses = () => {
    if (selectedDiagnoses.length !== 2) {
      alert("Por favor, selecciona exactamente dos diagnósticos para comparar.");
      return;
    }

    setOpenComparison(true);
  };

  const comparisonChartData = () => {
    if (selectedDiagnoses.length !== 2) return null;

    const [firstDiagnosis, secondDiagnosis] = selectedDiagnoses.map(id => diagnoses.find(d => d.id === id));

    return {
      labels: ['Diagnóstico 1', 'Diagnóstico 2'],
      datasets: [
        {
          label: `Diagnóstico ID ${firstDiagnosis.id}`,
          data: [firstDiagnosis.confianza_promedio * 100],
          borderColor: '#42a5f5',
          backgroundColor: '#42a5f5',
        },
        {
          label: `Diagnóstico ID ${secondDiagnosis.id}`,
          data: [secondDiagnosis.confianza_promedio * 100],
          borderColor: '#66bb6a',
          backgroundColor: '#66bb6a',
        }
      ]
    };
  };
  const translationMap = {
    leaf_blast: 'Tizón de la hoja',
    sheath_blight: 'Añublo de la vaina',
    bacterial_leaf_blight: 'Tizón bacteriano de la hoja',
    brown_spot: 'Mancha marrón',
    healthy: 'Sin enfermedades detectadas',
  };
  
  const exportPDF = async () => {
    if (selectedDiagnoses.length === 0) {
      alert("Por favor, selecciona al menos un diagnóstico para exportar.");
      return;
    }
  
    const doc = new jsPDF();
  
    // Logo y encabezado
    const logoWidth = 30;
    const logoHeight = 30;
    doc.addImage(logoBase64, 'PNG', 10, 10, logoWidth, logoHeight); // Logo en la esquina superior izquierda
  
    doc.setFontSize(20);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(22, 160, 133); // Verde
    doc.text('Arroz IA', 105, 20, { align: 'center' }); // Título centrado
  
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Negro
    doc.text('Historial de Diagnósticos', 105, 30, { align: 'center' });
  
    doc.line(20, 35, 190, 35); // Línea separadora
  
    let yOffset = 40; // Posición inicial para los datos
  
    // Iterar sobre los diagnósticos seleccionados para generar el contenido
    for (const diagnosisId of selectedDiagnoses) {
      const diagnosis = diagnoses.find((d) => d.id === diagnosisId);
  
      if (!diagnosis) continue;
  
      const {
        fecha_diagnostico,
        tipo_problema,
        resultado_ia,
        confianza_promedio,
        id,
      } = diagnosis;
  
      // Título del diagnóstico
      doc.setFontSize(14);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Diagnóstico ID: ${id}`, 20, yOffset);
      yOffset += 10;
  
      // Información general en tabla
      const tableData = [
        ['Campo', 'Valor'],
        ['Nombre del Cultivo', cropName],
        ['Confianza', confianza_promedio ? `${(confianza_promedio * 10).toFixed(2)}%` : 'N/A'],
        ['Fecha del Diagnóstico', fecha_diagnostico ? new Date(fecha_diagnostico).toLocaleDateString() : 'N/A'],
        ['Tipo de Problema', translationMap[tipo_problema] || 'Desconocido'],
        ['Resultado del Análisis', resultado_ia || 'N/A'],
      ];
  
      doc.autoTable({
        startY: yOffset,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        styles: { halign: 'center', fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] }, // Verde
        bodyStyles: { fillColor: [240, 248, 255] }, // Blanco
      });
  
      yOffset = doc.lastAutoTable.finalY + 10;
  
      // Si la posición sobrepasa el límite, agregar una nueva página
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20; // Reiniciar la posición en la nueva página
      }
    }
  
    // Guardar el PDF
    doc.save('historial_diagnosticos.pdf');
  };
  

  const csvData = diagnoses
  .filter(diagnosis => selectedDiagnoses.includes(diagnosis.id))
  .map(diagnosis => ({
    "ID del Diagnóstico": diagnosis.id,
    "Nombre del Cultivo": cropName,
    "Confianza (%)": diagnosis.confianza_promedio
      ? (diagnosis.confianza_promedio * 10).toFixed(2)
      : 'N/A',
    "Fecha Diagnóstico": diagnosis.fecha_diagnostico
      ? new Date(diagnosis.fecha_diagnostico).toLocaleDateString()
      : 'N/A',
    "Tipo de Problema": translationMap[diagnosis.tipo_problema] || "Desconocido",
    "Resultado IA": diagnosis.resultado_ia || "N/A",
    "Imágenes Analizadas": diagnosis.imagenes_analizadas || "No Disponible",
    "Exportado": diagnosis.exportado ? "Sí" : "No",
    "Comparación Diagnóstico": diagnosis.comparacion_diagnostico || "N/A",
  }));


  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const diagnosisDate = new Date(diagnosis.fecha_diagnostico);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDate =
      (!start || diagnosisDate >= start) && (!end || diagnosisDate <= end);
    const matchesProblemType =
      !problemType || diagnosis.tipo_problema === problemType;

    return matchesDate && matchesProblemType;
  });

  const currentDiagnoses = filteredDiagnoses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <h3>Historial de Diagnóstico - {cropName}</h3>

      {/* Botones Exportar PDF, CSV y Comparar */}
      <div style={{ marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={exportPDF} disabled={selectedDiagnoses.length === 0} style={{ marginRight: '10px' }}>
          Exportar PDF
        </Button>
        <CSVLink data={csvData} filename={'diagnosis_history.csv'}>
          <Button variant="contained" color="primary" disabled={selectedDiagnoses.length === 0} style={{ marginRight: '10px' }}>
            Exportar CSV
          </Button>
        </CSVLink>
        <Button variant="contained" color="primary" onClick={handleCompareDiagnoses} disabled={selectedDiagnoses.length !== 2}>
          Comparar Diagnósticos
        </Button>
      </div>

      {/* Filtros */}
      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={4}>
          <TextField
            label="Fecha Inicio"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Fecha Fin"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
            <Select
              fullWidth
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Todos los Tipos</MenuItem>
              <MenuItem value="leaf_blast">Tizón de la hoja</MenuItem>
              <MenuItem value="sheath_blight">Añublo de la vaina</MenuItem>
              <MenuItem value="bacterial_leaf_blight">Tizón bacteriano de la hoja</MenuItem>
              <MenuItem value="brown_spot">Mancha marrón</MenuItem>
            </Select>
          </Grid>
      </Grid>



      <Grid container spacing={2}>
      {currentDiagnoses.map((diagnosis) => (
  <Grid item xs={12} key={diagnosis.id}>
    <Card variant="outlined" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <Checkbox
        checked={selectedDiagnoses.includes(diagnosis.id)}
        onChange={() => handleSelectDiagnosis(diagnosis.id)}
        style={{ marginLeft: '10px' }}
      />
      <CardContent onClick={() => handleOpenModal(diagnosis.id)} style={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">Fecha: {diagnosis.fecha_diagnostico}</Typography>
        <Typography variant="body2">
          Tipo de Problema: <span style={{ color: 'green' }}>{diagnosis.translatedProblemType}</span>
        </Typography>
        <Typography variant="body2">Porcentaje : {(diagnosis.confianza_promedio * 10).toFixed(2)}%</Typography>
      
      </CardContent>
    </Card>
  </Grid>
))}

      </Grid>

      <Pagination
        count={Math.ceil(filteredDiagnoses.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />

      {/* Modal con detalles del diagnóstico individual */}
      <DiagnosisDetailModal
          open={open}
          onClose={handleCloseModal}
          diagnosis={selectedDiagnosis}
          cropName={cropName}
          chartData={chartData}
          chartOptions={chartOptions}
        />


      {/* Modal con comparación de diagnósticos */}
      <Modal open={openComparison} onClose={handleCloseComparisonModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', maxWidth: '1000px', bgcolor: 'background.paper', p: 4 }}>
          {selectedDiagnoses.length === 2 && (
            <>
              <Typography variant="h6">Comparación de Diagnósticos</Typography>
              <div style={{ marginTop: '20px' }}>
                <Line data={comparisonChartData()} options={chartOptions} />
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>  
  );
};

export default DiagnosisHistory;