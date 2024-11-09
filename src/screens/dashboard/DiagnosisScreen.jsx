import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../config/AuthProvider";
import Header from '../../components/dashboard/Header';
import CropSelection from '../../components/dashboard/diagnosis2/CropSelection';
import ImageCaptureForm from '../../components/dashboard/diagnosis2/ImageCaptureForm';
import ImageUploadHandler from '../../components/dashboard/diagnosis2/ImageUploadHandler';
import DiagnosisResultsView from '../../components/dashboard/diagnosis2/DiagnosisResultsView';
import DiagnosisHistory from '../../components/dashboard/diagnosis2/DiagnosisHistory';
import { Navigate } from 'react-router-dom';
import axiosInstance from "../../config/AxiosInstance";
import '../../css/Diagnosis.scss';

const DiagnosisScreen = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [images, setImages] = useState([]);
  const [results, setResults] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    if (selectedCrop) {
      // Fetching diagnosis history or any related data if required
    }
  }, [selectedCrop]);

  const handleCropSelect = (cropId) => {
    setSelectedCrop(cropId);
  };

  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
  };

  const handleUploadImages = () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    axiosInstance.post('/api/diagnosis/upload', formData)
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        console.error("Error uploading images:", error);
      });
  };

  const handleRetakeImages = () => {
    setImages([]);
    setResults(null);
  };

  const handleSaveDiagnosis = () => {
    // Logic to save diagnosis
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Diagnóstico Fitosanitario" />

      {!selectedCrop && (
        <CropSelection onSelectCrop={handleCropSelect} />
      )}

      {selectedCrop && !images.length && !results && (
        <ImageCaptureForm onImagesSelected={handleImagesSelected} />
      )}

      {images.length > 0 && !results && (
        <ImageUploadHandler images={images} onUploadComplete={handleUploadImages} />
      )}

      {results && (
        <DiagnosisResultsView
          results={results}
          onRetakeImages={handleRetakeImages}
          onSaveDiagnosis={handleSaveDiagnosis}
        />
      )}

      {selectedCrop && viewHistory && (
        <DiagnosisHistory selectedCrop={selectedCrop} />
      )}
    </div>
  );
};

export default DiagnosisScreen;
