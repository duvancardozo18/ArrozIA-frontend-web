import React, { useState } from 'react';
import AllotmentTable from './AllotmentTable'; 
import EditAllotmentModal from '../../../../screens/allotment/EditAllotmentModal';
import DeleteAllotmentModal from '../../../../screens/allotment/DeleteAllotmentModal';
import NewAllotment from '../../../../screens/allotment/NewAllotment'; // Modal para agregar lotes

const AllotmentMain = ({ fincaSeleccionada }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Control para el modal de agregar lote
  const [editingLote, setEditingLote] = useState(null);
  const [deletingLote, setDeletingLote] = useState(null);

  // Abrir el modal para agregar un lote
  const handleAddLote = () => {
    setIsAddModalOpen(true);
  };

  // Abrir el modal para editar un lote
  const handleEditLote = (lote) => {
    setEditingLote(lote);
    setIsEditModalOpen(true);
  };

  // Abrir el modal para eliminar un lote
  const handleDeleteLote = (lote) => {
    setDeletingLote(lote);
    setIsDeleteModalOpen(true);
  };

  return (
    <>  
    <div className="box-lote">
      {fincaSeleccionada ? (
        <>
          {/* Mostrar el texto con el nombre de la finca seleccionada */}
          <h2>Gestionando Lotes de la finca: {fincaSeleccionada.nombre}</h2>

          <AllotmentTable
            fincaSeleccionada={fincaSeleccionada}
            onAddLote={handleAddLote} // Solo abre el modal al presionar "Agregar Lote"
            onEditLote={handleEditLote}
            onDeleteLote={handleDeleteLote}
          />
          
          {/* Modal para agregar lote */}
          {isAddModalOpen && (
            <NewAllotment
              show={isAddModalOpen}
              closeModal={() => setIsAddModalOpen(false)}
              onSave={() => {
                setIsAddModalOpen(false);
              }}
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

          {/* Modal para eliminar lote */}
          {isDeleteModalOpen && (
            <DeleteAllotmentModal
              show={isDeleteModalOpen}
              lote={deletingLote}
              closeModal={() => setIsDeleteModalOpen(false)}
              onConfirm={() => {
                setIsDeleteModalOpen(false);
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
