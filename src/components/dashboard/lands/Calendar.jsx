import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar el idioma español para moment.js
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axiosInstance from "../../../config/AxiosInstance";
import VegetativeCard from '../vegetativecycle/VegetativeCard';

const localizer = momentLocalizer(moment);
moment.locale('es'); // Establecer el idioma a español

const buttonCreate = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginBottom: '20px',
  marginTop: '20px',
  marginLeft: 'auto',
  marginRight: '30px',
  display: 'block',
};

const buttonCicloVegetativo = {
  ...buttonCreate,
  backgroundColor: '#007bff', // Cambia el color para distinguirlo
  marginLeft: '10px',
};

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [showVegetativeCard, setShowVegetativeCard] = useState(false); // Estado para mostrar VegetativeCard
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    estadoId: 1,
    planeadaAutomaticamente: true,
    esMecanizable: false,
    cultivoId: 15,
    laborId: 1,
    insumoId: 2,
    manoObraId: 1
  });

  const theme = useTheme(); // Usar tema de Material UI para estilos

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setOpen(true);
  };

  const handleAddEvent = async () => {
    const taskData = {
      fechaEstimada: moment(newEvent.start).format('YYYY-MM-DD'),
      fechaRealizacion: moment(newEvent.end).format('YYYY-MM-DD'),
      descripcion: newEvent.title,
      estadoId: newEvent.estadoId,
      planeadaAutomaticamente: newEvent.planeadaAutomaticamente,
      esMecanizable: newEvent.esMecanizable,
      cultivoId: newEvent.cultivoId,
      laborId: newEvent.laborId,
      insumoId: newEvent.insumoId,
      manoObraId: newEvent.manoObraId
    };

    try {
      await axiosInstance.post('/task', taskData);
      setEvents([...events, { title: newEvent.title, start: newEvent.start, end: newEvent.end }]);
      setOpen(false); // Cerrar el diálogo después de añadir el evento
    } catch (error) {
      console.error('Error al enviar la tarea:', error);
    }
  };

  const handleShowVegetativeCard = () => {
    setShowVegetativeCard(!showVegetativeCard); // Alternar el estado para mostrar/ocultar VegetativeCard
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      <h1 style={{ textAlign: 'center' }}>Gestión de Labores y Ciclo Vegetativo</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>

        <button
          style={buttonCreate}
          onClick={() => setOpen(true)}
          disabled={showVegetativeCard} // Desactivar el botón cuando se muestra VegetativeCard
        >
          Asignar Labor
        </button>

        <button
          style={buttonCicloVegetativo}
          onClick={handleShowVegetativeCard} // Alternar el estado para mostrar/ocultar VegetativeCard
        >
          Ciclo Vegetativo
        </button>
      </div>

      {showVegetativeCard ? (
        <VegetativeCard stages={[
            { stage: 'emergence', startDate: '2024-10-24', endDate: '2024-11-03', labores: 'No asignadas' },
            { stage: 'tillering', startDate: '2024-11-03', endDate: '2024-11-23', labores: 'No asignadas' },
            { stage: 'panicleInitiation', startDate: '2024-11-23', endDate: '2024-12-23', labores: 'No asignadas' },
            { stage: 'flowering', startDate: '2024-12-23', endDate: '2025-02-01', labores: 'No asignadas' },
            { stage: 'ripening', startDate: '2025-02-01', endDate: '2025-03-23', labores: 'No asignadas' },
          ]}
        /> // Muestra el componente VegetativeCard
      ) : (
        <div
          style={{
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra
            borderRadius: '10px',
            padding: '10px',
          }}
        >
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
            views={['month', 'week', 'day']}
            culture="es" // Definir la cultura en español
          />
        </div>
      )}

      {!showVegetativeCard && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Asignar Labor</DialogTitle>
          <DialogContent>

            <TextField
              label="Labor Cultural"
              fullWidth
              value={newEvent.laborId}
              onChange={(e) => setNewEvent({ ...newEvent, laborId: e.target.value })}
              margin="normal"
            />
      
            <TextField
              label="Fecha y hora de inicio"
              type="datetime-local"
              fullWidth
              value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              margin="normal"
            />
            <TextField
              label="Fecha y hora de fin"
              type="datetime-local"
              fullWidth
              value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              margin="normal"
            />

            {/* Campo para Estado ID */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="estadoId-label">Estado</InputLabel>
              <Select
                labelId="estadoId-label"
                value={newEvent.estadoId}
                onChange={(e) => setNewEvent({ ...newEvent, estadoId: e.target.value })}
              >
                <MenuItem value={1}>Pendiente</MenuItem>
                <MenuItem value={2}>En Proceso</MenuItem>
                <MenuItem value={3}>Completado</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="ID del Cultivo"
              fullWidth
              value={newEvent.cultivoId}
              onChange={(e) => setNewEvent({ ...newEvent, cultivoId: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Insumo (Opcional)"
              fullWidth
              value={newEvent.insumoId}
              onChange={(e) => setNewEvent({ ...newEvent, insumoId: e.target.value })}
              margin="normal"
            />
            <TextField
              label="ID de Mano de Obra"
              fullWidth
              value={newEvent.manoObraId}
              onChange={(e) => setNewEvent({ ...newEvent, manoObraId: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">Cancelar</Button>
            <Button onClick={handleAddEvent} color="primary">Crear</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MyCalendar;
