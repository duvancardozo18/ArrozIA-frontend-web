import React from 'react';
import '../../../css/CropInputsTable.scss';

const CultivoInsumosTable = () => {
  const insumos = [
    { concepto: 'Semilla Sikuani', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Glifosato', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Oxadiazon', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Butaclor', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Propanil', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Hormonal', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Dap', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Sulfato de amonio', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Cloruro de potasio', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Urea', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Elementos menores', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Tryciclazol', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
    { concepto: 'Azoxystrobin', valorUnitario: null, cantidad: null, descripcion: '', valorTotal: null },
  ];

  const total = insumos.reduce((sum, item) => sum + (item.valorTotal || 0), 0);

  return (
    <div className="cultivo-insumos-table">
      <h4>Insumos Utilizados</h4>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Valor unitario</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo, index) => (
            <tr key={index}>
              <td>{insumo.concepto}</td>
              <td>{insumo.valorUnitario ? `$${insumo.valorUnitario.toLocaleString()}` : ''}</td>
              <td>{insumo.cantidad || ''}</td>
              <td>{insumo.descripcion || ''}</td>
              <td>{insumo.valorTotal ? `$${insumo.valorTotal.toLocaleString()}` : ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="4">Valor total</td>
            <td>{`$${total.toLocaleString()}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CultivoInsumosTable;
