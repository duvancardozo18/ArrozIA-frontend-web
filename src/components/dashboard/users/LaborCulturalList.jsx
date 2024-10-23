import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance"; // Asegúrate de tener configurado Axios correctamente
import NewLaborCultural from "../../dashboard/users/CreateLaborCulturalModal"; // Importa el modal de registrar

// Estilos del modal
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
  width: 600px;
  max-width: 90%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const LaborList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const LaborItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const RegisterButton = styled(Button)`
  background-color: #28a745;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }
`;

const LaborCulturalList = ({ userId, closeModal, onSave }) => {
  const [labors, setLabors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Estado para abrir el modal de registro
  const [errorMessage, setErrorMessage] = useState("");

  // Función para obtener las labores culturales desde la API
  const fetchLabors = async () => {
    try {
      const response = await axiosInstance.get(`/labor-cultural/user/${userId}`);
      setLabors(response.data); // Actualiza la lista de labores en el frontend
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error al obtener las labores culturales.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabors(); // Llama a la función cuando se carga el componente
  }, [userId]);

  const openRegisterModal = () => setShowRegisterModal(true); // Abre el modal de registro
  const closeRegisterModal = () => setShowRegisterModal(false); // Cierra el modal de registro

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>×</CloseButton>
        <h2>Labores Culturales del Usuario</h2>
        {loading && <p>Cargando labores...</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {!loading && labors.length === 0 && <p>No hay labores culturales registradas.</p>}
        <LaborList>
          {labors.map((labor) => (
            <LaborItem key={labor.id}>
              <span>{labor.nombre}</span>
              <Button onClick={() => {/* Lógica para ver más detalles si es necesario */}}>Ver</Button>
            </LaborItem>
          ))}
        </LaborList>

        <RegisterButton onClick={openRegisterModal}>Registrar Nueva Labor</RegisterButton>

        {/* Modal de Registrar Labor Cultural */}
        {showRegisterModal && (
          <NewLaborCultural
            closeModal={closeRegisterModal} // Cierra el modal de registro
            onSave={onSave} // Refresca el listado después de registrar
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default LaborCulturalList;
