import React, { useContext, useEffect, useState } from "react";
import Header  from "../../components/dashboard/Header";
import AreaTable  from "../../components/dashboard/table/TableUser";
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
      <Header title="Usuarios" />
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