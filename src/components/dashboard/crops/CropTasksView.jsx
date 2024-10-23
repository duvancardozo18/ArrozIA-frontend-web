import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa el estilo del calendario
import axiosInstance from '../../../config/AxiosInstance';
import '../../../css/CropTasksView.css';
import styled from 'styled-components';



const CropTasksViewContainer = styled.div`
  text-align: center;
`;

const CalendarContainer = styled.div`
  margin: 0 auto;
  width: 300px;
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TaskActions = styled.div`
  button {
    margin: 10px;
    padding: 10px 20px;
    border-radius: 8px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #218838;
    }
  }
`;

const CropTasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/crop-tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const upcomingTasks = tasks.filter(task => new Date(task.date) >= new Date());

  return (
    <CropTasksViewContainer>
      <h2>Cultivo 1</h2>
      <CalendarContainer>
        <Calendar onChange={onDateChange} value={selectedDate} />
      </CalendarContainer>
      <h3>Proximas Tareas</h3>
      <TaskList>
        {upcomingTasks.map((task, index) => (
          <TaskItem key={index}>
            <div>
              <img src={task.icon} alt="task icon" />
              <strong>{task.name}</strong> - {task.date}
              <p>{task.fieldName}</p>
            </div>
          </TaskItem>
        ))}
      </TaskList>
      <TaskActions>
        <button>Editar tarea</button>
        <button>Eliminar tarea</button>
        <button>Agregar tarea</button>
      </TaskActions>
    </CropTasksViewContainer>
  );
};

export default CropTasksView;