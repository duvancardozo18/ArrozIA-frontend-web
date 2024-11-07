import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";

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

const CreateSoilAnalysisModal = ({ closeModal, onSave, selectedLand }) => {
  console.log("Nombre del lote seleccionado al abrir el modal:", selectedLand ? selectedLand.nombre : "No hay lote seleccionado");
  const [soilTypes, setSoilTypes] = useState([]);
  const [textures, setTextures] = useState([]);
  const [colors, setColors] = useState([]);
  const [formData, setFormData] = useState({
    lote_id: selectedLand ? selectedLand.id : "",
    lote_name: selectedLand ? selectedLand.nombre : "",
    fecha_analisis: "",
    tipo_suelo_id: "",
    archivo_reporte: null,
    parametro_biologico: {
      biomasa_microbiana: "",
      actividad_enzimatica: ""
    },
    parametro_quimico: {
      ph: "",
      conductividad_electrica: "",
      materia_organica: "",
      capacidad_intercambio_cationico: "",
      macronutriente: {
        n: "",
        p: "",
        k: "",
        ca: "",
        mg: "",
        s: ""
      },
      micronutriente: {
        fe: "",
        cu: "",
        mn: "",
        zn: "",
        b: ""
      }
    },
    parametro_fisico: {
      textura_id: "",
      densidad_aparente: "",
      profundidad_efectiva: "",
      color_id: ""
    }
  });

  useEffect(() => {
    if (selectedLand) {
      setFormData((prevData) => ({ ...prevData, lote_id: selectedLand.id })); // Use selectedLand.id instead of selectedLand.nombre
    }  

    const fetchSoilTypes = async () => {
      try {
        const response = await axiosInstance.get("/soil_types");
        console.log("Fetched soil types:", response.data); // Log to see the data being fetched
        setSoilTypes(response.data);
      } catch (error) {
        console.error("Error fetching soil types:", error);
      }
    };

    const fetchTextures = async () => {
      try {
        const response = await axiosInstance.get("/textures");
        console.log("traer los tipos de textura de la bd:", response.data); // Log to see the data being fetched
        setTextures(response.data);
      } catch (error) {
        console.error("Error fetching textures:", error);
      }
    };

    const fetchColors = async () => {
      try {
        const response = await axiosInstance.get("/colors");
        console.log("traer los colores de la bd:", response.data); // Log to see the data being fetched
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchSoilTypes();
    fetchTextures();
    fetchColors();
  }, [selectedLand]);

   // Log current state just before rendering to check if data is available
   console.log("Current textures state:", textures);
   console.log("Current colors state:", colors);
   console.log("Current soilTypes state:", soilTypes);


  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedNutrient, setSelectedNutrient] = useState("");

  const handleParameterChange = (e) => {
    setSelectedParameter(e.target.value);
    setSelectedNutrient(""); // Reset nutrient selection when changing parameter
  };

  const handleNutrientChange = (e) => {
    setSelectedNutrient(e.target.value);
  };

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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      archivo_reporte: e.target.files[0] // Set the selected file to archivo_reporte
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = {
      ...formData,
      lote_id: formData.lote_id,
      tipo_suelo_id: parseInt(formData.tipo_suelo_id, 10),
      archivo_reporte: formData.archivo_reporte,
      parametro_biologico: {
        biomasa_microbiana: parseFloat(formData.parametro_biologico.biomasa_microbiana),
        actividad_enzimatica: parseFloat(formData.parametro_biologico.actividad_enzimatica),
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
            s: parseFloat(formData.parametro_quimico.macronutriente.s),
          },
        ],
        micronutriente: [
          {
            fe: parseFloat(formData.parametro_quimico.micronutriente.fe),
            cu: parseFloat(formData.parametro_quimico.micronutriente.cu),
            mn: parseFloat(formData.parametro_quimico.micronutriente.mn),
            zn: parseFloat(formData.parametro_quimico.micronutriente.zn),
            b: parseFloat(formData.parametro_quimico.micronutriente.b),
          },
        ],
      },
      parametro_fisico: {
        textura_id: parseInt(formData.parametro_fisico.textura_id, 10),
        densidad_aparente: parseFloat(formData.parametro_fisico.densidad_aparente),
        profundidad_efectiva: parseFloat(formData.parametro_fisico.profundidad_efectiva),
        color_id: parseInt(formData.parametro_fisico.color_id, 10),
      },
    };
  
    try {
      const response = await axiosInstance.post("/soil_analysis", dataToSend);
      if (response.status === 200 || response.status === 201) { // Ensure it's successful
        onSave(); // Show success modal in the parent component
        closeModal(); // Close the create modal
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };  
  
  return (
    <ModalOverlay>
      <ModalContent>
      <CloseButton onClick={closeModal}>×</CloseButton>
        <h2>Crear Análisis de Suelo</h2>
        <form onSubmit={handleSubmit}>
        <InputGroup>
          <label>Lote</label>
          <input type="text" value={formData.lote_name} readOnly />
        </InputGroup>

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

          <InputGroup>
            <label>Tipo de Suelo</label>
            <select name="tipo_suelo_id" value={formData.tipo_suelo_id} onChange={(e) => handleChange(e)}>
              <option value="">Seleccione...</option>
              {soilTypes.map((soil) => (
                <option key={soil.id} value={soil.id}>{soil.descripcion}</option>
              ))}
            </select>
          </InputGroup>

          <InputGroup>
            <label>Archivo de Reporte (PDF) <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>(Opcional)</span></label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </InputGroup>


          {/* Select to choose parameter */}
          <InputGroup>
            <label>Seleccione el Tipo de Parámetro</label>
            <select value={selectedParameter} onChange={handleParameterChange}>
              <option value="">Seleccione...</option>
              <option value="parametro_biologico">Parámetro Biológico</option>
              <option value="parametro_quimico">Parámetro Químico</option>
              <option value="parametro_fisico">Parámetro Físico</option>
            </select>
          </InputGroup>

          {/* Conditionally render fields based on selected parameter */}
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

              {/* Select to choose nutrient type */}
              <InputGroup>
                <label>Seleccione el Tipo de Nutriente</label>
                <select value={selectedNutrient} onChange={handleNutrientChange}>
                  <option value="">Seleccione...</option>
                  <option value="macronutriente">Macronutrientes</option>
                  <option value="micronutriente">Micronutrientes</option>
                </select>
              </InputGroup>

              {/* Conditionally render macronutrientes */}
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

              {/* Conditionally render micronutrientes */}
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

          <SubmitButton type="submit">Crear Análisis</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateSoilAnalysisModal;
