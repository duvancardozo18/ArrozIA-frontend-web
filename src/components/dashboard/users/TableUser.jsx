import React, { useEffect, useState } from "react";
import AreaTableAction from "./TableUserAction";
import "../../../css/AreaTable.scss";
import axiosInstance from '../../../config/AxiosInstance';

const TABLE_HEADS = [
  "Nombre",
  "Apellido",
  "Correo electrónico",
  "Finca",
  "Rol",
  "Acciones",
];

const AreaTable = ({ refresh }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      const users = response.data;

      const usersWithFarmAndRole = await Promise.all(
        users.map(async (user) => {
          let farmName = "Sin finca"; // Valor por defecto para finca
          let roleName = "Sin rol";   // Valor por defecto para rol
          let roleId = null;

          try {
            // Intenta obtener la finca con su nombre
            const farmResponse = await axiosInstance.get(`/user-farm-rol/${user.id}`);
            farmName = farmResponse.data?.farm_name || "Sin finca";
          } catch (error) {
            // Solo muestra errores que no sean 404
            if (error.response?.status !== 404) {
              console.error(`Error fetching farm for user ${user.id}:`, error);
            }
          }

          try {
            // Intenta obtener el rol con su id y nombre
            const roleResponse = await axiosInstance.get(`/user-roles/user/${user.id}`);
            roleName = roleResponse.data?.nombre || "Sin rol";
            roleId = roleResponse.data?.id || null;
          } catch (error) {
            // Solo muestra errores que no sean 404
            if (error.response?.status !== 404) {
              console.error(`Error fetching role for user ${user.id}:`, error);
            }
          }

          return { 
            ...user, 
            farm_name: farmName,
            rol_id: roleId,
            role_name: roleName
          };
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
  }, [refresh]);

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
                  <td>{dataItem.farm_name}</td>
                  <td>{dataItem.role_name}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction user={dataItem} onSave={fetchUsers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AreaTable;
