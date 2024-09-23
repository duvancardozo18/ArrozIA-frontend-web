import React, { useContext } from 'react';
import { AreaTop } from "../../components";
import { AuthContext } from "../../config/AuthProvider";
import ButtonCrearCultivo from '../../components/ButtonCrearCultivo'; // Importa el botón
import './Crop.scss';
import { Navigate } from 'react-router-dom';

const Crop = ({ selectedAllotment }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="content-area">
      <AreaTop title="Cultivos" />
      <div className="layout">
        {/* Verificar si hay un lote seleccionado */}
        {selectedAllotment ? (
          <>
            <ButtonCrearCultivo /> {/* Botón para crear cultivo */}
            {/* Aquí puedes agregar más contenido relacionado con los cultivos */}
          </>
        ) : (
          <p>No se ha seleccionado ningún lote. Por favor, seleccione un lote para ver sus cultivos.</p>
        )}
      </div>
    </div>
  );
};

export default Crop;
