import React, { useEffect } from "react";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const FarmCard = ({ farm, onDelete, onEdit, onNavigate, isSelected }) => {
  useEffect(() => {
    // console.log("Datos de la finca recibidos:", farm);
  }, [farm]);

  const handleNavigate = () => {
    // Llama a la función de navegación
    onNavigate();

    // Redirige la ventana a la parte superior
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Esto hace que el scroll sea suave
    });
  };

  return (
    <div
      className={`card-finca ${isSelected ? "selected" : ""}`} // Aplica la clase "selected" solo si está seleccionada
      onClick={handleNavigate} // Toda la card es un botón excepto los íconos
      style={{
        cursor: "pointer",
        transition: "box-shadow 0.3s ease", // Transición suave para la sombra
        boxShadow: isSelected ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none", // Sombra solo si está seleccionada
      }}
    >
      <div className="icon-container">
        <AgricultureIcon style={{ fontSize: "2rem", color: "white" }} />
      </div>
      <div className="content">
        <div className="info">
          <h3>{farm.nombre}</h3>
          <small className="text-muted">{farm.ubicacion}</small>
        </div>
      </div>
      <div className="actions">
        <EditIcon
          style={{ cursor: "pointer", color: "blue" }}
          onClick={(e) => {
            e.stopPropagation(); // Evitar que el clic en el ícono navegue a la tabla de lotes
            onEdit(farm);
          }}
          onMouseEnter={(e) => (e.target.style.color = "darkblue")}
          onMouseLeave={(e) => (e.target.style.color = "blue")}
        />
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={(e) => {
            e.stopPropagation(); // Evitar que el clic en el ícono navegue a la tabla de lotes
            onDelete(farm);
          }}
          onMouseEnter={(e) => (e.target.style.color = "darkred")}
          onMouseLeave={(e) => (e.target.style.color = "red")}
        />
      </div>
    </div>
  );
};

export default FarmCard;
