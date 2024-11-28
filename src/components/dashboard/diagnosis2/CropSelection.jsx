import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../config/AuthProvider';
import Header from '../../../components/dashboard/Header';
import { Navigate } from 'react-router-dom';
import CropCard from '../../../components/dashboard/diagnosis2/CropCard';
import ImageCaptureForm from '../../../components/dashboard/diagnosis2/ImageCaptureForm';
import ImageUploadHandler from '../../../components/dashboard/diagnosis2/ImageUploadHandler';
import DiagnosisResultsView from '../../../components/dashboard/diagnosis2/DiagnosisResultsView';
import DiagnosisHistory from '../../../components/dashboard/diagnosis2/DiagnosisHistory';
import styled from 'styled-components';
import { Button } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-right: 20px;
    border-right: 1px solid #ddd;
  }
`;

const Content = styled.div`
  flex: 2;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
  transition: box-shadow 0.3s ease;

  &:focus {
    box-shadow: 0 0 5px 2px rgba(0, 128, 0, 0.4);
  }
`;

const CropSelection = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCropName, setSelectedCropName] = useState('');
  const [images, setImages] = useState([]);
  const [results, setResults] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkIfAdmin = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}/is_admin`);
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkIfAdmin();
  }, [userId]);

  // Obtener las fincas del usuario
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const url = isAdmin ? '/farms' : `/users/${userId}/farms`;
        const response = await axiosInstance.get(url);
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };

    if (isAdmin !== null) {
      fetchFarms();
    }
  }, [isAdmin, userId]);

  // Obtener cultivos relacionados a la finca seleccionada
  useEffect(() => {
    const fetchCropsForFarm = async () => {
      if (!selectedFarmId) return;

      try {
        const response = await axiosInstance.get(`/farms/${selectedFarmId}/crops`);
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCropsForFarm();
  }, [selectedFarmId]);

  const handleFarmSelection = (event) => {
    const farmId = event.target.value;
    setSelectedFarmId(farmId);
    setSelectedCropId(null);
    setSelectedCropName('');
    setCrops([]);
    setImages([]);
    setResults(null);
  };

  const handleCropSelection = (cropId, cropName) => {
    setSelectedCropId(cropId);
    setSelectedCropName(cropName);
    setResults(null);
    setImages([]);
  };

  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
  };

  const handleUploadImages = (uploadResult) => {
    setResults({ ...uploadResult, uploadedImages: images });
  };

  const handleRetakeImages = () => {
    setImages([]);
    setResults(null);
  };

  const handleToggleViewHistory = () => {
    setViewHistory(!viewHistory);
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Diagnóstico Fitosanitario" />
      <Container>
        <Sidebar>
          <h2>Fincas</h2>
          <StyledSelect onChange={handleFarmSelection} value={selectedFarmId || ''}>
            <option value="" disabled>Selecciona una finca</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.nombre}</option>
            ))}
          </StyledSelect>

          {selectedFarmId && (
            <>
              <h2 style={{ marginTop: '20px' }}>Cultivos</h2>
              {crops.map((crop) => (
                <CropCard
                  key={crop.id}
                  cropName={crop.cropName}
                  onClick={() => handleCropSelection(crop.id, crop.cropName)}
                  isSelected={selectedCropId === crop.id}
                />
              ))}
            </>
          )}
        </Sidebar>
        <Content>
          {selectedCropId && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleToggleViewHistory}
                style={{ marginBottom: '20px' }}
              >
                {viewHistory ? 'Realizar Diagnóstico' : 'Ver Historial de Diagnóstico'}
              </Button>

              {viewHistory && (
                <DiagnosisHistory
                  selectedCrop={selectedCropId} // Solo mostramos los historiales para el cultivo seleccionado
                  cropName={selectedCropName}
                />
              )}

              {!viewHistory && !images.length && !results && (
                <ImageCaptureForm onImagesSelected={handleImagesSelected} />
              )}

              {!viewHistory && images.length > 0 && !results && (
                <ImageUploadHandler
                  images={images}
                  cultivoId={selectedCropId}
                  onUploadComplete={handleUploadImages}
                />
              )}

              {!viewHistory && results && (
                <DiagnosisResultsView
                  results={results}
                  onRetakeImages={handleRetakeImages}
                  cropName={selectedCropName}
                />
              )}
            </>
          )}
        </Content>
      </Container>
    </div>
  );
};

export default CropSelection;
