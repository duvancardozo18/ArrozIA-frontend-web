import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../../config/AuthProvider";
import Header from '../../../components/dashboard/Header';
import LandView from '../../../components/dashboard/lands/LandView';
import VegetativeCycle from "../../../screens/dashboard/vegetativeCycle";
import '../../../css/Crop.scss';
import { Navigate } from 'react-router-dom';

const Crop = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedAllotment, setSelectedAllotment] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSelectAllotment = (allotment) => {
    setSelectedAllotment(allotment);
  };

  useEffect(() => {
    console.log("selectedAllotment actualizado:", selectedAllotment);
  }, [selectedAllotment]);

  return (
    <div className="content-area">
      <Header title="Gestionar Cultivo" />
      <LandView onSelectAllotment={handleSelectAllotment} />
      {selectedAllotment && (
        <VegetativeCycle selectedAllotment={selectedAllotment} />
      )}
    </div>
  );
};

export default Crop;
