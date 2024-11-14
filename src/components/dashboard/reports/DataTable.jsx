import React from 'react';
import DataTable from 'react-data-table-component';

const CustomDataTable = ({ data, onClose }) => {
  const columns = [
    {
      name: 'Descripción',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Valor unitario',
      selector: row => `$${row.unitValue.toLocaleString()}`,
      sortable: true,
    },
    {
      name: 'Cantidad',
      selector: row => row.quantity,
      sortable: true,
    },
    {
      name: 'Valor total',
      selector: row => `$${row.totalValue.toLocaleString()}`,
      sortable: true,
    }
  ];

  return (
    <div className="data-table">
      <h4>Detalles de {data.length > 0 ? data[0].type : "Elementos"}</h4>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        pointerOnHover
      />
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default CustomDataTable;
