import React, { useEffect, useState } from "react";
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";
import axiosInstance from '../../../config/AxiosInstance';
import Newuser from "../../../screens/users/Newuser";  // Asegúrate de que la ruta sea correcta

const TABLE_HEADS = [
  "Nombre",
  "Apellido",
  "Email",
  "Acciones",
];

const AreaTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setTableData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = (newUser) => {
    setTableData((prevData) => [...prevData, newUser]);  // Añade el nuevo usuario a la tabla
    setShowNewUserModal(false);  // Cierra el modal después de guardar
  };

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
                {TABLE_HEADS?.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((dataItem) => (
                <tr key={dataItem.id}>
                  <td>{dataItem.nombre}</td>
                  <td>{dataItem.apellido}</td>
                  <td>{dataItem.email}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction user={dataItem} onSave={fetchData} />
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
