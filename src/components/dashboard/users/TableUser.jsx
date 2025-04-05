import React, { useEffect, useState } from "react";
import AreaTableAction from "./TableUserAction";
import "../../../css/AreaTable.css";
import axiosInstance from '../../../config/AxiosInstance';

const TABLE_HEADS = [
  "Nombre",
  "Apellido",
  "Correo electrónico",
  "Fincas",
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
          let farmNames = "Sin finca"; // Valor por defecto para finca
          let roleName = "Sin rol";    // Valor por defecto para rol

          try {
            // Obtener todas las fincas del usuario
            const farmResponse = await axiosInstance.get(`/user-farms/${user.id}`);
            const farms = farmResponse.data;
            farmNames = farms.length > 0 ? farms.map(farm => farm.nombre).join(", ") : "Sin finca";
          } catch (error) {
            if (error.response?.status !== 404) {
              console.error(`Error fetching farms for user ${user.id}:`, error);
            }
          }

          try {
            // Obtener el rol del usuario
            const roleResponse = await axiosInstance.get(`/user-roles/user/${user.id}`);
            roleName = roleResponse.data?.nombre || "Sin rol";
          } catch (error) {
            if (error.response?.status !== 404) {
              console.error(`Error fetching role for user ${user.id}:`, error);
            }
          }

          return { 
            ...user, 
            farm_names: farmNames,
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
                  <td>{dataItem.farm_names}</td>
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
