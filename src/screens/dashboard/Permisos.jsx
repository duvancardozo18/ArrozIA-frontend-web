import React from 'react';
import { AreaTop } from "../../components";
import { AuthProvider } from '../../config/AuthProvider';  // Importa AuthProvider

const Permisos = () => {
  return (
    <AuthProvider>  {/* Envuelve el componente en AuthProvider */}
      <div className="content-area">
        <AreaTop title="Permisos" /> 
        {/* Los demás componentes están en blanco o no se muestran */}
      </div>
    </AuthProvider>
  );
};

export default Permisos;
