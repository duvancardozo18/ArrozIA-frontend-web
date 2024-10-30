import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/dashboard/Header";
import { AuthContext } from "../../config/AuthProvider";
import MechanizationMain from "../../components/dashboard/mechanization/MechanizationMain"; // Componente principal de mecanización
import "../../css/mechanization.scss";

import { Navigate } from "react-router-dom";

const Mechanization = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedOperation, setSelectedOperation] = useState(() => {
    // Intentar recuperar la operación de mecanización seleccionada del almacenamiento local (opcional)
    const savedOperation = localStorage.getItem("selectedOperation");
    return savedOperation ? JSON.parse(savedOperation) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
  }, []);

  // Guardar selectedOperation en el almacenamiento local para que persista entre cargas de página
  useEffect(() => {
    if (selectedOperation) {
      localStorage.setItem("selectedOperation", JSON.stringify(selectedOperation));
    }
  }, [selectedOperation]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Operaciones de Mecanización" />
      <div className="layout">
        {/* Componente que muestra la lista de operaciones de mecanización y los detalles */}
        <MechanizationMain
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Mechanization;
