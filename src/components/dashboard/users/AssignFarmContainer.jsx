import React, { useEffect, useState } from "react";
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessModal from '../modal/SuccessModal';
import "../../../css/AssignFarmContainer.css";

const AssignFarmContainer = ({ onSave }) => {
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [farms, setFarms] = useState([]); // Lista de fincas
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal de éxito
  const [selectedUser, setSelectedUser] = useState(""); // Usuario seleccionado
  const [selectedFarm, setSelectedFarm] = useState(""); // Finca seleccionada
  const [userSearch, setUserSearch] = useState(""); // Búsqueda de usuario
  const [farmSearch, setFarmSearch] = useState(""); // Búsqueda de finca
  const [showUserOptions, setShowUserOptions] = useState(false); // Opciones de usuarios
  const [showFarmOptions, setShowFarmOptions] = useState(false); // Opciones de fincas

  useEffect(() => {
    // Cargar usuarios y fincas
    axiosInstance.get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    axiosInstance.get("/farms")
      .then((response) => setFarms(response.data))
      .catch((error) => console.error("Error fetching farms:", error));
  }, []);

  const handleAssignFarm = () => {
    if (selectedUser && selectedFarm) {
      axiosInstance.post(`/users/${selectedUser}/assign-farm`, { farm_id: selectedFarm })
        .then(() => {
          setShowSuccessModal(true); // Mostrar modal de éxito
          onSave(); // Llamar a onSave para refrescar la tabla de usuarios en el componente padre
          setSelectedUser(""); // Limpiar selección de usuario
          setSelectedFarm(""); // Limpiar selección de finca
          setUserSearch(""); // Limpiar campo de búsqueda de usuario
          setFarmSearch(""); // Limpiar campo de búsqueda de finca
        })
        .catch((error) => {
          console.error("Error assigning farm:", error);
          if (error.response?.data?.detail === "El usuario ya está relacionado a esa finca.") {
            toast.error("El usuario ya está relacionado a esa finca.");
          } else {
            toast.error("Error al asignar la finca. Inténtalo de nuevo.");
          }
        });
    } else {
      toast.error("Por favor, selecciona un usuario y una finca.");
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.nombre} ${user.apellido}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredFarms = farms.filter(farm =>
    farm.nombre.toLowerCase().includes(farmSearch.toLowerCase())
  );

  return (
    <div className="assign-farm-card-container">
      <h3>Asignación de Finca a Usuarios</h3>
      <div className="assign-farm-card">
        <div className="form-group">
          <label>Buscar Usuario:</label>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            onFocus={() => setShowUserOptions(true)}
            onBlur={() => setTimeout(() => setShowUserOptions(false), 150)}
          />
          {showUserOptions && (
            <div className="dropdown">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="dropdown-item"
                  onMouseDown={() => {
                    setSelectedUser(user.id);
                    setUserSearch(`${user.nombre} ${user.apellido}`);
                    setShowUserOptions(false);
                  }}
                >
                  {user.nombre} {user.apellido}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Buscar Finca:</label>
          <input
            type="text"
            placeholder="Buscar finca..."
            value={farmSearch}
            onChange={(e) => setFarmSearch(e.target.value)}
            onFocus={() => setShowFarmOptions(true)}
            onBlur={() => setTimeout(() => setShowFarmOptions(false), 150)}
          />
          {showFarmOptions && (
            <div className="dropdown">
              {filteredFarms.map((farm) => (
                <div
                  key={farm.id}
                  className="dropdown-item"
                  onMouseDown={() => {
                    setSelectedFarm(farm.id);
                    setFarmSearch(farm.nombre);
                    setShowFarmOptions(false);
                  }}
                >
                  {farm.nombre}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleAssignFarm} className="btn btn-primary">
          Asignar Finca
        </button>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message="Finca asignada correctamente"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AssignFarmContainer;
