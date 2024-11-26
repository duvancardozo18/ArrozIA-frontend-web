// src/components/tasks/CrearTarea.jsx

import React, { useState } from 'react';

const CrearTarea = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  const handleAddTask = () => {
    if (taskName && taskDescription && taskDeadline) {
      const newTask = {
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        status: 'Pendiente',
        completionDate: null,
      };
      onAddTask(newTask);
      setTaskName('');
      setTaskDescription('');
      setTaskDeadline('');
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  return (
    <div style={styles.container}>
      <h3>Crear Nueva Tarea</h3>
      <input
        type="text"
        placeholder="Nombre de la tarea"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        style={styles.input}
      />
      <textarea
        placeholder="Descripción"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        style={styles.input}
      />
      <input
        type="date"
        placeholder="Fecha límite"
        value={taskDeadline}
        onChange={(e) => setTaskDeadline(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleAddTask} style={styles.addButton}>Agregar Tarea</button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#444',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    color: 'white',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
  },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CrearTarea;
