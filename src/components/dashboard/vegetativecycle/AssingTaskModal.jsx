import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../../dashboard/modal/SuccessModal";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  select, input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const AssignTaskModal = ({ show, closeModal, onSave, cropId }) => {
  const [taskData, setTaskData] = useState({
    taskId: "",
    startDate: "",
    endDate: "",
  });
  const [tasks, setTasks] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/crops/${cropId}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (show) fetchTasks();
  }, [show, cropId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Aquí puedes hacer una llamada a la API para asignar la tarea al ciclo vegetativo
      // En este ejemplo, simplemente llamamos a la función onSave
      onSave(taskData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error asignando la tarea:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  if (!show) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Asignar Tarea al Ciclo Vegetativo
          </h2>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Tarea</label>
              <select
                name="taskId"
                value={taskData.taskId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una tarea</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.descripcion}
                  </option>
                ))}
              </select>
            </InputGroup>
            <InputGroup>
              <label>Fecha de Inicio</label>
              <input
                type="date"
                name="startDate"
                value={taskData.startDate}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <label>Fecha de Fin</label>
              <input
                type="date"
                name="endDate"
                value={taskData.endDate}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <SubmitButton type="submit">Asignar Tarea</SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message="¡Tarea asignada con éxito al ciclo vegetativo!"
        />
      )}
    </>
  );
};

export default AssignTaskModal;
