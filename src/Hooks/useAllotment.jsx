const useAllotment = () => {
  const addLote = (finca, lote) => {
    // Lógica para agregar un nuevo lote a la finca seleccionada
    finca.lotes.push(lote);
  };

  const editLote = (finca, loteToEdit, updatedLote) => {
    // Lógica para editar el lote
    finca.lotes = finca.lotes.map(lote =>
      lote.id === loteToEdit.id ? updatedLote : lote
    );
  };

  const deleteLote = (finca, loteToDelete) => {
    // Lógica para eliminar el lote
    finca.lotes = finca.lotes.filter(lote => lote.id !== loteToDelete.id);
  };

  return { addLote, editLote, deleteLote };
};

export default useAllotment;
