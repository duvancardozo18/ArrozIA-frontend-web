import React, { useState } from 'react';
import { MdCameraAlt } from 'react-icons/md';
import '../../../css/ImageCaptureForm.scss';


const ImageCaptureForm = ({ onImagesSelected }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
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
      setCameraOpen(false);
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="image-capture-form">
      <h2>Captura o Selección de Imágenes</h2>
      <input type="file" accept="image/*" multiple onChange={handleImageCapture} />
      
      <div className="button-group">
        <button className="btn camera-btn" onClick={openCamera}>
          <MdCameraAlt size={20} />
          Abrir Cámara
        </button>
        
        <button className="btn predict-btn" onClick={handleImageSelection} disabled={selectedImages.length === 0}>
          Enviar y Predecir
        </button>
      </div>

      {cameraOpen && (
        <div className="camera-preview">
          <video ref={videoRef} autoPlay playsInline />
          <button className="btn capture-btn" onClick={capturePhoto}>
            Capturar Foto
          </button>
        </div>
      )}

      <div className="image-preview">
        {selectedImages.map((image, index) => (
          <img key={index} src={URL.createObjectURL(image)} alt={`preview-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ImageCaptureForm;
