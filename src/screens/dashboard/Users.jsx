import React, { useContext, useEffect } from 'react';
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";
import ButtonCrear from '../../components/dashboard/ButtonCreate';
import { AuthContext } from "../../config/AuthProvider";
import { Navigate } from 'react-router-dom';
import NewUser from '../../screens/users/Newuser';

const Usars = () => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Obtén el token desde localStorage

    if (token) {
      console.log('Token encontrado en localStorage:', token);
    } else {
      console.log('No se encontró ningún token en localStorage');
    }
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Si el usuario no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    
    <div className="content-area">
       <div>
     
    </div>
      <AreaTop title="Usuarios" />
      <ButtonCrear buttonText="Crear usuario" ModalComponent={NewUser}/>
      <AreaTable />
    </div>
  );
};

export default Usars;
