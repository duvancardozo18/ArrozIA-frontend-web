import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
  padding: 30px;
  border-radius: 20px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
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
  }
`;

const AddButton = styled.button`
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CostsDataTable = ({ cultivoId }) => {
  const [costs, setCosts] = useState([]);
  const [editCost, setEditCost] = useState(null); // Para el modal de edición
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newCost, setNewCost] = useState({ concepto: "", descripcion: "", precio: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchCosts = async () => {
    try {
      const response = await axiosInstance.get(`/costs/${cultivoId}`);
      setCosts(response.data);
    } catch (error) {
      console.error("Error fetching costs:", error);
    }
  };

  const handleAdd = async () => {
    if (!newCost.concepto || !newCost.precio) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    try {
      await axiosInstance.post("/costs", { ...newCost, cultivo_id: cultivoId });
      setNewCost({ concepto: "", descripcion: "", precio: "" });
      setOpenAddModal(false);
      setShowSuccessModal(true); // Mostrar el modal de éxito
      fetchCosts(); // Refresca la tabla después de agregar
    } catch (error) {
      console.error("Error adding cost:", error);
      alert("Hubo un error al agregar el costo.");
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
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCost?.concepto || !editCost?.precio) {
      alert("Por favor, completa todos los campos obligatorios.");
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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
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
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Typography variant="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          Costos
        </Typography>
      </div>

      <AddButton onClick={() => setOpenAddModal(true)}>Agregar Costo</AddButton>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <div style={{ height: 400, minWidth: 800 }}>
          <DataGrid
            rows={costs}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </div>

      {/* Modal de agregar */}
      {openAddModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setOpenAddModal(false)}>×</CloseButton>
            <Title>Agregar Nuevo Costo</Title>
            <InputGroup>
              <label>Concepto</label>
              <input
                type="text"
                value={newCost.concepto}
                onChange={(e) => setNewCost({ ...newCost, concepto: e.target.value })}
              />
            </InputGroup>
            <InputGroup>
              <label>Descripción</label>
              <input
                type="text"
                value={newCost.descripcion}
                onChange={(e) => setNewCost({ ...newCost, descripcion: e.target.value })}
              />
            </InputGroup>
            <InputGroup>
              <label>Precio</label>
              <input
                type="number"
                value={newCost.precio}
                onChange={(e) => setNewCost({ ...newCost, precio: e.target.value })}
              />
            </InputGroup>
            <SubmitButton onClick={handleAdd}>Guardar</SubmitButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseSuccessModal}
          message="¡Costo registrado con éxito!"
        />
      )}

      {/* Modal de edición */}
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
                  value={editCost?.concepto || ""}
                  onChange={(e) => setEditCost({ ...editCost, concepto: e.target.value })}
                />
              </InputGroup>
              <InputGroup>
                <label>Descripción</label>
                <input
                  type="text"
                  value={editCost?.descripcion || ""}
                  onChange={(e) => setEditCost({ ...editCost, descripcion: e.target.value })}
                />
              </InputGroup>
              <InputGroup>
                <label>Precio</label>
                <input
                  type="number"
                  value={editCost?.precio || ""}
                  onChange={(e) => setEditCost({ ...editCost, precio: e.target.value })}
                />
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
