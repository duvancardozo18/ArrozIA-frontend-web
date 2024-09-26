import React, { useEffect, useState } from "react";
import AreaTableActionRoles from "./TableRoleAction"; 
import "../../../css/AreaTable.scss";
import axiosInstance from '../../../config/AxiosInstance';  
 

const TABLE_HEADS = [
  "#",
  "Nombre",
  "Acciones",
  ""  // Agregando el encabezado "Acciones"
];

const TableRole = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const fetchData = async () => {  // Mover la función fuera del useEffect para reutilizarla
    try {
      const response = await axiosInstance.get('/roles');
      const data = response.data;

      if (Array.isArray(data)) {
        setTableData(data);
      } else if (data && Array.isArray(data.roles)) {
        setTableData(data.roles);
      } else {
        setTableData([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();  // Llamar a la función fetchData cuando el componente se monta
  }, []);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title"></h4>
      </div>
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
                  <td>{dataItem.id}</td>
                  <td>{dataItem.nombre}</td>
                  {/* <td>{dataItem.descripcion}</td> */}
                  
                  <td className="dt-cell-action">
                    <AreaTableActionRoles role={dataItem} onSave={fetchData} />
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

export default TableRole;
