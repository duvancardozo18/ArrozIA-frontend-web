import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/dashboard/Header";
import ButtonCrear from "../../components/dashboard/ButtonCreate";
import RiceVarietiesTable from "../../components/dashboard/AgriculturalManagement/RiceVariety/RiceVarietiesTable";
import InputTable from "../../components/dashboard/AgriculturalManagement/Input/InputTable";
import CreateInputModal from "../../components/dashboard/AgriculturalManagement/Input/CreateInputModal";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import CreateRiceVarietyModal from "../../components/dashboard/AgriculturalManagement/RiceVariety/CreateRiceVarietyModal";
import PhenologicalStageTable from "../../components/dashboard/AgriculturalManagement/PhenologicalStage/PhenologicalStageTable";
import CreatePhenologicalStageModal from "../../components/dashboard/AgriculturalManagement/PhenologicalStage/CreatePhenologicalStageModal";
import "../../css/AgriculturalManagement.css";

import LaborCulturalTable from "../../components/dashboard/AgriculturalManagement/LaborCultural/LaborCulturalTable";
import CreateLaborModal from "../../components/dashboard/AgriculturalManagement/LaborCultural/CreateLaborModal";

// Importaciones para el submódulo de Maquinaria
import MachineryTable from "../../components/dashboard/AgriculturalManagement/Machinery/MachineryTable";
import CreateMachineryModal from "../../components/dashboard/AgriculturalManagement/Machinery/CreateMachineryModal";

const GestionAgricola = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [refreshTable, setRefreshTable] = useState(false);
  const [activeTable, setActiveTable] = useState("etapas-fenologicas");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Actualiza la tabla cuando se crea, edita o elimina un dato
  const handleSave = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <div className="content-area">
      <Header title="Gestión Agrícola" />
      <div className="button-group">
        <button
          onClick={() => setActiveTable("insumos")}
          className={`toggle-button ${activeTable === "insumos" ? "active" : ""}`}
        >
          Insumos Agrícolas
        </button>
        <button
          onClick={() => setActiveTable("variedades")}
          className={`toggle-button ${activeTable === "variedades" ? "active" : ""}`}
        >
          Variedades
        </button>
        <button
          onClick={() => setActiveTable("maquinaria")}
          className={`toggle-button ${activeTable === "maquinaria" ? "active" : ""}`}
        >
          Maquinaria
        </button>
        <button
          onClick={() => setActiveTable("laborCultural")}
          className={`toggle-button ${activeTable === "laborCultural" ? "active" : ""}`}
        >
          Labor Cultural
        </button>
       
        <button
          onClick={() => setActiveTable("etapas-fenologicas")}
          className={`toggle-button ${activeTable === "etapas-fenologicas" ? "active" : ""}`}
        >
          Etapas Fenológicas
        </button>
      </div>

      {activeTable === "variedades" && (
        <ButtonCrear buttonText="Crear Variedad" ModalComponent={CreateRiceVarietyModal} onSave={handleSave} />
      )}
      {activeTable === "insumos" && (
        <ButtonCrear buttonText="Crear insumo" ModalComponent={CreateInputModal} onSave={handleSave} />
      )}
      {activeTable === "laborCultural" && (
        <ButtonCrear buttonText="Crear labor cultural" ModalComponent={CreateLaborModal} onSave={handleSave} />
      )}
      {activeTable === "maquinaria" && (
        <ButtonCrear buttonText="Crear maquinaria" ModalComponent={CreateMachineryModal} onSave={handleSave} />
      )}
      {activeTable === "etapas-fenologicas" && (
        <ButtonCrear buttonText="Crear etapa fenológica" ModalComponent={CreatePhenologicalStageModal} onSave={handleSave} />
      )}

      {/* Tabla principal */}
      {activeTable === "variedades" && <RiceVarietiesTable refresh={refreshTable} />}
      {activeTable === "insumos" && <InputTable refresh={refreshTable} />}
      {activeTable === "laborCultural" && <LaborCulturalTable refresh={refreshTable} />}
      {activeTable === "maquinaria" && <MachineryTable refresh={refreshTable} />}
      {activeTable === "etapas-fenologicas" && <PhenologicalStageTable refresh={refreshTable} />}
    </div>
  );
};

export default GestionAgricola;
