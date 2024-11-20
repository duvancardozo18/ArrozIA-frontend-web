import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import axiosInstance from "../../../config/AxiosInstance";

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

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
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
    margin-left: 2px;
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

const HarvestsDataTable = ({ cultivoId }) => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [errors, setErrors] = useState({});

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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/harvest/${cultivoId}/${id}`);
      setHarvests((prev) => prev.filter((harvest) => harvest.id !== id));
      alert("Cosecha eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la cosecha:", error);
    }
  };

  const handleEdit = (harvest) => {
    setSelectedHarvest(harvest);
    setErrors({});
    setOpenEditModal(true);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!selectedHarvest?.fecha_cosecha) {
      newErrors.fecha_cosecha = "La fecha de cosecha no puede estar vacía.";
    }
    if (!selectedHarvest?.cantidad_producida_cosecha || selectedHarvest.cantidad_producida_cosecha <= 0) {
      newErrors.cantidad_producida_cosecha = "La cantidad producida debe ser mayor a 0.";
    } else if (selectedHarvest.cantidad_producida_cosecha.toString().length > 50) {
      newErrors.cantidad_producida_cosecha = "La cantidad producida no puede exceder los 50 caracteres.";
    }
    if (!selectedHarvest?.venta_cosecha || selectedHarvest.venta_cosecha <= 0) {
      newErrors.venta_cosecha = "La venta debe ser un número mayor a 0.";
    } else if (selectedHarvest.venta_cosecha.toString().length > 50) {
      newErrors.venta_cosecha = "La venta no puede exceder los 50 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await axiosInstance.put(`/harvest/${cultivoId}/${selectedHarvest.id}`, selectedHarvest);
      setOpenEditModal(false);
      fetchHarvests();
      alert("Cosecha actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la cosecha:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
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
          <Button color="primary" size="small" onClick={() => handleEdit(params.row)}>
            Editar
          </Button>
          <Button color="error" size="small" onClick={() => handleDelete(params.row.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Typography variant="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          Cosechas
        </Typography>
      </div>
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

      {openEditModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setOpenEditModal(false)}>×</CloseButton>
            <Title>Editar Cosecha</Title>
            <form onSubmit={handleUpdate}>
              <InputGroup>
                <label>Fecha Cosecha</label>
                <input
                  type="date"
                  value={selectedHarvest?.fecha_cosecha || ""}
                  onChange={(e) => setSelectedHarvest({ ...selectedHarvest, fecha_cosecha: e.target.value })}
                />
                {errors.fecha_cosecha && <p>{errors.fecha_cosecha}</p>}
              </InputGroup>
              <InputGroup>
                <label>Cantidad Producida</label>
                <input
                  type="number"
                  value={selectedHarvest?.cantidad_producida_cosecha || ""}
                  onChange={(e) =>
                    setSelectedHarvest({ ...selectedHarvest, cantidad_producida_cosecha: e.target.value })
                  }
                />
                {errors.cantidad_producida_cosecha && <p>{errors.cantidad_producida_cosecha}</p>}
              </InputGroup>
              <InputGroup>
                <label>Venta</label>
                <input
                  type="number"
                  value={selectedHarvest?.venta_cosecha || ""}
                  onChange={(e) => setSelectedHarvest({ ...selectedHarvest, venta_cosecha: e.target.value })}
                />
                {errors.venta_cosecha && <p>{errors.venta_cosecha}</p>}
              </InputGroup>
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default HarvestsDataTable;
