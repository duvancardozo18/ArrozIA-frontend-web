import React, { useContext } from 'react';
import { AuthContext } from "../../config/AuthProvider";
import Header from '../../components/dashboard/Header';
import LandView from '../../components/dashboard/lands/LandView'

import '../../css/Crop.scss';
import { Navigate } from 'react-router-dom';

const Crop = ({ selectedAllotment }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Gestionar Lote" />
      <LandView />
    </div>
  );
};

export default Crop;
