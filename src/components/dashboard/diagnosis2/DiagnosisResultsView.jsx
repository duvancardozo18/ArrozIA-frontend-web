import React from 'react';
import '../../../css/ImageCaptureForm.css';

const DiagnosisResultsView = ({ results, onRetakeImages, cropName }) => {
  if (!results || !results.prediction) {
    return <p>No hay resultados disponibles.</p>;
  }

  const { prediction, uploadedImages } = results;
  const {
    confianza_promedio,
    fecha_diagnostico,
    id,
    imagenes_analizadas,
    exportado,
    comparacion_diagnostico,
    resultado_ia,
  } = prediction;

  // Mapeo de traducción de resultados al español
  const resultadoTraducido = {
    leaf_blast: "Tizón de la hoja",
    sheath_blight: "Añublo de la vaina",
    bacterial_leaf_blight: "Tizón bacteriano de la hoja",
    brown_spot: "Mancha marrón",
    healthy: "Sin enfermedades detectadas",
  };

  // Mensaje relacionado con el resultado
  const mensajeResultado = {
    leaf_blast: "Se recomienda aplicar fungicidas específicos para controlar el Tizón de la hoja.",
    sheath_blight: "Revisa la humedad del suelo, ya que el Añublo de la vaina se ve favorecido por condiciones húmedas.",
    bacterial_leaf_blight: "El Tizón bacteriano de la hoja puede ser controlado con una buena gestión del riego.",
    brown_spot: "La Mancha marrón puede ser causada por deficiencias de nutrientes. Considera fertilizar adecuadamente.",
    healthy: "¡El cultivo se encuentra en buen estado! Continúa con el manejo adecuado para mantenerlo saludable.",
  };

  const resultadoEnEspanol = resultadoTraducido[resultado_ia] || "Resultado no identificado";
  const mensaje = mensajeResultado[resultado_ia] || "No hay recomendaciones disponibles para este diagnóstico.";

  return (
    <div className="diagnosis-results-view">
      <h2>Resultados del Diagnóstico</h2>
      <div className="results">
        <div className="result-item">
          {/* Mostrar la imagen que se subió */}
          {uploadedImages && uploadedImages.length > 0 && (
            <div className="image-container">
              <img src={URL.createObjectURL(uploadedImages[0])} alt="Resultado del diagnóstico" />
            </div>
          )}
          <div className="result-details-container">
            <table className="result-table">
              <tbody>
                <tr>
                  <th>Nombre del Cultivo:</th>
                  <td>{cropName}</td>
                </tr>
                <tr>
                  <th>Confianza:</th>
                  <td>{confianza_promedio ? (confianza_promedio * 10).toFixed(2) + '%' : 'N/A'}</td>
                </tr>
                <tr>
                  <th>Fecha del Diagnóstico:</th>
                  <td>{fecha_diagnostico ? new Date(fecha_diagnostico).toLocaleDateString() : 'N/A'}</td>
                </tr>
                <tr>
                  <th>ID del Diagnóstico:</th>
                  <td>{id}</td>
                </tr>
                <tr>
                  <th>Imágenes Analizadas:</th>
                  <td>{imagenes_analizadas}</td>
                </tr>
                <tr>
                  <th>Exportado:</th>
                  <td>{exportado ? 'Sí' : 'No'}</td>
                </tr>
                <tr>
                  <th>Comparación Diagnóstico:</th>
                  <td>{comparacion_diagnostico || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Resaltar el resultado de IA */}
        <div className="highlight-box">
          <div className="highlight-text">Resultado del Análisis</div>
          <div className="prediction-result">{resultadoEnEspanol}</div>
          <div className="mensaje-resultado">{mensaje}</div>
        </div>
      </div>

      <div className="actions">
        <button className="custom-button" onClick={onRetakeImages}>
          Capturar Nuevas Imágenes
        </button>
      </div>
    </div>
  );
};

export default DiagnosisResultsView;
