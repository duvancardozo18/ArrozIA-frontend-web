import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/dashboard/Header";
import { AuthContext } from "../../config/AuthProvider";
import FarmMain from "../../components/dashboard/farms/FarmMain";
import AllotmentMain from "./Lands";
import "../../css/Farms.scss";
import { Navigate } from "react-router-dom";

const Farms = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedFarm, setSelectedFarm] = useState(() => {
    // Intentar recuperar la finca seleccionada del almacenamiento local (opcional)
    const savedFarm = localStorage.getItem("selectedFarm");
    return savedFarm ? JSON.parse(savedFarm) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      console.log("Token found in localStorage:", token);
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  // Guardar selectedFarm en el almacenamiento local para que persista entre cargas de página
  useEffect(() => {
    if (selectedFarm) {
      localStorage.setItem("selectedFarm", JSON.stringify(selectedFarm));
    }
  }, [selectedFarm]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Fincas" />
      <div className="layout">
        <AllotmentMain selectedFarm={selectedFarm} isDarkMode={isDarkMode} />
        <FarmMain
          selectedFarm={selectedFarm}
          setSelectedFarm={setSelectedFarm}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Farms;
