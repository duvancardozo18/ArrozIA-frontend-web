import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Modal, Box, Checkbox, Grid, TextField, Select, MenuItem, Pagination } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

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
      ...(problemType && { problem_type: problemType })
    };

    try {
      const response = await axiosInstance.get(`/diagnostics/history/${selectedCrop}`, { params });
      setDiagnoses(response.data);
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

  const exportPDF = async () => {
    if (selectedDiagnoses.length === 0) {
      alert("Por favor, selecciona al menos un diagnóstico para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text('Resultados del Diagnóstico', 14, 10);

    // Iterar sobre los diagnósticos seleccionados para incluir sus detalles
    for (const diagnosisId of selectedDiagnoses) {
      const diagnosis = diagnoses.find(d => d.id === diagnosisId);

      if (!diagnosis) continue;

      const {
        fecha_diagnostico,
        tipo_problema,
        resultado_ia,
        confianza_promedio,
        id,
        imagenes_analizadas,
        exportado,
        comparacion_diagnostico,
      } = diagnosis;

      const tableData = [
        ["Nombre del Cultivo", cropName],
        ["Confianza", confianza_promedio ? (confianza_promedio * 10).toFixed(2) + '%' : 'N/A'],
        ["Fecha del Diagnóstico", fecha_diagnostico ? new Date(fecha_diagnostico).toLocaleDateString() : 'N/A'],
        ["ID del Diagnóstico", id],
        ["Tipo de Problema", tipo_problema],
        ["Imágenes Analizadas", imagenes_analizadas || 'N/A'],
        ["Exportado", exportado ? 'Sí' : 'No'],
        ["Comparación Diagnóstico", comparacion_diagnostico || 'N/A'],
        ["Resultado del Análisis", resultado_ia],
      ];

      doc.autoTable({
        head: [['Campo', 'Valor']],
        body: tableData,
        startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 20,
      });
    }

    doc.save('diagnosis_results.pdf');
  };

  const csvData = diagnoses
    .filter(diagnosis => selectedDiagnoses.includes(diagnosis.id))
    .map(diagnosis => ({
      "Fecha Diagnóstico": diagnosis.fecha_diagnostico,
      "Tipo de Problema": diagnosis.tipo_problema,
      "Resultado IA": diagnosis.resultado_ia,
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
            <MenuItem value="">Tipo de Problema</MenuItem>
            <MenuItem value="plaga">Plaga</MenuItem>
            <MenuItem value="enfermedad">Enfermedad</MenuItem>
            <MenuItem value="maleza">Maleza</MenuItem>
            <MenuItem value="deficiencia">Deficiencia</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleApplyFilters}
        style={{ marginBottom: '20px' }}
      >
        Aplicar Filtros
      </Button>

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
                <Typography variant="body2">Tipo de Problema: <span style={{ color: 'green' }}>{diagnosis.tipo_problema}</span></Typography>
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
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', maxWidth: '1000px', bgcolor: 'background.paper', p: 4 }}>
          {selectedDiagnosis && (
            <>
              <Typography variant="h6">Detalles del Diagnóstico</Typography>
              <Typography variant="body2">Nombre cultivo: {cropName}</Typography>
              <Typography variant="body2">Confianza: {selectedDiagnosis.confianza_promedio ? (selectedDiagnosis.confianza_promedio * 10).toFixed(2) + '%' : 'N/A'}</Typography>
              <Typography variant="body2">Fecha: {selectedDiagnosis.fecha_diagnostico}</Typography>
              <Typography variant="body2">Tipo de Problema: <span style={{ color: 'green' }}>{selectedDiagnosis.tipo_problema}</span></Typography>

              {/* Gráfica */}
              <div style={{ marginTop: '20px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          )}
        </Box>
      </Modal>

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
