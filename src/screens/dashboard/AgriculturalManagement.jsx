import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/dashboard/Header";
import ButtonCrear from "../../components/dashboard/ButtonCreate";
import RiceVarietiesTable from "../../components/dashboard/AgriculturalManagement/RiceVariety/RiceVarietiesTable";
import InputTable from "../../components/dashboard/AgriculturalManagement/Input/InputTable";
import CreateInputModal from "../../components/dashboard/AgriculturalManagement/Input/CreateInputModal";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import CreateRiceVarietyModal from "../../components/dashboard/AgriculturalManagement/RiceVariety/CreateRiceVarietyModal";
import "../../css/AgriculturalManagement.scss"; // Importa tus estilos

const GestionAgricola = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [refreshTable, setRefreshTable] = useState(false);
  const [activeTable, setActiveTable] = useState("variedades");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSave = () => {
    setRefreshTable((prev) => !prev); // Altera el estado para forzar la actualización de las tablas
  };

  return (
    <div className="content-area">
      <Header title="Gestión Agrícola" />

      {/* Botones para cambiar entre tablas */}
      <div className="button-group">
        <button
          onClick={() => setActiveTable("variedades")}
          className={`toggle-button ${
            activeTable === "variedades" ? "active" : ""
          }`}
        >
          Variedades de Arroz
        </button>
        <button
          onClick={() => setActiveTable("insumos")}
          className={`toggle-button ${
            activeTable === "insumos" ? "active" : ""
          }`}
        >
          Insumos Agrícolas
        </button>
        <button
          onClick={() => setActiveTable("insumos")}
          className={`toggle-button ${
            activeTable === "insumos" ? "active" : ""
          }`}
        >
          Mecanizacion
        </button>
        <button
          onClick={() => setActiveTable("insumos")}
          className={`toggle-button ${
            activeTable === "insumos" ? "active" : ""
          }`}
        >
          Labor Cultural
        </button>
      </div>

      {/* Botón para abrir el modal de crear variedad o insumo */}
      {activeTable === "variedades" ? (
        <ButtonCrear
          buttonText="Crear variedad"
          ModalComponent={CreateRiceVarietyModal}
          onSave={handleSave}
        />
      ) : (
        <ButtonCrear
          buttonText="Crear insumo"
          ModalComponent={CreateInputModal}
          onSave={handleSave}
        />
      )}

      {/* Renderizado condicional de las tablas */}
      {activeTable === "variedades" ? (
        <RiceVarietiesTable refresh={refreshTable} /> 
      ) : (
        <InputTable refresh={refreshTable} /> 
      )}
    </div>
  );
};

export default GestionAgricola;
