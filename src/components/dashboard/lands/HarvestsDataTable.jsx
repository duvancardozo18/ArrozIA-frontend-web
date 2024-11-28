import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../../dashboard/modal/SuccessModal";

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
  padding: 20px;
  border-radius: 20px;
  width: 500px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
  text-decoration: underline;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;

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
    font-size: 16px;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      outline: none;
    }
  }

  p {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 5px;
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
  cursor: pointer;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
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

  &:hover {
    color: #ff6b6b;
  }
`;

const AddButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const HarvestsDataTable = ({ cultivoId }) => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [formData, setFormData] = useState({
    fecha_cosecha: "",
    precio_carga_mercado: "",
    gasto_transporte_cosecha: "",
    gasto_recoleccion: "",
    cantidad_producida_cosecha: "",
    venta_cosecha: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchHarvests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/harvest/crops/${cultivoId}`);
      setHarvests(response.data.cosechas);
    } catch (error) {
      console.error("Error al obtener cosechas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cultivoId) {
      fetchHarvests();
    }
  }, [cultivoId]);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.fecha_cosecha) {
      newErrors.fecha_cosecha = "La fecha de cosecha no puede estar vacía.";
    }
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "fecha_cosecha" && value.length > 9) {
        newErrors[key] = "Este campo no puede exceder los 9 caracteres.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (harvests.length > 0) {
      alert("Solo puedes registrar una cosecha por cultivo.");
      return;
    }

    if (!validateFields()) return;

    try {
      const response = await axiosInstance.post("/harvest/", {
        cultivo_id: cultivoId,
        ...formData,
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        setFormData({
          fecha_cosecha: "",
          precio_carga_mercado: "",
          gasto_transporte_cosecha: "",
          gasto_recoleccion: "",
          cantidad_producida_cosecha: "",
          venta_cosecha: "",
        });
        setOpenAddModal(false);
        fetchHarvests();
      }
    } catch (error) {
      console.error("Error al registrar la cosecha:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/harvest/${cultivoId}/${id}`);
      fetchHarvests();
      alert("Cosecha eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la cosecha:", error);
    }
  };

   // Función para abrir el modal y cargar los datos de la cosecha seleccionada
   const handleEdit = (harvest) => {
    // Inicializamos los campos con valores predeterminados si no están definidos
    const initializedHarvest = {
      ...harvest,
      fecha_cosecha: harvest.fecha_cosecha || "", // Valor predeterminado
      cantidad_producida_cosecha: harvest.cantidad_producida_cosecha || "", // Valor predeterminado
      venta_cosecha: harvest.venta_cosecha || "", // Valor predeterminado
      precio_transporte_cosecha: harvest.precio_transporte_cosecha || "", // Valor predeterminado
      valor_unitario_compra_carga: harvest.valor_unitario_compra_carga || "", // Valor predeterminado
    };
  
    // Establecemos los valores en el estado
    setSelectedHarvest(initializedHarvest);
    setErrors({}); // Limpiar los errores
    setOpenEditModal(true); // Abrir el modal de edición
  };
  

  // Cambié el nombre de la función a 'validateHarvestFields' para evitar conflictos
  const validateHarvestFields = () => {
    let valid = true;
    const newErrors = {};
  
    // Validación simple de los campos
    if (!selectedHarvest.fecha_cosecha) {
      newErrors.fecha_cosecha = "Fecha de cosecha es requerida";
      valid = false;
    }
    if (!selectedHarvest.cantidad_producida_cosecha) {
      newErrors.cantidad_producida_cosecha = "Cantidad producida es requerida";
      valid = false;
    }
    if (!selectedHarvest.venta_cosecha) {
      newErrors.venta_cosecha = "Venta es requerida";
      valid = false;
    }
    if (!selectedHarvest.precio_transporte_cosecha) {
      newErrors.precio_transporte_cosecha = "Precio de transporte es requerido";
      valid = false;
    }
    if (!selectedHarvest.valor_unitario_compra_carga) {
      newErrors.valor_unitario_compra_carga = "Valor unitario de compra es requerido";
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };
  

  // Función para actualizar la cosecha
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateHarvestFields()) return; // Usamos el nuevo nombre de la función

    if (!selectedHarvest || !selectedHarvest.id) {
      console.error("No se ha seleccionado una cosecha válida.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/harvest/${cultivoId}/${selectedHarvest.id}`,
        selectedHarvest
      );
      console.log(response); // Verifica la respuesta de la API
      setOpenEditModal(false);
      fetchHarvests(); // Refrescar la lista de cosechas
      alert("Cosecha actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la cosecha:", error);
    }
  };
  
    const columns = [
      { field: "fecha_cosecha", headerName: "Fecha Cosecha", width: 150 },
      { field: "cantidad_producida_cosecha", headerName: "Cantidad Producida", width: 180 },
      { field: "venta_cosecha", headerName: "Venta", width: 130 },
      { field: "precio_carga_mercado", headerName: "Precio Carga", width: 150 },
      { field: "gasto_transporte_cosecha", headerName: "Gasto Transporte", width: 180 },
      { field: "gasto_recoleccion", headerName: "Gasto Recolección", width: 180 },
      {
        field: "actions",
        headerName: "Acciones",
        width: 200,
        renderCell: (params) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              color="primary"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              Editar
            </Button>
            <Button
              color="error"
              size="small"
              onClick={() => handleDelete(params.row.id)} // Asegúrate de tener la función handleDelete
            >
              Eliminar
            </Button>
          </div>
        ),
      },
    ];

  return (
    <>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", textTransform: "uppercase" }}
        >
          Cosechas
        </Typography>
      </div>

      <AddButton onClick={() => setOpenAddModal(true)}>Agregar Cosecha</AddButton>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={harvests}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </div>

      {openAddModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setOpenAddModal(false)}>×</CloseButton>
            <Title>Agregar Cosecha</Title>
            <form onSubmit={handleAdd}>
              <SectionTitle>Producción</SectionTitle>
              <InputGroup>
                <label>Fecha de Cosecha</label>
                <input
                  type="date"
                  name="fecha_cosecha"
                  value={formData.fecha_cosecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_cosecha: e.target.value })
                  }
                />
                {errors.fecha_cosecha && <p>{errors.fecha_cosecha}</p>}
              </InputGroup>
              <InputGroup>
                <label>Cantidad Producida (Toneladas)</label>
                <input
                  type="number"
                  name="cantidad_producida_cosecha"
                  value={formData.cantidad_producida_cosecha}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cantidad_producida_cosecha: e.target.value,
                    })
                  }
                />
                {errors.cantidad_producida_cosecha && (
                  <p>{errors.cantidad_producida_cosecha}</p>
                )}
              </InputGroup>
              <InputGroup>
                <label>Valor de la venta</label>
                <input
                  type="number"
                  name="venta_cosecha"
                  value={formData.venta_cosecha}
                  onChange={(e) =>
                    setFormData({ ...formData, venta_cosecha: e.target.value })
                  }
                />
                {errors.venta_cosecha && <p>{errors.venta_cosecha}</p>}
              </InputGroup>

              <SectionTitle>Gastos</SectionTitle>
              <InputGroup>
                <label>Precio de Recolección</label>
                <input
                  type="number"
                  name="gasto_recoleccion"
                  value={formData.gasto_recoleccion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gasto_recoleccion: e.target.value,
                    })
                  }
                />
                {errors.gasto_recoleccion && (
                  <p>{errors.gasto_recoleccion}</p>
                )}
              </InputGroup>
              <InputGroup>
                <label>Precio de Transporte de Cosecha</label>
                <input
                  type="number"
                  name="gasto_transporte_cosecha"
                  value={formData.gasto_transporte_cosecha}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gasto_transporte_cosecha: e.target.value,
                    })
                  }
                />
                {errors.gasto_transporte_cosecha && (
                  <p>{errors.gasto_transporte_cosecha}</p>
                )}
              </InputGroup>

              <SectionTitle>Mercado</SectionTitle>
              <InputGroup>
                <label>Valor de la Carga</label>
                <input
                  type="number"
                  name="precio_carga_mercado"
                  value={formData.precio_carga_mercado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precio_carga_mercado: e.target.value,
                    })
                  }
                />
                {errors.precio_carga_mercado && (
                  <p>{errors.precio_carga_mercado}</p>
                )}
              </InputGroup>

              <SubmitButton type="submit">Guardar Cosecha</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

{openEditModal && (
  <ModalOverlay>
    <ModalContent>
      <CloseButton onClick={() => setOpenEditModal(false)}>×</CloseButton>
      <Title>Editar Cosecha</Title>
      <form onSubmit={handleUpdate}>
        {/* Sección Producción */}
        <SectionTitle>Producción</SectionTitle>
        <InputGroup>
          <label>Fecha de Cosecha</label>
          <input
            type="date"
            name="fecha_cosecha"
            value={selectedHarvest.fecha_cosecha}
            onChange={(e) =>
              setSelectedHarvest({ ...selectedHarvest, fecha_cosecha: e.target.value,})
            }
          />
          {errors.fecha_cosecha && <ErrorMessage>{errors.fecha_cosecha}</ErrorMessage>}
        </InputGroup>
        <InputGroup>
          <label>Cantidad Producida</label>
          <input
            type="number"
            name="cantidad_producida_cosecha"
            value={selectedHarvest.cantidad_producida_cosecha}
            onChange={(e) =>
              setSelectedHarvest({
                ...selectedHarvest,
                cantidad_producida_cosecha: e.target.value,
              })
            }
          />
          {errors.cantidad_producida_cosecha && (
            <ErrorMessage>{errors.cantidad_producida_cosecha}</ErrorMessage>
          )}
        </InputGroup>
        <InputGroup>
          <label>Venta</label>
          <input
            type="number"
            name="venta_cosecha"
            value={selectedHarvest.venta_cosecha}
            onChange={(e) =>
              setSelectedHarvest({ ...selectedHarvest, venta_cosecha: e.target.value })
            }
          />
          {errors.venta_cosecha && <ErrorMessage>{errors.venta_cosecha}</ErrorMessage>}
        </InputGroup>

        {/* Sección Gastos */}
        <SectionTitle>Gastos</SectionTitle>
        <InputGroup>
          <label>Precio de Recolección</label>
          <input
            type="number"
            name="gasto_recoleccion"
            value={selectedHarvest.gasto_recoleccion}
            onChange={(e) =>
              setSelectedHarvest({
                ...selectedHarvest,
                gasto_recoleccion: e.target.value,
              })
            }
          />
          {errors.gasto_recoleccion && (
            <ErrorMessage>{errors.gasto_recoleccion}</ErrorMessage>
          )}
        </InputGroup>
        <InputGroup>
  <label>Precio de Transporte de Cosecha</label>
  <input
    type="number"
    name="precio_transporte_cosecha"
    value={selectedHarvest.precio_transporte_cosecha || ""} // Asegúrate de que esté bien vinculado
    onChange={(e) => 
      setSelectedHarvest({
        ...selectedHarvest,
        precio_transporte_cosecha: e.target.value,
      })
    }
  />
  {errors.precio_transporte_cosecha && (
    <ErrorMessage>{errors.precio_transporte_cosecha}</ErrorMessage>
  )}
</InputGroup>

        {/* Sección Mercado */}
        <SectionTitle>Mercado</SectionTitle>
        <InputGroup>
  <label>Valor Unitario de Compra de la Carga</label>
  <input
    type="number"
    name="valor_unitario_compra_carga"
    value={selectedHarvest.valor_unitario_compra_carga || ""} // Vincula el valor correctamente
    onChange={(e) =>
      setSelectedHarvest({
        ...selectedHarvest,
        valor_unitario_compra_carga: e.target.value,
      })
    }
  />
  {errors.valor_unitario_compra_carga && (
    <ErrorMessage>{errors.valor_unitario_compra_carga}</ErrorMessage>
  )}
</InputGroup>
        {/* Botón para Guardar */}
        <Button type="submit">Guardar Cambios</Button>
      </form>
    </ModalContent>
  </ModalOverlay>
)}




      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="¡Cosecha registrada con éxito!"
        />
      )}
    </>
  );
};

export default HarvestsDataTable;
