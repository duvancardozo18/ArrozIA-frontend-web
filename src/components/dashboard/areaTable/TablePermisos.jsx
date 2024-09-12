import React, { useEffect, useState } from "react";
import AreaTableActionPermisos from "./AreaTableActionPermisos";
import "./AreaTable.scss";
import axiosInstance from '../../../config/AxiosInstance';  // Importar la instancia de Axios

const TABLE_HEADS = [
  "Nombre",
  "Descripción",
  "Acciones"  // Encabezado para la columna de acciones
];

const TablePermisos = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionIds, setPermissionIds] = useState([1, 2, 3, 4]);  // Lista de IDs de permisos

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const promises = permissionIds.map(id => 
          axiosInstance.get(`/permissions/${id}`).catch(error => null)  // Manejo de errores individuales
        );
        const responses = await Promise.all(promises);
        const data = responses.filter(response => response !== null).map(response => response.data);
        setTableData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los permisos:", error);
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [permissionIds]);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Permisos</h4>
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
                  <td>{dataItem.nombre}</td>
                  <td>{dataItem.descripcion}</td>
                  <td className="dt-cell-action">
                    <AreaTableActionPermisos permiso={dataItem} onSave={() => fetchPermissions()} />
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

export default TablePermisos;
