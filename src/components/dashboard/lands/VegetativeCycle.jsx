// VegetativeCycle.jsx
import React from 'react';
import VegetativeCard from '../vegetativecycle/VegetativeCard';

const VegetativeCycle = () => (
  <VegetativeCard stages={[
    { stage: 'emergence', startDate: '2024-10-24', endDate: '2024-11-03', labores: 'No asignadas' },
    { stage: 'tillering', startDate: '2024-11-03', endDate: '2024-11-23', labores: 'No asignadas' },
    { stage: 'panicleInitiation', startDate: '2024-11-23', endDate: '2024-12-23', labores: 'No asignadas' },
    { stage: 'flowering', startDate: '2024-12-23', endDate: '2025-02-01', labores: 'No asignadas' },
    { stage: 'ripening', startDate: '2025-02-01', endDate: '2025-03-23', labores: 'No asignadas' },
  ]} />
);

export default VegetativeCycle;
