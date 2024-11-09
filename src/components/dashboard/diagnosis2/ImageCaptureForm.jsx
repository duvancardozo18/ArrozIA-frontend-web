import React, { useState } from 'react';
import { MdCameraAlt } from 'react-icons/md';

const ImageCaptureForm = ({ onImagesSelected }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false); // Definimos cameraOpen como parte del estado
  const videoRef = React.useRef(null);

  const handleImageCapture = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const handleImageSelection = () => {
    onImagesSelected(selectedImages);
  };

  const openCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setSelectedImages((prevImages) => [...prevImages, blob]);
      });
      setCameraOpen(false); // Aquí cerramos la cámara después de capturar la imagen
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="image-capture-form">
      <h2 style={{ color: '#007bff', marginBottom: '25px' }}>Captura o Selección de Imágenes</h2>
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageCapture}
        style={{ marginBottom: '20px' }}
      />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <button onClick={openCamera} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
          <MdCameraAlt size={20} />
          Abrir Cámara
        </button>
        
        <button onClick={handleImageSelection} disabled={selectedImages.length === 0} style={{ padding: '12px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
          Enviar y Predecir
        </button>
      </div>

      {cameraOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
          <video ref={videoRef} autoPlay playsInline width="100%" style={{ borderRadius: '8px', marginBottom: '10px' }} />
          <button onClick={capturePhoto} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
            Capturar Foto
          </button>
        </div>
      )}

      <div className="image-preview">
        {selectedImages.map((image, index) => (
          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt={`preview-${index}`}
            width="250px"
            style={{ borderRadius: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCaptureForm;
