import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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

const CostsDataTable = ({ cultivoId }) => {
  const [costs, setCosts] = useState([]);
  const [editCost, setEditCost] = useState(null); // Para el modal de edición
  const [openEditModal, setOpenEditModal] = useState(false);
  const [errors, setErrors] = useState({ concepto: "", descripcion: "", precio: "" });

  const fetchCosts = async () => {
    try {
      const response = await axiosInstance.get(`/costs/${cultivoId}`);
      setCosts(response.data);
    } catch (error) {
      console.error("Error fetching costs:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/costs/${id}`);
      fetchCosts(); // Recargar datos después de eliminar
      alert("Costo eliminado correctamente.");
    } catch (error) {
      console.error("Error deleting cost:", error);
      alert("Hubo un error al eliminar el costo.");
    }
  };

  const handleEdit = (cost) => {
    setEditCost(cost);
    setErrors({ concepto: "", descripcion: "", precio: "" }); // Limpiar errores previos
    setOpenEditModal(true);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editCost?.concepto || editCost.concepto.trim() === "") {
      newErrors.concepto = "El concepto no puede estar vacío.";
    } else if (editCost.concepto.length > 50) {
      newErrors.concepto = "El concepto no puede tener más de 50 caracteres.";
    }
    if (!editCost?.descripcion || editCost.descripcion.trim() === "") {
      newErrors.descripcion = "La descripción no puede estar vacía.";
    } else if (editCost.descripcion.length > 50) {
      newErrors.descripcion = "La descripción no puede tener más de 50 caracteres.";
    }
    if (!editCost?.precio || isNaN(editCost.precio) || parseFloat(editCost.precio) <= 0) {
      newErrors.precio = "El precio debe ser un número válido mayor a 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    try {
      await axiosInstance.put(`/costs/${editCost.id}`, editCost);
      setOpenEditModal(false);
      fetchCosts(); // Recargar datos después de editar
      alert("Costo editado correctamente.");
    } catch (error) {
      console.error("Error editing cost:", error);
      alert("Hubo un error al editar el costo.");
    }
  };

  useEffect(() => {
    fetchCosts();
  }, [cultivoId]);

  const columns = [
    { field: "concepto", headerName: "Concepto", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "precio", headerName: "Precio", width: 150 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleEdit(params.row)} style={{ marginRight: "10px" }}>
            Editar
          </Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      {/* Título centrado */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Typography variant="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          Costos
        </Typography>
      </div>

      {/* Tabla de costos responsive */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <div style={{ height: 400, minWidth: 800 }}>
          <DataGrid
            rows={costs}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            autoHeight={false}
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "#e0e0e0",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                color: "#333",
                fontSize: "16px",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </div>
      </div>

      {/* Modal de edición con nuevos estilos */}
      {openEditModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setOpenEditModal(false)}>×</CloseButton>
            <Title>Editar Costo</Title>
            <form onSubmit={handleEditSubmit}>
              <InputGroup>
                <label>Concepto</label>
                <input
                  type="text"
                  name="concepto"
                  value={editCost?.concepto || ""}
                  onChange={(e) => setEditCost({ ...editCost, concepto: e.target.value })}
                />
                {errors.concepto && <p>{errors.concepto}</p>}
              </InputGroup>
              <InputGroup>
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={editCost?.descripcion || ""}
                  onChange={(e) => setEditCost({ ...editCost, descripcion: e.target.value })}
                />
                {errors.descripcion && <p>{errors.descripcion}</p>}
              </InputGroup>
              <InputGroup>
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={editCost?.precio || ""}
                  onChange={(e) => setEditCost({ ...editCost, precio: e.target.value })}
                />
                {errors.precio && <p>{errors.precio}</p>}
              </InputGroup>
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default CostsDataTable;
