import React, { useContext, useEffect } from "react";
import  Header  from "../../components/dashboard/Header";
import ButtonCrear from "../../components/dashboard/ButtonCreate";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import TableRole from "../../components/dashboard/table/TableRole";
import NewRol from "../../components/modal/CreateRolModal";

const Roles = () => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Obtén el token desde localStorage

    if (token) {
      // console.log('Token encontrado en localStorage:', token);
    } else {
      // console.log('No se encontró ningún token en localStorage');
    }
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Si el usuario no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Roles" />
      <ButtonCrear buttonText="Crear Rol" ModalComponent={NewRol} />{" "}
      {/* Agrega el botón aquí */}
      <TableRole />
    </div>
  );
};

export default Roles;
