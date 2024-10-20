import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../config/AxiosInstance';  
import SuccessModal from '../modal/SuccessModal';  
import MapsLeaflet from "./MapsLeaflet";
import { API_URL } from '../../../config/apiConfig';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px) scale(1.03) perspective(1000px);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;  
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;  
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      transform: translateY(-3px);
      outline: none;
    }
  }
`;

const SuggestionBox = styled.ul`
  list-style: none;
  background: white;
  border: 1px solid #ddd;
  max-height: 150px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const EditFarmModal = ({ show, closeModal, farm, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    area_total: "",
    latitud: null,
    longitud: null,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]); // Para manejar las sugerencias de municipios

  useEffect(() => {
    if (farm) {
      setFormData({
        nombre: farm.nombre,
        ubicacion: farm.ubicacion,
        area_total: farm.area_total,
        latitud: farm.latitud,
        longitud: farm.longitud,
      });
    }
  }, [farm]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'ubicacion' && value.length > 2) {
      await fetchCities(value);
    }
  };

  // Función para buscar municipios en la API
  const fetchCities = async (value) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/City/search/${value}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSuggestions([]);
    }
  };

  // Función para manejar la selección de un municipio y obtener las coordenadas
  const handleSelectCity = async (city) => {
    try {
      const cityName = city.name;
      
      // Realiza una solicitud a la API de Nominatim para obtener las coordenadas basadas en el nombre de la ciudad
      const response = await axiosInstance.get(`https://nominatim.openstreetmap.org/search?q=${cityName}, Colombia&format=json`);
      
      const locationData = response.data[0]; // Toma el primer resultado de la búsqueda

      if (locationData) {
        // Actualiza los datos del formulario con la latitud y longitud obtenida
        setFormData({
          ...formData,
          ubicacion: cityName,
          latitud: locationData.lat,
          longitud: locationData.lon,
        });
      } else {
        console.error("No se encontraron coordenadas para la ciudad:", cityName);
      }
    } catch (error) {
      console.error("Error al obtener coordenadas por nombre de ciudad:", error);
    }

    setSuggestions([]); // Limpiar sugerencias después de seleccionar
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage('');
      const response = await axiosInstance.put(`/update/farm/${farm.id}`, formData);
      setShowSuccessModal(true);
      onSave(response.data);
    } catch (error) {
      setErrorMessage('Error actualizando la finca.');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  if (!show && !showSuccessModal) return null;

  return (
    <>
      {show && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Finca</h2>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <label>Nombre de la Finca</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Área Total (m²)</label>
                <input
                  type="number"
                  name="area_total"
                  value={formData.area_total}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <label>Municipio / Vereda</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                />
                {/* Mostrar sugerencias si las hay */}
                {suggestions.length > 0 && (
                  <SuggestionBox>
                    {suggestions.map((city) => (
                      <SuggestionItem key={city.id} onClick={() => handleSelectCity(city)}>
                        {city.name}
                      </SuggestionItem>
                    ))}
                  </SuggestionBox>
                )}
              </InputGroup>
              {/* Mapa actualizado con la latitud y longitud del municipio seleccionado */}
              <MapsLeaflet formData={formData} setFormData={setFormData} />
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {showSuccessModal && <SuccessModal message="¡Cambios Guardados!" onClose={handleCloseSuccessModal} />}
    </>
  );
};

export default EditFarmModal;