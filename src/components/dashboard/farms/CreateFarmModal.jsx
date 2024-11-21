import React, { useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../modal/SuccessModal";
import MapsLeaflet from "./MapsLeaflet";
import AsyncSelect from 'react-select/async';
import styles from '../../../css/NewFarm.module.scss';

const NewFarm = ({ closeModal, addFarm }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    area_total: "",
    latitud: null,
    longitud: null,
    ciudad: "",
    departamento: "",
    pais: "Colombia",
    descripcion: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchDepartments = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return [];
    try {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/departments/filter?query=${inputValue}`);
      const options = response.data.map((department) => ({
        value: department.id,
        label: department.departamento,
      }));
      return options;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };

  const fetchCities = async (inputValue) => {
    if (!inputValue || inputValue.length < 1 || !selectedDepartment) return [];
    try {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/departments/${selectedDepartment.value}/cities/filter?query=${inputValue}`);
      const options = response.data.ciudades.map((city) => ({
        value: city,
        label: city,
      }));
      return options;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  const handleSelectDepartment = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setFormData({ ...formData, departamento: selectedOption ? selectedOption.label : "" });
    setSelectedCity(null);
  };

  const handleSelectCity = async (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData({ ...formData, ciudad: selectedOption ? selectedOption.label : "" });
    if (selectedOption) {
      const cityName = selectedOption.label;
      try {
        const response = await axiosInstance.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}, Colombia&format=json`);
        const locationData = response.data[0];
        if (locationData) {
          setFormData({
            ...formData,
            ciudad: cityName,
            latitud: locationData.lat,
            longitud: locationData.lon,
          });
        } else {
          console.error("No se encontraron coordenadas para la ciudad:", cityName);
        }
      } catch (error) {
        console.error("Error al obtener coordenadas por nombre de ciudad:", error);
      }
    } else {
      setFormData({
        ...formData,
        ciudad: "",
        latitud: null,
        longitud: null,
      });
    }
  };

  const updateLocationData = async (newPosition) => {
    try {
      const [lat, lon] = newPosition;
      const response = await axiosInstance.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      const address = response.data.address;
      console.log("Datos de geocodificación inversa:", address);

      setFormData((prevData) => ({
        ...prevData,
        latitud: lat.toString(),
        longitud: lon.toString(),
        departamento: address.state || "No disponible",
        ciudad: address.city || address.town || address.village || "No disponible",
      }));
    } catch (error) {
      console.error("Error al obtener la ciudad y el departamento:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      const farmData = {
        ...formData,
        area_total: formData.area_total ? parseFloat(formData.area_total) : null,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        ubicacion: formData.descripcion,  // Reemplaza "descripcion" con "ubicacion"
      };
      delete farmData.descripcion;  // Elimina el campo "descripcion" del objeto

      // Consola para verificar los datos que se enviarán en el POST
      console.log("Datos preparados para enviar:", farmData);

      await axiosInstance.post("/register-farm", farmData);
      setShowSuccessModal(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Error al crear la finca.");
      } else {
        setErrorMessage("Error inesperado al crear la finca.");
      }
    }
  };

  const handleCloseSuccessModal = async () => {
    setShowSuccessModal(false);
    await addFarm();
    closeModal();
  };

  return (
    <>
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-content"]}>
          <button className={styles["close-button"]} onClick={closeModal}>×</button>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Crear Finca</h2>
          {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}

          {/* Contenedor de advertencia 
          <div className={styles["warning-container"]}>
            <p>
              Puedes seleccionar manualmente tu ubicación introduciendo los datos de Departamento, Ciudad, Latitud y Longitud,
              o bien, hacer clic en el mapa para que se complete automáticamente.
            </p>
          </div>*/}

          <form onSubmit={handleSubmit}>
            <div className={styles["input-group"]}>
              <label>Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required maxLength={50} />
            </div>
            <div className={styles["input-group"]}>
              <label>Área Total (m²)</label>
              <input
                type="number"
                name="area_total"
                value={formData.area_total}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 8) {
                    handleChange(e); 
                  }
                }}
                required
               
              />
            </div>
            <div className={styles["input-group"]}>
              <label>Departamento</label>
              <AsyncSelect
                cacheOptions
                loadOptions={fetchDepartments}
                defaultOptions={true}
                onChange={handleSelectDepartment}
                placeholder=""
                isClearable
                value={selectedDepartment}
                noOptionsMessage={() => "Escribe el nombre del Departamento"}
                required
              />
            </div>
            <div className={styles["input-group"]}>
              <label style={{ display: "none" }}>Departamento (Obtenido del mapa)</label>
              <input type="text" value={formData.departamento} readOnly style={{ display: "none" }}/>
            </div>
            <div className={styles["input-group"]}>
              <label>Ciudad</label>
              <AsyncSelect
                cacheOptions
                loadOptions={fetchCities}
                defaultOptions={true}
                onChange={handleSelectCity}
                placeholder=""
                isClearable
                value={selectedCity}
                isDisabled={!selectedDepartment}
                menuPortalTarget={document.body}
                required
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: '10px',
                    padding: '2px',
                    borderColor: '#ddd',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#aaa' },
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                noOptionsMessage={() => "Escribe el nombre del municipio"}
              />
            </div>
            <div className={styles["input-group"]}>
              <label style={{ display: "none" }}>Ciudad (Obtenido del mapa)</label>
              <input type="text" value={formData.ciudad} readOnly style={{ display: "none" }}/>
            </div>

            <div className={styles["input-group"]}>
              <label>Latitud</label>
              <input
                type="number"
                name="latitud"
                value={formData.latitud || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 9 && value >= -90 && value <= 90) {
                    handleChange(e);
                  }
                }}
                placeholder=""
                required
                step="0.000001"
              />
            </div>
            <div className={styles["input-group"]}>
              <label>Longitud</label>
              <input
                type="number"
                name="longitud"
                value={formData.longitud || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 9 && value >= -180 && value <= 180) {
                    handleChange(e);
                  }
                }}
                placeholder=""
                required
                step="0.000001"
              />
            </div>
            <div className={styles["input-group"]}>
              <label>Detalles de su ubicación</label>
              <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} maxLength={50  	} placeholder="Detalles adicionales de ubicación (opcional)" />
            </div>
            <MapsLeaflet formData={formData} setFormData={setFormData} updateLocationData={updateLocationData} />
            <button type="submit" className={styles["submit-button"]}>Crear</button>
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal message="¡Finca Creada!" onClose={handleCloseSuccessModal} />
      )}
    </>
  );
};

export default NewFarm;
