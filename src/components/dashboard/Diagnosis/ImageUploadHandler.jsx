import React, { useState } from 'react';
import axiosInstance from '../../../config/AxiosInstance';

const ImageUploadHandler = ({ images, cultivoId, onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = () => {
    const formData = new FormData();

    // Añadir cada imagen al FormData
    images.forEach((image) => {
      formData.append('file', image);
    });

    // Asegurarse de que `cultivo_id` se pase como FormData
    formData.append('cultivo_id', cultivoId);

    setIsUploading(true);

    axiosInstance.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      },
    })
      .then((response) => {
        console.log('Upload successful:', response.data);
        setIsUploading(false);
        onUploadComplete(response.data); // Pasar el resultado al componente padre
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
        setIsUploading(false);
      });
  };

  return (
    <div className="image-upload-handler">
      <h2>Envío de Imágenes para Diagnóstico</h2>
      <button onClick={handleImageUpload} disabled={isUploading || images.length === 0}>
        {isUploading ? 'Subiendo...' : 'Subir Imágenes'}
      </button>
      {isUploading && <p>Progreso: {uploadProgress}%</p>}
    </div>
  );
};

export default ImageUploadHandler;
