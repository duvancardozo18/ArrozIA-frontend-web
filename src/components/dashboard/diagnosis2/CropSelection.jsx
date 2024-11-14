import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../config/AuthProvider';
import Header from '../../../components/dashboard/Header';
import { Navigate } from 'react-router-dom';
import CropCard from '../../../components/dashboard/diagnosis2/CropCard';
import ImageCaptureForm from '../../../components/dashboard/diagnosis2/ImageCaptureForm';
import ImageUploadHandler from '../../../components/dashboard/diagnosis2/ImageUploadHandler';
import DiagnosisResultsView from '../../../components/dashboard/diagnosis2/DiagnosisResultsView';
import DiagnosisHistory from '../../../components/dashboard/diagnosis2/DiagnosisHistory';
import DiagnosisDetailView from '../../../components/dashboard/diagnosis2/DiagnosisDetailView';
import styled from 'styled-components';
import { Button, Dialog } from '@mui/material';
import axiosInstance from '../../../config/AxiosInstance';

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const Sidebar = styled.div`
  width: 30%;
  padding-right: 20px;
  border-right: 1px solid #ddd;
`;

const Content = styled.div`
  width: 70%;
  padding-left: 20px;
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
    box-shadow: 0 0 5px 2px rgba(0, 128, 0, 0.4); /* Sombra verde */
  }
`;

const CropSelection = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCropName, setSelectedCropName] = useState('');
  const [images, setImages] = useState([]);
  const [results, setResults] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

    // Verificar si el usuario es administrador
    const checkIfAdmin = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}/is_admin`);
        setIsAdmin(response.data.is_admin); // Usar la respuesta para determinar si es admin
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };    



  // Obtener las fincas del usuario
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const url = isAdmin ? "/farms" : `/users/${userId}/farms`;
        const response = await axiosInstance.get('/farms');
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };
    //fetchFarms();
  }, []);


  useEffect(() => {
    checkIfAdmin(); // Verificar si el usuario es administrador al cargar el componente
  }, []);

  useEffect(() => {
    if (isAdmin !== null) { // Esperar a que se determine el rol del usuario
      fetchFarms();
    }
  }, [isAdmin]);

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
    setSelectedCropId(null); // Restablece la selección de cultivo
    setSelectedCropName(''); // Limpiar el nombre del cultivo
    setCrops([]); // Limpiar los cultivos al cambiar finca
    setImages([]); // Limpiar imágenes al cambiar finca
    setResults(null); // Limpiar resultados al cambiar finca
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

  const handleSelectDiagnosis = (diagnosisId) => {
    setSelectedDiagnosisId(diagnosisId);
  };

  const handleCloseDiagnosisDetails = () => {
    setSelectedDiagnosisId(null);
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
                />
              ))}
            </>
          )}
        </Sidebar>
        <Content>
          {!selectedCropId && <p>Seleccione un cultivo para iniciar el diagnóstico.</p>}

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
                  selectedCrop={selectedCropId}
                  cropName={selectedCropName}
                  onSelectDiagnosis={handleSelectDiagnosis}
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

              {selectedDiagnosisId && (
                <Dialog
                  open={Boolean(selectedDiagnosisId)}
                  onClose={handleCloseDiagnosisDetails}
                  fullWidth
                  maxWidth="md"
                >
                  <DiagnosisDetailView diagnosisId={selectedDiagnosisId} />
                </Dialog>
              )}
            </>
          )}
        </Content>
      </Container>
    </div>
  );
};

export default CropSelection;
