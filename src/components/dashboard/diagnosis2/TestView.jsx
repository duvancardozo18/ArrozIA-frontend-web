import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar las escalas y elementos necesarios
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TestView = () => {
  // Datos de ejemplo para el gráfico
  const data = {
    labels: ['Fecha 1', 'Fecha 2', 'Fecha 3'],
    datasets: [
      {
        label: 'Porcentaje de Confianza',
        data: [85, 90, 75],
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Detalles del Diagnóstico</h3>
      <Line data={data} />
    </div>
  );
};

export default TestView;
