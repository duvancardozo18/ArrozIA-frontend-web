import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../modal/SuccessModal";

// Estilos de modal y elementos
// Estilos de modal y elementos
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
  max-height: 80vh; /* Para limitar la altura del modal */
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
  transition: transform 0.3s ease-in-out;
  overflow-y: auto; /* Agrega scroll vertical si el contenido es muy largo */

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

  input,
  select {
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const EditSoilAnalysisModal = ({ closeModal, onSave, selectedLand, soilAnalysisData }) => {
  const [soilTypes, setSoilTypes] = useState([]);
  const [textures, setTextures] = useState([]);
  const [colors, setColors] = useState([]);
  
  // Agrega los estados que están causando el error:
  const [selectedParameter, setSelectedParameter] = useState(""); // <-- Definir estado para selectedParameter
  const [selectedNutrient, setSelectedNutrient] = useState(""); // <-- Definir estado para selectedNutrient
  
  const [formData, setFormData] = useState({
    lote_id: selectedLand ? selectedLand.id : soilAnalysisData?.lote_id || "",
    lote_name: soilAnalysisData.lote ? soilAnalysisData.lote.nombre : "",
    fecha_analisis: soilAnalysisData ? soilAnalysisData.fecha_analisis : "",
    tipo_suelo_id: soilAnalysisData?.soil_type?.id || "",
    archivo_reporte: null,
    parametro_biologico: {
      biomasa_microbiana: soilAnalysisData?.parametro_biologico?.biomasa_microbiana || "",
      actividad_enzimatica: soilAnalysisData?.parametro_biologico?.actividad_enzimatica || ""
    },
    parametro_quimico: {
      ph: soilAnalysisData?.parametro_quimico?.ph || "",
      conductividad_electrica: soilAnalysisData?.parametro_quimico?.conductividad_electrica || "",
      materia_organica: soilAnalysisData?.parametro_quimico?.materia_organica || "",
      capacidad_intercambio_cationico: soilAnalysisData?.parametro_quimico?.capacidad_intercambio_cationico || "",
      macronutriente: soilAnalysisData?.parametro_quimico?.macronutriente?.[0] || {
        n: "",
        p: "",
        k: "",
        ca: "",
        mg: "",
        s: ""
      },
      micronutriente: soilAnalysisData?.parametro_quimico?.micronutriente?.[0] || {
        fe: "",
        cu: "",
        mn: "",
        zn: "",
        b: ""
      }
    },
    parametro_fisico: {
      textura_id: soilAnalysisData?.parametro_fisico?.textura_id || "",
      densidad_aparente: soilAnalysisData?.parametro_fisico?.densidad_aparente || "",
      profundidad_efectiva: soilAnalysisData?.parametro_fisico?.profundidad_efectiva || "",
      color_id: soilAnalysisData?.parametro_fisico?.color_id || ""
    }
  });

  useEffect(() => {
    // Cargar tipos de suelo, texturas, colores y setear el análisis edafológico al formData
    const fetchSoilTypes = async () => {
      try {
        const response = await axiosInstance.get("/soil_types");
        setSoilTypes(response.data);
      } catch (error) {
        console.error("Error fetching soil types:", error);
      }
    };
  
    const fetchTextures = async () => {
      try {
        const response = await axiosInstance.get("/textures");
        setTextures(response.data);
      } catch (error) {
        console.error("Error fetching textures:", error);
      }
    };
  
    const fetchColors = async () => {
      try {
        const response = await axiosInstance.get("/colors");
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
  
    // Setear datos del análisis edafológico al formData
    if (soilAnalysisData) {
      setFormData({
        ...formData,
        lote_id: selectedLand ? selectedLand.id : soilAnalysisData.lote?.id || "",
        lote_name: selectedLand ? selectedLand.nombre : soilAnalysisData.lote?.nombre || "Nombre no disponible",
        
        
        
        // Agregar otros campos de soilAnalysisData al formData según sea necesario
      });
    }
  
    fetchSoilTypes();
    fetchTextures();
    fetchColors();
  }, [soilAnalysisData, selectedLand]);
  

  const handleChange = (e, group, subGroup) => {
    const { name, value } = e.target;
    if (subGroup) {
      setFormData({
        ...formData,
        [group]: {
          ...formData[group],
          [subGroup]: {
            ...formData[group][subGroup],
            [name]: value
          }
        }
      });
    } else if (group) {
      setFormData({
        ...formData,
        [group]: {
          ...formData[group],
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleParameterChange = (e) => {
    setSelectedParameter(e.target.value);
    setSelectedNutrient(""); // Reset nutrient selection when changing parameter
  };

  const handleNutrientChange = (e) => {
    setSelectedNutrient(e.target.value);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      archivo_reporte: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoSueloId = parseInt(formData.tipo_suelo_id, 10);

    // Comparar para verificar si hubo cambios
  const hasChanges = JSON.stringify(formData) !== JSON.stringify({
    lote_id: soilAnalysisData.lote_id,
    fecha_analisis: soilAnalysisData.fecha_analisis,
    tipo_suelo_id: soilAnalysisData.tipo_suelo_id,
    parametro_biologico: soilAnalysisData.parametro_biologico,
    parametro_quimico: soilAnalysisData.parametro_quimico,
    parametro_fisico: soilAnalysisData.parametro_fisico
  });

  if (!hasChanges) {
    console.log("No hubo cambios en los datos.");
    return;
  }
  
  const dataToSend = {
    lote_id: formData.lote_id,
    fecha_analisis: formData.fecha_analisis,
    tipo_suelo_id: parseInt(formData.tipo_suelo_id, 10),
    archivo_reporte: formData.archivo_reporte,
    parametro_biologico: {
      biomasa_microbiana: parseFloat(formData.parametro_biologico.biomasa_microbiana),
      actividad_enzimatica: parseFloat(formData.parametro_biologico.actividad_enzimatica)
    },
    parametro_quimico: {
      ph: parseFloat(formData.parametro_quimico.ph),
      conductividad_electrica: parseFloat(formData.parametro_quimico.conductividad_electrica),
      materia_organica: parseFloat(formData.parametro_quimico.materia_organica),
      capacidad_intercambio_cationico: parseFloat(formData.parametro_quimico.capacidad_intercambio_cationico),
      macronutriente: [
        {
          n: parseFloat(formData.parametro_quimico.macronutriente.n),
          p: parseFloat(formData.parametro_quimico.macronutriente.p),
          k: parseFloat(formData.parametro_quimico.macronutriente.k),
          ca: parseFloat(formData.parametro_quimico.macronutriente.ca),
          mg: parseFloat(formData.parametro_quimico.macronutriente.mg),
          s: parseFloat(formData.parametro_quimico.macronutriente.s)
        }
      ],
      micronutriente: [
        {
          fe: parseFloat(formData.parametro_quimico.micronutriente.fe),
          cu: parseFloat(formData.parametro_quimico.micronutriente.cu),
          mn: parseFloat(formData.parametro_quimico.micronutriente.mn),
          zn: parseFloat(formData.parametro_quimico.micronutriente.zn),
          b: parseFloat(formData.parametro_quimico.micronutriente.b)
        }
      ]
    },
    parametro_fisico: {
      textura_id: parseInt(formData.parametro_fisico.textura_id, 10),
      densidad_aparente: parseFloat(formData.parametro_fisico.densidad_aparente),
      profundidad_efectiva: parseFloat(formData.parametro_fisico.profundidad_efectiva),
      color_id: parseInt(formData.parametro_fisico.color_id, 10)
    }
  };
  
    console.log("Data to send:", JSON.stringify(dataToSend, null, 2));
  
    try {
      const response = await axiosInstance.put(`/soil_analysis/${formData.lote_id}/${soilAnalysisData.id}`, dataToSend);
      if (response.status === 200 || response.status === 201) {
        console.log("Edición exitosa: llamando a onSave...");
        onSave(); // Esta llamada debe disparar el modal de éxito
        closeModal();
      }
    } catch (error) {
      console.error("Error al actualizar el análisis edafológico:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>×</CloseButton>
        <h2>Editar Análisis de Suelo</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo para el lote */}
          <InputGroup>
            <label>Lote</label>
            <input
              type="text"
              value={formData.lote_name || "Nombre de lote no disponible"}
              readOnly
            />
          </InputGroup>

          {/* Campo de fecha de análisis */}
          <InputGroup>
            <label>Fecha de Análisis</label>
            <input
              type="date"
              name="fecha_analisis"
              value={formData.fecha_analisis}
              onChange={(e) => handleChange(e)}
              required
            />
          </InputGroup>
  
          {/* Campo de tipo de suelo */}
          <InputGroup>
            <label>Tipo de Suelo</label>
            <select
              name="tipo_suelo_id"
              value={formData.tipo_suelo_id}
              onChange={(e) => handleChange(e)}
            >
              {/* Si ya hay un valor, no mostramos la opción "Seleccione..." */}
              {formData.tipo_suelo_id === "" && <option value="">Seleccione...</option>}
              {soilTypes.map((soil) => (
                <option key={soil.id} value={soil.id}>
                  {soil.descripcion}
                </option>
              ))}
            </select>
          </InputGroup>


  
          {/* Campo de archivo de reporte */}
          <InputGroup>
            <label>
              Archivo de Reporte (PDF){" "}
              <span style={{ fontWeight: "normal", fontSize: "0.9em" }}>
                (Opcional)
              </span>
            </label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </InputGroup>
  
          {/* Selector para tipo de parámetro */}
          <InputGroup>
            <label>Seleccione el Tipo de Parámetro</label>
            <select value={selectedParameter} onChange={handleParameterChange}>
              <option value="">Seleccione...</option>
              <option value="parametro_biologico">Parámetro Biológico</option>
              <option value="parametro_quimico">Parámetro Químico</option>
              <option value="parametro_fisico">Parámetro Físico</option>
            </select>
          </InputGroup>
  
          {/* Renderizado condicional para parámetros biológicos */}
          {selectedParameter === "parametro_biologico" && (
            <>
              <h3>Parámetro Biológico</h3>
              <InputGroup>
                <label>Biomasa Microbiana</label>
                <input
                  type="number"
                  name="biomasa_microbiana"
                  value={formData.parametro_biologico.biomasa_microbiana}
                  onChange={(e) => handleChange(e, "parametro_biologico")}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Actividad Enzimática</label>
                <input
                  type="number"
                  name="actividad_enzimatica"
                  value={formData.parametro_biologico.actividad_enzimatica}
                  onChange={(e) => handleChange(e, "parametro_biologico")}
                  required
                />
              </InputGroup>
            </>
          )}
  
          {/* Renderizado condicional para parámetros químicos */}
          {selectedParameter === "parametro_quimico" && (
            <>
              <h3>Parámetro Químico</h3>
              <InputGroup>
                <label>pH</label>
                <input
                  type="number"
                  name="ph"
                  value={formData.parametro_quimico.ph}
                  onChange={(e) => handleChange(e, "parametro_quimico")}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Conductividad Eléctrica</label>
                <input
                  type="number"
                  name="conductividad_electrica"
                  value={formData.parametro_quimico.conductividad_electrica}
                  onChange={(e) => handleChange(e, "parametro_quimico")}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Materia Orgánica</label>
                <input
                  type="number"
                  name="materia_organica"
                  value={formData.parametro_quimico.materia_organica}
                  onChange={(e) => handleChange(e, "parametro_quimico")}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Capacidad de Intercambio Catiónico</label>
                <input
                  type="number"
                  name="capacidad_intercambio_cationico"
                  value={formData.parametro_quimico.capacidad_intercambio_cationico}
                  onChange={(e) => handleChange(e, "parametro_quimico")}
                  required
                />
              </InputGroup>
  
              {/* Selector para tipo de nutriente */}
              <InputGroup>
                <label>Seleccione el Tipo de Nutriente</label>
                <select value={selectedNutrient} onChange={handleNutrientChange}>
                  <option value="">Seleccione...</option>
                  <option value="macronutriente">Macronutrientes</option>
                  <option value="micronutriente">Micronutrientes</option>
                </select>
              </InputGroup>
  
              {/* Renderizado condicional para macronutrientes */}
              {selectedNutrient === "macronutriente" && (
                <>
                  <h4>Macronutrientes</h4>
                  {["n", "p", "k", "ca", "mg", "s"].map((macro) => (
                    <InputGroup key={macro}>
                      <label>{macro.toUpperCase()}</label>
                      <input
                        type="number"
                        name={macro}
                        value={formData.parametro_quimico.macronutriente[macro]}
                        onChange={(e) => handleChange(e, "parametro_quimico", "macronutriente")}
                        required
                      />
                    </InputGroup>
                  ))}
                </>
              )}

              {/* Renderizado condicional para micronutrientes */}
              {selectedNutrient === "micronutriente" && (
                <>
                  <h4>Micronutrientes</h4>
                  {["fe", "cu", "mn", "zn", "b"].map((micro) => (
                    <InputGroup key={micro}>
                      <label>{micro.toUpperCase()}</label>
                      <input
                        type="number"
                        name={micro}
                        value={formData.parametro_quimico.micronutriente[micro]}
                        onChange={(e) => handleChange(e, "parametro_quimico", "micronutriente")}
                        required
                      />
                    </InputGroup>
                  ))}
                </>
              )}
            </>
          )}
  
          {/* Renderizado condicional para parámetros físicos */}
          {selectedParameter === "parametro_fisico" && (
            <>
              <h3>Parámetro Físico</h3>
              <InputGroup>
                <label>Textura</label>
                <select
                  name="textura_id"
                  value={formData.parametro_fisico.textura_id}
                  onChange={(e) => handleChange(e, "parametro_fisico")}
                >
                  <option value="">Seleccione...</option>
                  {textures.map((texture) => (
                    <option key={texture.id} value={texture.id}>
                      {texture.descripcion}
                    </option>
                  ))}
                </select>
              </InputGroup>
  
              <InputGroup>
                <label>Densidad Aparente</label>
                <input
                  type="number"
                  name="densidad_aparente"
                  value={formData.parametro_fisico.densidad_aparente}
                  onChange={(e) => handleChange(e, "parametro_fisico")}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Profundidad Efectiva</label>
                <input
                  type="number"
                  name="profundidad_efectiva"
                  value={formData.parametro_fisico.profundidad_efectiva}
                  onChange={(e) => handleChange(e, "parametro_fisico")}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>Color</label>
                <select
                  name="color_id"
                  value={formData.parametro_fisico.color_id}
                  onChange={(e) => handleChange(e, "parametro_fisico")}
                >
                  <option value="">Seleccione...</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.descripcion}
                    </option>
                  ))}
                </select>
              </InputGroup>
            </>
          )}
  
          {/* Botón para actualizar el análisis */}
          <SubmitButton type="submit">Actualizar Análisis</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );  
};

export default EditSoilAnalysisModal;