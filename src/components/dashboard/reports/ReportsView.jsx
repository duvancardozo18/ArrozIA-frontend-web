import React, { useState, useEffect, useRef } from 'react';
import SpaIcon from '@mui/icons-material/Spa';
import axiosInstance from "../../../config/AxiosInstance";
import CropDetails from './CropDetails';

const ReportsView = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const scrollRef = useRef(null);

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

  const handleCropSelect = (cropId) => {
    setSelectedCrop(cropId);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -150,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 150,
      behavior: 'smooth'
    });
  };

  return (
    <div className="reports-view">
      <h2>Reportes</h2>
      
      {/* Navegación de cultivos */}
      <div className="crop-navigation">
        <button className="arrow-button green" onClick={scrollLeft}>{"<"}</button>
        <div className="crop-navigation-scroll" ref={scrollRef}>
          {(crops || []).map((crop) => (
            <div
              key={crop.id}
              className={`crop-card ${selectedCrop === crop.id ? 'selected' : ''}`}
              onClick={() => handleCropSelect(crop.id)}
            >
              <div className="icon-container">
                <SpaIcon style={{ color: 'white', fontSize: 24 }} />
              </div>
              <span>{crop.cropName}</span>
            </div>
          ))}
        </div>
        <button className="arrow-button green" onClick={scrollRight}>{">"}</button>
      </div>

      {/* Detalles del cultivo seleccionado */}
      {selectedCrop ? (
        <CropDetails selectedCropId={selectedCrop} onClose={() => setSelectedCrop(null)} />
      ) : (
        <p>Selecciona un cultivo para ver los detalles...</p>
      )}
    </div>
  );
};

export default ReportsView;
