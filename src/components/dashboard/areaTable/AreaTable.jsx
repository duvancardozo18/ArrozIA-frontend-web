import React, { useEffect, useState } from "react";
import AreaTableAction from "./AreaTableAction";
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
          try {
            const farmAndRoleResponse = await axiosInstance.get(`/user-farm-rol/${user.id}`);
            return { 
              ...user, 
              finca_id: farmAndRoleResponse.data.finca_id, 
              rol_id: farmAndRoleResponse.data.rol_id 
            };
          } catch (error) {
            console.error(`Error fetching farm and role for user ${user.id}:`, error);
            return { ...user, finca_id: null, rol_id: null };
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
    </section>
  );
};

export default AreaTable;
