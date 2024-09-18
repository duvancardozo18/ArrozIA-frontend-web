import React, { useEffect, useState } from "react";
import AreaTableAction from "./AreaTableAction";
import "../../../css/AreaTable.scss";
import axiosInstance from '../../../config/AxiosInstance';
import Newuser from "../../../screens/users/Newuser";  // Asegúrate de que la ruta sea correcta

const TABLE_HEADS = [
  "Nombre",
  "Apellido",
  "Correo electrónico",
  "Finca",
  "Rol",
  "Acciones",
];

const AreaTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  // Función para obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      // Primera llamada a la ruta '/users' para obtener los usuarios
      const response = await axiosInstance.get('/users');
      const users = response.data;

      // Para cada usuario, llamamos a la ruta '/user-farm-rol/{user_id}' para obtener su finca y rol
      const usersWithFarmAndRole = await Promise.all(
        users.map(async (user) => {
          try {
            const farmAndRoleResponse = await axiosInstance.get(`/user-farm-rol/${user.id}`);
            console.log(`Datos de finca y rol para el usuario ${user.id}:`, farmAndRoleResponse.data);
            return { 
              ...user, 
              finca_id: farmAndRoleResponse.data.finca_id, 
              rol_id: farmAndRoleResponse.data.rol_id 
            };
          } catch (error) {
            console.error(`Error fetching farm and role for user ${user.id}:`, error);
            return { ...user, finca_id: null, rol_id: null };  // Si ocurre un error, asignamos finca_id y rol_id como null
          }
        })
      );

      setTableData(usersWithFarmAndRole);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = (newUser) => {
    setTableData((prevData) => [...prevData, newUser]);  // Añade el nuevo usuario a la tabla
    setShowNewUserModal(false);  // Cierra el modal después de guardar
  };

  return (
    <section className="content-area-table">
      <div className="data-table-diagram">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                {TABLE_HEADS.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((dataItem) => (
                <tr key={dataItem.id}>
                  <td>{dataItem.nombre}</td>
                  <td>{dataItem.apellido}</td>
                  <td>{dataItem.email}</td>
                  <td>{dataItem.finca_id ? dataItem.finca_id : "Sin finca"}</td>
                  <td>{dataItem.rol_id ? dataItem.rol_id : "Sin rol"}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction user={dataItem} onSave={fetchUsers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para crear un nuevo usuario */}
      {showNewUserModal && (
        <Newuser
          closeModal={() => setShowNewUserModal(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

export default AreaTable;
