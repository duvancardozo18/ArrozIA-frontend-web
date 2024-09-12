import React, { useContext, useState, useEffect } from 'react';
import { AreaTop } from "../../components";
import { AuthContext } from "../../config/AuthProvider";
import FarmMain from '../../components/dashboard/fincas/finca/FarmMain';// Asegúrate de que la ruta sea correcta
import AllotmentMain from '../../components/dashboard/fincas/lotes/AllotmentMain'; // Asegúrate de que la ruta sea correcta
import './Fincas.scss';
import { Navigate } from 'react-router-dom';

const Fincas = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [fincaSeleccionada, setFincaSeleccionada] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('Token encontrado en localStorage:', token);
    } else {
      console.log('No se encontró ningún token en localStorage');
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <AreaTop title="Fincas, Lotes y Cultivos" />
      <div className="layout"> {/* Agrega esta clase aquí */}
        <AllotmentMain fincaSeleccionada={fincaSeleccionada} isDarkMode={isDarkMode} />
        <FarmMain
          fincaSeleccionada={fincaSeleccionada} 
          setFincaSeleccionada={setFincaSeleccionada} 
          isDarkMode={isDarkMode} 
        />
      </div>
    </div>
  );
  
};

export default Fincas;
