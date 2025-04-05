import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axiosInstance from "../../../config/AxiosInstance";
import "../../../css/ViewModal.css"; // Asegúrate de importar tu css

const ViewSoilAnalysisModal = ({ show, closeModal, selectedLand, selectedAnalysis }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (show && selectedLand?.id && selectedAnalysis?.id) {
      fetchSoilAnalysisDetails();
    }
  }, [show, selectedLand, selectedAnalysis]);

  const fetchSoilAnalysisDetails = async () => {
    try {
      const response = await axiosInstance.get(`/soil_analysis/${selectedLand.id}/${selectedAnalysis.id}`);
      console.log("Datos recibidos del análisis edafológico:", response.data);
      setAnalysisData(response.data);
    } catch (error) {
      console.error("Error al obtener detalles del análisis edafológico:", error);
      setErrorMessage("Error al cargar los detalles del análisis.");
    }
  };

  if (!show) return null;

  // Ajustar la desestructuración con base en la estructura recibida desde el backend
  const {
    fecha_analisis,
    soil_type,
    parametro_fisico,
    parametro_quimico,
    parametro_biologico,
  } = analysisData || {};

  // Extraer los valores necesarios de los datos recibidos
  const tipoSueloDescripcion = soil_type?.descripcion || "N/A";
  const texturaDescripcion = parametro_fisico?.textura_descripcion || "N/A";
  const colorDescripcion = parametro_fisico?.color_descripcion || "N/A";

  // Extraer los valores de macronutriente y micronutriente (si existen)
  const macronutriente = parametro_quimico?.macronutriente?.[0] || {};
  const micronutriente = parametro_quimico?.micronutriente?.[0] || {};

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <h2 className="title">Detalles del Análisis Edafológico del lote {selectedLand.nombre}</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="details-grid">
          {/* Datos Básicos */}
          <div className="details-column">
            <h3>Datos Básicos</h3>
            <p><strong>Fecha del Análisis:</strong> {fecha_analisis || "N/A"}</p>
            <p><strong>Tipo de Suelo:</strong> {tipoSueloDescripcion}</p>
          </div>

          {/* Parámetros Químicos */}
          <div className="details-column">
            <h3>Parámetros Químicos</h3>
            <p><strong>pH:</strong> {parametro_quimico?.ph || "N/A"}</p>
            <p><strong>Conductividad Eléctrica:</strong> {parametro_quimico?.conductividad_electrica || "N/A"}</p>
            <p><strong>Materia Orgánica:</strong> {parametro_quimico?.materia_organica || "N/A"}%</p>
            <p><strong>Capacidad de Intercambio Catiónico:</strong> {parametro_quimico?.capacidad_intercambio_cationico || "N/A"}</p>

            <h4>Macronutrientes</h4>
            <p><strong>N:</strong> {macronutriente.n || "N/A"}</p>
            <p><strong>P:</strong> {macronutriente.p || "N/A"}</p>
            <p><strong>K:</strong> {macronutriente.k || "N/A"}</p>
            <p><strong>Ca:</strong> {macronutriente.ca || "N/A"}</p>
            <p><strong>Mg:</strong> {macronutriente.mg || "N/A"}</p>
            <p><strong>S:</strong> {macronutriente.s || "N/A"}</p>

            <h4>Micronutrientes</h4>
            <p><strong>Fe:</strong> {micronutriente.fe || "N/A"}</p>
            <p><strong>Cu:</strong> {micronutriente.cu || "N/A"}</p>
            <p><strong>Mn:</strong> {micronutriente.mn || "N/A"}</p>
            <p><strong>Zn:</strong> {micronutriente.zn || "N/A"}</p>
            <p><strong>B:</strong> {micronutriente.b || "N/A"}</p>
          </div>

          {/* Parámetros Físicos */}
          <div className="details-column">
            <h3>Parámetros Físicos</h3>
            <p><strong>Textura:</strong> {texturaDescripcion}</p>
            <p><strong>Densidad Aparente:</strong> {parametro_fisico?.densidad_aparente || "N/A"}</p>
            <p><strong>Profundidad Efectiva:</strong> {parametro_fisico?.profundidad_efectiva || "N/A"}</p>
            <p><strong>Color:</strong> {colorDescripcion}</p>
          </div>

          {/* Parámetros Biológicos */}
          <div className="details-column">
            <h3>Parámetros Biológicos</h3>
            <p><strong>Biomasa Microbiana:</strong> {parametro_biologico?.biomasa_microbiana || "N/A"}</p>
            <p><strong>Actividad Enzimática:</strong> {parametro_biologico?.actividad_enzimatica || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewSoilAnalysisModal;
