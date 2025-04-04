import React, { useState, useEffect } from "react";
import AllotmentTable from "../../components/dashboard/lands/TableLand";
import EditAllotmentModal from "../../components/dashboard/lands/EditLandModal";
import DeleteAllotmentModal from "../../components/dashboard/modal/DeleteModal";
import NewAllotment from "../../components/dashboard/lands/CreateLandModal"; 
import axiosInstance from "../../config/AxiosInstance";
import { useNavigate } from "react-router-dom";

const AllotmentMain = ({ selectedFarm }) => {
  const [lands, setLands] = useState([]);
  const [selectedAllotment, setSelectedAllotment] = useState(null); // Guarda el lote seleccionado
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Control para el modal de agregar lote
  const [editingLote, setEditingLote] = useState(null);
  const [deletingLote, setDeletingLote] = useState(null);

  const navigate = useNavigate(); // Hook para redireccionar

  //traer los lotes de la finca seleccionada
  const fetchLands = async () => {
    try {
      const response = await axiosInstance.get("/lands");
      setLands(response.data);
    } catch (error) {
      console.error("Error fetching lands:", error);
    }
  };

  // Llama fetchLands dentro del useEffect
  useEffect(() => {
    fetchLands();
  }, []);

  // Abrir el modal para agregar un lote
  const handleAddLote = () => {
    setIsAddModalOpen(true);
  };

  // Abrir el modal para editar un lote
  const handleEditLote = (lote) => {
    if (lote && lote.id) {
      // console.log("Lote que se está editando:", lote); // Verifica el lote en la consola
      setEditingLote(lote); // Solo necesitas una llamada a setEditingLote
      setIsEditModalOpen(true); // Abre el modal de edición
    } else {
      console.error(
        "Failed to set the lote for editing: Lote ID is undefined."
      );
    }
  };

  const handleSelectAllotment = (lote) => {
    if (lote && lote.id) {
      setSelectedAllotment(lote); // Guarda el lote seleccionado
    } else {
      console.error("No se ha seleccionado un lote válido.");
    }
  };
  


  const handleDelete = async (land_id) => {
    // console.log("Deleting lote ID:", land_id); // Verifica si el ID es correcto
    try {
      await axiosInstance.delete(`/delete/land/${land_id}`);
      setLands(lands.filter((lote) => lote.id !== land_id)); // Actualizar la lista después de eliminar
      setIsDeleteModalOpen(false); // Cierra el modal después de eliminar
    } catch (error) {
      console.error("Error deleting lote:", error);
    }
  };

  const confirmDeleteLote = (lote) => {
    setDeletingLote(lote); // Guarda el lote que se va a eliminar
    setIsDeleteModalOpen(true); // Abre el modal de confirmación de eliminación
  };

  const id = selectedFarm?.id || "Ubicación no disponible";
  // console.log(id);

  // Redirigir a "CropsMain"
  const handleViewCrops = async (lote) => {
    if (lote && lote.id) {
      try {
        const response = await axiosInstance.get(`/crops?land_id=${lote.id}`);
        console.log("Cultivos obtenidos:", response.data);
        navigate("/crop", {
          state: {
            crops: response.data,
            landId: lote.id,
            allotment: lote,  // Pasa el lote seleccionado
          },
        });
      } catch (error) {
        console.error("Error al obtener los cultivos:", error);
      }
    } else {
      console.error("No hay lote seleccionado para ver cultivos");
    }
  };
  

  return (
    <>
      <div className="box-lote">
        {selectedFarm ? (
          <>
            {/* Mostrar el texto con el nombre de la finca seleccionada */}
            <h2>Finca - {selectedFarm.nombre}</h2>
            <h3>Gestión de Lotes</h3>

            <AllotmentTable
              lands={lands.filter((lote) => lote.finca_id === selectedFarm.id)} // Filtrar los lotes por finca_id
              onAddLote={handleAddLote}
              onEditLote={handleEditLote}
              onDeleteLote={confirmDeleteLote}
              onViewCrops={handleViewCrops}
              onSelectAllotment={handleSelectAllotment} // Pasar función para seleccionar un lote
              selectedAllotment={selectedAllotment} // Pasar lote seleccionado como prop
            />

            {/* Modal para agregar lote */}
            {isAddModalOpen && (
              <NewAllotment
                show={isAddModalOpen}
                closeModal={() => setIsAddModalOpen(false)}
                onSave={() => {
                  setIsAddModalOpen(false);
                  fetchLands();
                }}
                selectedFarm={selectedFarm} // Pasa selectedFarm como prop al modal
                fetchLands={fetchLands} // Pasa la prop
              />
            )}

            {/* Modal para editar lote */}
            {isEditModalOpen && (
              <EditAllotmentModal
                show={isEditModalOpen}
                lote={editingLote}
                closeModal={() => setIsEditModalOpen(false)}
                onSave={() => {
                  setIsEditModalOpen(false);
                }}
              />
            )}

            {isDeleteModalOpen && deletingLote && (
              <DeleteAllotmentModal
                show={isDeleteModalOpen} // Mostrar el modal si está activo
                title="Eliminar Lote"
                message="¿Estás seguro de que deseas eliminar el Lote? Esta acción no se puede deshacer."
                cancelText="No, cancelar"
                confirmText="Sí, eliminar"
                onClose={() => setIsDeleteModalOpen(false)} // Cierra el modal sin eliminar
                onConfirm={() => {
                  // console.log("Deleting Lote ID:", deletingLote.id); // Verifica que el ID sea correcto
                  handleDelete(deletingLote.id); // Llama a la función para eliminar el lote
                }}
              />
            )}
          </>
        ) : (
          <p>Selecciona una finca para ver los lotes disponibles.</p>
        )}
      </div>
    </>
  );
};

export default AllotmentMain;
