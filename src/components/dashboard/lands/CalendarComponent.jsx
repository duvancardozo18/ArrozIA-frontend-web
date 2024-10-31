import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TaskDialog from './TaskDialog';

const localizer = momentLocalizer(moment);
moment.locale('es');

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState(null);

  const handleSelectSlot = ({ start, end }) => {
    setNewTask({ start, end });
    setTaskDialogOpen(true);
  };

  const handleSaveTask = (task) => {
    setEvents([...events, { title: task.descripcion, start: newTask.start, end: newTask.end }]);
    setTaskDialogOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '10px' }}>
      <h1>Gestionar Cultivo</h1>

      {/* Información del lote */}
      <div>
        <h2>Lote 1</h2>
        <p>Finca: 68</p>
      </div>

      

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, borderRadius: '10px' }}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango',
          showMore: total => `+ Ver más (${total})`,
        }}
      />

      {/* Modal para Crear Tarea */}
      <TaskDialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} onSave={handleSaveTask} />
    </div>
  );
};

export default CalendarComponent;
