// CropListView.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import CropCard from './CropCard';
import styled from 'styled-components';

const CropListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
`;

const CropListView = () => {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axiosInstance.get('/crops/all');
        setCrops(response.data); // Almacena los cultivos en el estado
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, []);

  return (
    <CropListContainer>
      <h2>Cultivos</h2>
      {crops.map((crop) => (
        <CropCard key={crop.id} cropName={crop.nombre_cultivo} />
      ))}
    </CropListContainer>
  );
};

export default CropListView;
