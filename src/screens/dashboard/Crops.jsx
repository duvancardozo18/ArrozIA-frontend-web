import React, { useContext } from 'react';
import { AuthContext } from "../../config/AuthProvider";
import Header from '../../components/dashboard/Header';
import CropMain from '../../components/dashboard/crops/CropMain'

import '../../css/Crop.scss';
import { Navigate } from 'react-router-dom';

const Crop = ({ selectedAllotment }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Cultivos" />
      <CropMain />
    </div>
  );
};

export default Crop;
