// AgriculturalManagement.jsx
import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/dashboard/Header";
import ButtonCrear from "../../components/dashboard/ButtonCreate"; // Aquí está el import de ButtonCrear
import RiceVarietiesTable from "../../components/dashboard/AgriculturalManagement/RiceVariety/RiceVarietiesTable";
import InputTable from "../../components/dashboard/AgriculturalManagement/Input/InputTable";
import CreateInputModal from "../../components/dashboard/AgriculturalManagement/Input/CreateInputModal";
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import CreateRiceVarietyModal from "../../components/dashboard/AgriculturalManagement/RiceVariety/CreateRiceVarietyModal";
import LaborCulturalTable from "../../components/dashboard/AgriculturalManagement/LaborCultural/LaborCulturalTable";
import CreateLaborModal from "../../components/dashboard/AgriculturalManagement/LaborCultural/CreateLaborModal";
import "../../css/AgriculturalManagement.scss"; 

const GestionAgricola = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [refreshTable, setRefreshTable] = useState(false);
  const [activeTable, setActiveTable] = useState("variedades");

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
          onClick={() => setActiveTable("laborCultural")}
          className={`toggle-button ${activeTable === "laborCultural" ? "active" : ""}`}
        >
          Labor Cultural
        </button>
      </div>

      {activeTable === "variedades" && (
        <ButtonCrear
          buttonText="Crear variedad del arroz"
          ModalComponent={CreateRiceVarietyModal}
          onSave={handleSave}
        />
      )}
      {activeTable === "insumos" && (
        <ButtonCrear
          buttonText="Crear insumos agrícolas"
          ModalComponent={CreateInputModal}
          onSave={handleSave}
        />
      )}
      {activeTable === "laborCultural" && (
        <ButtonCrear
          buttonText="Crear Labor Cultural"
          ModalComponent={CreateLaborModal}
          onSave={handleSave}
        />
      )}

      {activeTable === "variedades" ? (
        <RiceVarietiesTable refresh={refreshTable} />
      ) : activeTable === "insumos" ? (
        <InputTable refresh={refreshTable} />
      ) : activeTable === "mecanizacion" ? (
        <div>Tabla de Mecanización</div>
      ) : (
        <LaborCulturalTable refresh={refreshTable} />
      )}
    </div>
  );
};

export default GestionAgricola;
