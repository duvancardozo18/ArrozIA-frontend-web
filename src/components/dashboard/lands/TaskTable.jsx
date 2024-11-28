import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import axiosInstance from "../../../config/AxiosInstance";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCheck } from "react-icons/hi";
import ViewTaskModal from "../tasks/ViewTaskModal";
import EditTaskModal from "../tasks/EditTaskModal";

// Estilos de los botones de acción
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 5px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  color: white;
  background-color: #333;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

    &:disabled {
    background-color: #bdc3c7; /* Color para cuando el botón está deshabilitado */
    cursor: not-allowed;
  }
`;

const ViewButton = styled(ActionButton)`
  background-color: #2ecc71;
`;

const EditButton = styled(ActionButton)`
  background-color: #3498db;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
`;

const CompleteButton = styled(ActionButton)`
  background-color: #9b59b6;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StatusContainer = styled.div`
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  background-color: ${(props) => (props.status === "Completado" ? "#2ecc71" : "#e74c3c")};
`;

const TaskTable = ({ refresh, cultivoId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get(`/crops/${cultivoId}/tasks`);
        const data = response.data;
        const formattedTasks = data.map((task) => ({
          id: task.id,
          fecha_estimada: task.fecha_estimada,
          fecha_realizacion: task.fecha_realizacion || "Sin completar",
          estado: task.estado?.nombre || "Estado desconocido",
          es_mecanizable: task.es_mecanizable ? "Sí" : "No",
          labor_cultural: task.labor_cultural?.nombre || "Labor desconocida",
          insumo_agricola: task.insumo_agricola?.nombre || "N/A",
          usuario: task.usuario?.nombre || "Usuario desconocido",
          cantidad_insumo: task.cantidad_insumo || "N/A",
          maquinaria: task.maquinaria_agricola?.name || "N/A",
          precio_labor: task.precio_labor_cultural,
          descripcion: task.descripcion,
        }));
        setTasks(formattedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las tareas del cultivo:", error);
        setError("Hubo un problema al cargar las tareas.");
        setLoading(false);
      }
    };

    if (cultivoId) {
      fetchTasks();
    }
  }, [refresh, cultivoId]);

  const handleView = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedTask(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      console.log(`Tarea con ID: ${id} eliminada exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      setError("Hubo un problema al eliminar la tarea.");
    }
  };

  const handleComplete = async (id) => {
    try {
      // Actualizamos el estado de la tarea a "Completado" con estado_id = 3
      const response = await axiosInstance.put(`/tasks/${id}`, { estado_id: 3 });
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, estado: "Completado" } : task
          )
        );
        console.log(`Tarea con ID: ${id} completada exitosamente.`);
      }
    } catch (error) {
      console.error("Error al completar la tarea:", error);
      setError("Hubo un problema al completar la tarea.");
    }
  };

  const columns = [
    {
      name: "Fecha Estimada",
      selector: (row) => row.fecha_estimada,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      cell: (row) => <StatusContainer status={row.estado}>{row.estado}</StatusContainer>,
    },
    {
      name: "¿Es Mecanizable?",
      selector: (row) => row.es_mecanizable,
      sortable: true,
    },
    {
      name: "Labor Cultural",
      selector: (row) => row.labor_cultural,
      sortable: true,
    },
    {
      name: "Insumo Agrícola",
      selector: (row) => row.insumo_agricola,
      sortable: true,
    },
    {
      name: "Usuario",
      selector: (row) => row.usuario,
      sortable: true,
    },
    {
      name: "Cantidad de Insumo",
      selector: (row) => row.cantidad_insumo,
      sortable: true,
    },
    {
      name: "Maquinaria",
      selector: (row) => row.maquinaria,
      sortable: true,
    },
    {
      name: "Precio de Labor",
      selector: (row) => row.precio_labor,
      sortable: true,
      format: (row) =>
        new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(row.precio_labor),
    },
    {
      name: "Fecha Realización",
      selector: (row) => row.fecha_realizacion,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <ActionsContainer>
          <ViewButton onClick={() => handleView(row)}>
            <HiOutlineEye size={18} />
          </ViewButton>
          <EditButton onClick={() => handleEdit(row)}>
            <HiOutlinePencil size={18} />
          </EditButton>
          <DeleteButton onClick={() => handleDelete(row.id)}>
            <HiOutlineTrash size={18} />
          </DeleteButton>
          <CompleteButton
            onClick={() => handleComplete(row.id)}
            disabled={row.estado === "Completado"}
          >
            <HiOutlineCheck size={18} />
          </CompleteButton>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Labores del Cultivo</h1>
      <DataTable
        columns={columns}
        data={tasks}
        pagination
        highlightOnHover
        responsive
        progressPending={loading}
        progressComponent={<div>Cargando...</div>}
        noDataComponent="No se encontraron tareas"
      />
      {showViewModal && (
        <ViewTaskModal show={showViewModal} closeModal={closeViewModal} task={selectedTask} />
      )}
      {showEditModal && (
        <EditTaskModal
          show={showEditModal}
          closeModal={closeEditModal}
          task={selectedTask}
          onSave={(updatedTask) => {
            setTasks((prevTasks) =>
              prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
          }}
        />
      )}
    </div>
  );
};

export default TaskTable;
