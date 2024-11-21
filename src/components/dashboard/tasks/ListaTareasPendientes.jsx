// src/components/tasks/ListaTareasPendientes.jsx

import React, { useState } from 'react';
import CrearTarea from './CrearTarea';
import DetallesTarea from './DetallesTarea';

const ListaTareasPendientes = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const markTaskAsCompleted = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: 'Completada', completionDate: new Date().toLocaleDateString() } : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const pendingTasks = tasks.filter(task => task.status !== 'Completada');
  const completedTasks = tasks.filter(task => task.status === 'Completada');

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestión de Tareas</h2>
      
      {/* Componente para crear una nueva tarea */}
      <CrearTarea onAddTask={addTask} />

      <h3 style={styles.subtitle}>Tareas Pendientes</h3>
      <ul style={styles.taskList}>
        {pendingTasks.map(task => (
          <li key={task.id} style={styles.taskItem} onClick={() => setSelectedTask(task)}>
            <p><strong>{task.name}</strong> - {task.deadline}</p>
          </li>
        ))}
      </ul>

      <h3 style={styles.subtitle}>Tareas Completadas</h3>
      <ul style={styles.taskList}>
        {completedTasks.map(task => (
          <li key={task.id} style={styles.completedTaskItem}>
            <p><strong>{task.name}</strong> - Completada el: {task.completionDate}</p>
          </li>
        ))}
      </ul>

      {selectedTask && (
        <DetallesTarea
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onComplete={() => markTaskAsCompleted(selectedTask.id)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '20px',
    marginTop: '20px',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    backgroundColor: '#333',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  completedTaskItem: {
    backgroundColor: '#555',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
};

export default ListaTareasPendientes;
