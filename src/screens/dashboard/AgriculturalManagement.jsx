import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/dashboard/Header";
import ButtonCrear from "../../components/dashboard/ButtonCreate";
import RiceVarietiesTable from "../../components/dashboard/AgriculturalManagement/RiceVariety/RiceVarietiesTable";
import CulturalWorkTable from "../../components/dashboard/AgriculturalManagement/cultural work/CulturalWorkTable";
import CreateCulturalWorkModal from "../../components/dashboard/AgriculturalManagement/cultural work/CreateCulturalWorkModal";
import MechanizationTable from "../../components/dashboard/AgriculturalManagement/mechanization/MechanizationTable";
import InputTable from "../../components/dashboard/AgriculturalManagement/Input/InputTable";
import CreateInputModal from "../../components/dashboard/AgriculturalManagement/Input/CreateInputModal";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import CreateRiceVarietyModal from "../../components/dashboard/AgriculturalManagement/RiceVariety/CreateRiceVarietyModal";
import "../../css/AgriculturalManagement.scss"; // Import your styles
import CreateMechanizationModla from "../../components/dashboard/AgriculturalManagement/mechanization/CreateMechanizationModal";

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
    setRefreshTable((prev) => !prev); // Toggle state to refresh the tables
  };

  return (
    <div className="content-area">
      <Header title="Gestión Agrícola" />

      {/* Buttons to toggle between tables */}
      <div className="button-group">
        <button
          onClick={() => setActiveTable("variedades")}
          className={`toggle-button ${activeTable === "variedades" ? "active" : ""}`}
        >
          Variedades de Arroz
        </button>
        <button
          onClick={() => setActiveTable("insumos")}
          className={`toggle-button ${activeTable === "insumos" ? "active" : ""}`}
        >
          Insumos Agrícolas
        </button>
        <button
          onClick={() => setActiveTable("mecanizacion")}
          className={`toggle-button ${activeTable === "mecanizacion" ? "active" : ""}`}
        >
          Mecanización
        </button>
        <button
          onClick={() => setActiveTable("labor-cultural")}
          className={`toggle-button ${activeTable === "labor-cultural" ? "active" : ""}`}
        >
          Labor Cultural
        </button>
      </div>

      {/* Button to open the modal for creating variety, input, or cultural work */}
      {activeTable === "variedades" && (
        <ButtonCrear
          buttonText="Crear variedad"
          ModalComponent={CreateRiceVarietyModal}
          onSave={handleSave}
        />
      )}
      {activeTable === "insumos" && (
        <ButtonCrear
          buttonText="Crear insumo"
          ModalComponent={CreateInputModal}
          onSave={handleSave}
        />
      )}
      {activeTable === "labor-cultural" && (
        <ButtonCrear
          buttonText="Crear labor cultural"
          ModalComponent={CreateCulturalWorkModal}
          onSave={handleSave}
        />
      )}
      {activeTable === "mecanizacion" && (
        <ButtonCrear
          buttonText="Crear mecanización"
          ModalComponent={CreateMechanizationModla}
          onSave={handleSave}
        />
      )}

      {/* Conditional rendering of the tables */}
      {activeTable === "variedades" && <RiceVarietiesTable refresh={refreshTable} />}
      {activeTable === "insumos" && <InputTable refresh={refreshTable} />}
      {activeTable === "labor-cultural" && <CulturalWorkTable refresh={refreshTable} />}
      {activeTable === "mecanizacion" && <MechanizationTable refresh={refreshTable} />}
    </div>
  );
};

export default GestionAgricola;
