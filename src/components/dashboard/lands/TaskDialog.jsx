import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import axiosInstance from "../../../config/AxiosInstance";
import styled from "styled-components";
import SuccessModal from "../../../components/dashboard/modal/SuccessModal";

const ColumnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;

  > div {
    flex: 1;
    min-width: 200px;
  }
`;

// const StyledButton = styled(Button)`
//   && {
//     background-color: ${(props) => (props.cancel ? "#FF4D4F" : "#28a745")};
//     color: white;
//     &:hover {
//       background-color: ${(props) => (props.cancel ? "#ff6666" : "#218838")};
//     }
//   }
// `;

const StyledButton = styled(Button)`
&& {
  background-color: #28a745;
  color: white;

  &.cancel-button {
    background-color: #FF4D4F;
  }

  &:hover {
    background-color: ${(props) =>
      props.className === "cancel-button" ? "#ff6666" : "#218838"};
  }
}
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 10px;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: #28a745;
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.5);
      transform: translateY(-3px);
    }
  }
`;

const StyledDisabledTextField = styled(TextField)`
  && {
    .MuiInputBase-input {
      color: #9e9e9e; /* Cambia el color del texto */
    }
    .MuiOutlinedInput-notchedOutline {
      border-color: #d3d3d3; /* Cambia el color del borde */
    }
  }
`;


const StyledFormControl = styled(FormControl)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 10px;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #28a745;
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.5);
      transform: translateY(-3px);
    }
  }
`;

const SuccessModalWrapper = styled.div`
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TaskDialog = ({ open, onClose, onSave, cultivoNombre, cultivoId }) => {
  const [task, setTask] = useState({
    title: "",
    start: "",
    costoLabor: "", // Campo para el costo de la labor
    cantidadInsumo: "", // Nuevo campo para la cantidad de insumo
    esMecanizable: false,
    laborCulturalId: "",
    insumoAgricolaId: "",
    usuarioId: "",
    maquinariaAgricolaId: "",
  });

  const [labors, setLabors] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [users, setUsers] = useState([]);
  const [machineries, setMachineries] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [laborsData, inputsData, usersData, machineriesData] = await Promise.all([
          axiosInstance.get("/labor-cultural/read"),
          axiosInstance.get("/inputs"),
          axiosInstance.get("/users"),
          axiosInstance.get("/machineries"),
        ]);

        setLabors(laborsData.data);
        setInputs(inputsData.data);
        setUsers(usersData.data);
        setMachineries(machineriesData.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const validateFields = () => {
    const newErrors = {};

    if (!task.title) newErrors.title = "Descripción requerida";
    if (!task.costoLabor) newErrors.costoLabor = "Costo de la labor requerido";
    if (!task.cantidadInsumo) newErrors.cantidadInsumo = "Cantidad de insumo requerida";
    if (!task.start) newErrors.start = "Fecha estimada requerida";
    if (!task.laborCulturalId) newErrors.laborCulturalId = "Labor cultural requerida";
    if (!task.insumoAgricolaId) newErrors.insumoAgricolaId = "Insumo requerido";
    if (!task.usuarioId) newErrors.usuarioId = "Usuario requerido";
    if (task.esMecanizable && !task.maquinariaAgricolaId) {
      newErrors.maquinariaAgricolaId = "Maquinaria requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = async () => {
    if (!validateFields()) return;

    const taskData = {
      fecha_estimada: task.start,
      fecha_realizacion: null,
      descripcion: task.title,
      estado_id: 1,
      es_mecanizable: task.esMecanizable,
      labor_cultural_id: task.laborCulturalId,
      insumo_agricola_id: task.insumoAgricolaId,
      usuario_id: task.usuarioId,
      maquinaria_agricola_id: task.esMecanizable ? task.maquinariaAgricolaId : null,
      cultivo_id: cultivoId,
      precio_labor_cultural: task.costoLabor, // Campo para el costo de la labor
      cantidad_insumo: task.cantidadInsumo, // Nuevo campo
    };

    try {
      await axiosInstance.post("/tasksCreate", taskData);
      setShowSuccessModal(true);
      onSave(taskData);
    } catch (error) {
      console.error("Error al enviar la tarea:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleChange = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Asignar Labor</DialogTitle>
        <DialogContent>
          <ColumnContainer>
            <Tooltip title={errors.cultivoNombre || ""} open={!!errors.cultivoNombre} placement="top" arrow>
              <StyledDisabledTextField
                label="Cultivo"
                fullWidth
                value={cultivoNombre || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Tooltip>

            <Tooltip title={errors.title || ""} open={!!errors.title} placement="top" arrow>
              <StyledTextField
                label="Descripción"
                fullWidth
                value={task.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Tooltip>

            <Tooltip title={errors.costoLabor || ""} open={!!errors.costoLabor} placement="top" arrow>
              <StyledTextField
                label="Costo de la Labor"
                type="number"
                fullWidth
                value={task.costoLabor}
                onChange={(e) => handleChange("costoLabor", e.target.value)}
              />
            </Tooltip>

            <Tooltip title={errors.cantidadInsumo || ""} open={!!errors.cantidadInsumo} placement="top" arrow>
              <StyledTextField
                label="Cantidad de Insumo"
                type="number"
                fullWidth
                value={task.cantidadInsumo}
                onChange={(e) => handleChange("cantidadInsumo", e.target.value)}
              />
            </Tooltip>

            <Tooltip title={errors.start || ""} open={!!errors.start} placement="top" arrow>
              <StyledTextField
                label="Fecha Programada"
                type="date"
                fullWidth
                value={task.start}
                onChange={(e) => handleChange("start", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Tooltip>

            <Tooltip title={errors.laborCulturalId || ""} open={!!errors.laborCulturalId} placement="top" arrow>
              <StyledFormControl fullWidth>
                <InputLabel>Labor Cultural</InputLabel>
                <Select
                  value={task.laborCulturalId}
                  onChange={(e) => handleChange("laborCulturalId", e.target.value)}
                >
                  {labors.map((labor) => (
                    <MenuItem key={labor.id} value={labor.id}>
                      {labor.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Tooltip>

            <Tooltip title={errors.insumoAgricolaId || ""} open={!!errors.insumoAgricolaId} placement="top" arrow>
              <StyledFormControl fullWidth>
                <InputLabel>Insumo</InputLabel>
                <Select
                  value={task.insumoAgricolaId}
                  onChange={(e) => handleChange("insumoAgricolaId", e.target.value)}
                >
                  {inputs.map((input) => (
                    <MenuItem key={input.id} value={input.id}>
                      {input.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Tooltip>

            <Tooltip title={errors.usuarioId || ""} open={!!errors.usuarioId} placement="top" arrow>
              <StyledFormControl fullWidth>
                <InputLabel>Usuario</InputLabel>
                <Select
                  value={task.usuarioId}
                  onChange={(e) => handleChange("usuarioId", e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Tooltip>

            {task.esMecanizable && (
              <Tooltip title={errors.maquinariaAgricolaId || ""} open={!!errors.maquinariaAgricolaId} placement="top" arrow>
                <StyledFormControl fullWidth>
                  <InputLabel>Maquinaria</InputLabel>
                  <Select
                    value={task.maquinariaAgricolaId}
                    onChange={(e) => handleChange("maquinariaAgricolaId", e.target.value)}
                  >
                    {machineries.map((machine) => (
                      <MenuItem key={machine.id} value={machine.id}>
                        {machine.name || "Sin nombre"}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Tooltip>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={task.esMecanizable}
                  onChange={(e) => setTask({ ...task, esMecanizable: e.target.checked })}
                />
              }
              label="Es Mecanizable"
            />
          </ColumnContainer>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={onClose} className="cancel-button">
            Cancelar
          </StyledButton>

          <StyledButton onClick={handleAddTask}>Crear</StyledButton>
        </DialogActions>
      </Dialog>

      {showSuccessModal && (
        <SuccessModalWrapper>
          <SuccessModal
            show={showSuccessModal}
            onClose={handleCloseSuccessModal}
            message="¡Tarea Creada Exitosamente!"
          />
        </SuccessModalWrapper>
      )}
    </>
  );
};

export default TaskDialog;
