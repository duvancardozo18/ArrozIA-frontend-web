import React, { useContext, useState, useEffect } from 'react';
import { AreaTop } from "../../components";
import { AuthContext } from "../../config/AuthProvider";
import FarmMain from '../../components/dashboard/fincas/finca/FarmMain'; // Revisa si la ruta es correcta
import AllotmentMain from '../../components/dashboard/fincas/lotes/AllotmentMain';// Revisa si la ruta es correcta
import './Fincas.scss';
import { Navigate } from 'react-router-dom';

const Fincas = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('Token found in localStorage:', token);
    } else {
      console.log('No token found in localStorage');
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <AreaTop title="Fincas, Lotes y Cultivos" />
      <div className="layout"> {/* Add this class here */}
        <AllotmentMain 
        selectedFarm={selectedFarm} 
        isDarkMode={isDarkMode} />
        <FarmMain
          selectedFarm={selectedFarm} 
          setSelectedFarm={setSelectedFarm} 
          isDarkMode={isDarkMode} 
        />
      </div>
    </div>
  );
};

export default Fincas;
