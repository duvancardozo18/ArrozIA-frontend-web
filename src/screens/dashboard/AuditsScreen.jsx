import React, { useState } from "react";
import AuditsTable from "../../components/dashboard/Audits/AuditsTable";
import "../../css/AuditsScreen.css";

const AuditsScreen = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Ejemplo de datos de auditoría (esto se reemplazaría por una API real)
  const mockAudits = [
    {
      id: 1,
      fecha_cambio: "2024-11-15",
      hora_cambio: "14:30",
      usuario_responsable: "Admin",
      accion: "Actualización",
      datos_antes: "Estado: Inactivo",
      modulo_afectado: "Usuarios",
      tabla_afectada: "Usuarios",
      descripcion: "El estado del usuario fue cambiado a Activo.",
    },
    {
      id: 2,
      fecha_cambio: "2024-11-14",
      hora_cambio: "09:15",
      usuario_responsable: "Manager",
      accion: "Eliminación",
      datos_antes: "Producto: Arroz",
      modulo_afectado: "Inventarios",
      tabla_afectada: "Productos",
      descripcion: "Se eliminó un producto del inventario.",
    },
  ];

  // Filtrar auditorías según las fechas seleccionadas
  const filteredAudits = mockAudits.filter((audit) => {
    const auditDate = new Date(audit.fecha_cambio);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || auditDate >= start) && (!end || auditDate <= end)
    );
  });

  // Función para resetear el filtro
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="audits-screen">
      <h1 className="audits-title">Auditorías</h1>
      <div className="filters">
        <div className="filter-group">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="filter-btn" onClick={resetFilters}>
          Restablecer Filtros
        </button>
      </div>
      <AuditsTable audits={filteredAudits} />
    </div>
  );
};

export default AuditsScreen;
