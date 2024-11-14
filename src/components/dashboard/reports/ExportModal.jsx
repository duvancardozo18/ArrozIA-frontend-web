import React, { useState } from 'react';

const ExportModal = ({ onClose }) => {
  const [format, setFormat] = useState('XLSX');

  return (
    <div className="export-modal">
      <div className="export-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Exportar informe de Rentabilidad</h3>
        <p>Seleccione las opciones de exportación:</p>
        
        <div className="export-options">
          <label>
            <input type="checkbox" defaultChecked /> Información General
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Reporte de Maquinaria
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Reporte de Insumos
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Reporte Mano de Obra
          </label>
        </div>

        <div className="format-selection">
          <label>Formato:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="XLSX">XLSX</option>
            <option value="PDF">PDF</option>
          </select>
        </div>

        <button className="generate-report-button">Generar reporte</button>
      </div>
    </div>
  );
};

export default ExportModal;
