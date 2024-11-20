// src/components/tasks/CrearTareaDemo.jsx

import React from 'react';

const CrearTareaDemo = ({ onAddTask }) => {
  const addDemoTasks = () => {
    const demoTasks = [
      {
        id: 1,
        name: 'Revisión de campos',
        description: 'Revisar las condiciones de los cultivos.',
        startDate: '2023-10-28',
        status: 'Pendiente',
        completionDate: null,
      },
      {
        id: 2,
        name: 'Aplicación de fertilizantes',
        description: 'Aplicar fertilizantes a los campos seleccionados.',
        startDate: '2023-10-27',
        status: 'En Progreso',
        completionDate: null,
      },
      {
        id: 3,
        name: 'Informe de rendimiento',
        description: 'Generar un informe sobre el rendimiento de las cosechas.',
        startDate: '2023-10-25',
        status: 'Completada',
        completionDate: '2023-10-27',
      },
    ];

    demoTasks.forEach((task) => onAddTask(task));
  };

  return (
    <button onClick={addDemoTasks} style={styles.button}>
      Agregar Tareas Demo
    </button>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#13ec34',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
};

export default CrearTareaDemo;
