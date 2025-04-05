import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../config/AuthProvider";
import Header from '../../components/dashboard/Header';
import '../../css/Crop.css';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from "../../config/AxiosInstance";

const Crop = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const navigate = useNavigate();

  // Obtener todos los cultivos al cargar el componente
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axiosInstance.get('/crops/all');
        setCrops(response.data);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };
    fetchCrops();
  }, []);

  // Manejar la selección del cultivo y navegar a la ruta con plotId
  const handleSelectChange = (event) => {
    const selectedCropId = event.target.value;
    const selectedCrop = crops.find(crop => crop.id === parseInt(selectedCropId));

    if (selectedCrop && selectedCrop.plotId) {
      navigate(`/land-view/${selectedCrop.plotId}`);
    } else {
      console.warn("No plotId found for this crop");
      // Opcionalmente, muestra un mensaje al usuario
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <Header title="Cultivos" />

      {/* Select para listar los cultivos */}
      <div className="crop-select">
        <label htmlFor="crop-select">Selecciona un Cultivo:</label>
        <select id="crop-select" onChange={handleSelectChange}>
          <option value="">Selecciona un cultivo</option>
          {crops.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.cropName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Crop;
