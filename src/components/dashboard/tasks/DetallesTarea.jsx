// src/components/tasks/DetallesTarea.jsx

import React from 'react';

const DetallesTarea = ({ task, onClose, onComplete }) => {
  return (
    <div style={styles.modal}>
      <h3 style={styles.taskTitle}>{task.name}</h3>
      <p><strong>Descripción:</strong> {task.description}</p>
      <p><strong>Fecha límite:</strong> {task.deadline}</p>
      <p><strong>Estado:</strong> {task.status}</p>
      <button onClick={onClose} style={styles.closeButton}>Cerrar</button>
      {task.status !== 'Completada' && (
        <button onClick={onComplete} style={styles.completeButton}>Marcar como Completada</button>
      )}
    </div>
  );
};

const styles = {
  modal: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  taskTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  closeButton: {
    backgroundColor: '#777',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  completeButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DetallesTarea;
