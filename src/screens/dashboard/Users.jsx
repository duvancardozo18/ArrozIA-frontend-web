import React, { useContext, useState } from "react";
import Header from "../../components/dashboard/Header";
import AreaTable from "../../components/dashboard/users/TableUser";
import ButtonCrear from "../../components/dashboard/ButtonCreate";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import NewUser from "../../components/dashboard/users/CreateUserModal";
import AssignFarmContainer from "../../components/dashboard/users/AssignFarmContainer";

const Usars = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [refreshTable, setRefreshTable] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSave = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <div className="content-area">
      <Header title="Usuarios" />
      <ButtonCrear
        buttonText="Crear usuario"
        ModalComponent={NewUser}
        onSave={handleSave}
      />
      <AreaTable refresh={refreshTable} />
      {/* Pasar handleSave como prop a AssignFarmContainer para refrescar la tabla */}
      <AssignFarmContainer onSave={handleSave} />
    </div>
  );
};

export default Usars;
