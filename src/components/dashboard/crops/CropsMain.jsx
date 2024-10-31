import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../../config/AuthProvider";
import Header from '../../../components/dashboard/Header';
import LandView from '../../../components/dashboard/lands/LandView';
import VegetativeCycle from "../../../screens/dashboard/vegetativeCycle";
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import '../../../css/Crop.scss';

const StyledButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #218838;
    transform: translateY(-3px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 10px 3px rgba(39, 174, 96, 0.4);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Crop = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedAllotment, setSelectedAllotment] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSelectAllotment = (allotment, crop) => {
    setSelectedAllotment(allotment);
    setSelectedCrop(crop);
  };

  useEffect(() => {
    console.log("selectedAllotment actualizado:", selectedAllotment);
    console.log("selectedCrop actualizado:", selectedCrop);
  }, [selectedAllotment, selectedCrop]);

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
