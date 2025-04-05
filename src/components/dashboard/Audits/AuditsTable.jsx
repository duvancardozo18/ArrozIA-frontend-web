import React from "react";
import PropTypes from "prop-types";
import "../../../css/AuditsTable.css";

const AuditsTable = ({ audits }) => {
  return (
    <div className="audits-table-container">
      <table className="audits-table">
        <thead>
          <tr>
            <th>Fecha del Cambio</th>
            <th>Hora del Cambio</th>
            <th>Usuario Responsable</th>
            <th>Acción</th>
            <th>Datos Antes del Cambio</th>
            <th>Módulo Afectado</th>
            <th>Tabla Afectada</th>
            <th>Descripción Detallada</th>
          </tr>
        </thead>
        <tbody>
          {audits.length > 0 ? (
            audits.map((audit) => (
              <tr key={audit.id}>
                <td>{audit.fecha_cambio}</td>
                <td>{audit.hora_cambio}</td>
                <td>{audit.usuario_responsable}</td>
                <td>{audit.accion}</td>
                <td>{audit.datos_antes}</td>
                <td>{audit.modulo_afectado}</td>
                <td>{audit.tabla_afectada}</td>
                <td>{audit.descripcion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

AuditsTable.propTypes = {
  audits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fecha_cambio: PropTypes.string.isRequired,
      hora_cambio: PropTypes.string.isRequired,
      usuario_responsable: PropTypes.string.isRequired,
      accion: PropTypes.string.isRequired,
      datos_antes: PropTypes.string.isRequired,
      modulo_afectado: PropTypes.string.isRequired,
      tabla_afectada: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AuditsTable;
