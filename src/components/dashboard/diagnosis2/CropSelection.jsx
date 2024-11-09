import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../config/AuthProvider';
import Header from '../Header';
import { Navigate } from 'react-router-dom';
import CropCard from './CropCard';
import ImageCaptureForm from './ImageCaptureForm';
import ImageUploadHandler from './ImageUploadHandler';
import DiagnosisResultsView from './DiagnosisResultsView';
import DiagnosisHistory from './DiagnosisHistory';
import DiagnosisDetailView from './DiagnosisDetailView';
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

const CropSelection = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCropName, setSelectedCropName] = useState('');
  const [images, setImages] = useState([]);
  const [results, setResults] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axiosInstance.get('/crops/all');
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };
    fetchCrops();
  }, []);

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
          <h2>Cultivos</h2>
          {crops.map((crop) => (
            <CropCard
              key={crop.id}
              cropName={crop.cropName}
              onClick={() => handleCropSelection(crop.id, crop.cropName)}
            />
          ))}
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
                <DiagnosisHistory selectedCrop={selectedCropId} cropName={selectedCropName} onSelectDiagnosis={handleSelectDiagnosis} />
              )}

              {!viewHistory && !images.length && !results && (
                <ImageCaptureForm onImagesSelected={handleImagesSelected} />
              )}

              {!viewHistory && images.length > 0 && !results && (
                <ImageUploadHandler images={images} cultivoId={selectedCropId} onUploadComplete={handleUploadImages} />
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
