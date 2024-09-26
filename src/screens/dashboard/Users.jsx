import React, { useContext, useEffect, useState } from "react";
import { AreaTable, AreaTop } from "../../components";
import ButtonCrear from "../../components/dashboard/ButtonCreate";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import NewUser from "../../components/modal/CreateUserModal";

const Usars = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // Handle token if necessary
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSave = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <div className="content-area">
      <AreaTop title="Usuarios" />
      <ButtonCrear
        buttonText="Crear usuario"
        ModalComponent={NewUser}
        onSave={handleSave}
      />
      <AreaTable refresh={refreshTable} />
    </div>
  );
};

export default Usars;