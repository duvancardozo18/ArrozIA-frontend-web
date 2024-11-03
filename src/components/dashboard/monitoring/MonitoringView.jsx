// src/components/dashboard/monitoring/MonitoringView.jsx
import React, { useState, useContext, useEffect } from "react";
import Header from "../Header";
import ColumCards from "./ColumCards";
import ColumMonitoring from "./ColumMonitoring";
import { AuthContext } from "../../../config/AuthProvider";
import { Navigate } from "react-router-dom";
import "../../../css/Monitory.scss";
import axiosInstance from "../../../config/AxiosInstance";
import CreateMonitoringModal from "./CreateMonitoringModal";

const MonitoringView = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [monitorings, setMonitorings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const fetchCrops = async () => {
    try {
      const response = await axiosInstance.get("/crops/all");
      if (Array.isArray(response.data)) {
        setCrops(response.data);
      } else {
        console.error("La respuesta de /crops/all no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener cultivos:", error);
    }
  };

  // const fetchCrops = async () => {
  //   try {
  //     const response = await axiosInstance.get("/crops/all");
  //     if (Array.isArray(response.data)) {
  //       // Filtrar cultivos según las fincas del usuario y permisos
  //       const filteredCrops = response.data.filter(
  //         crop =>
  //           crop.land && 
  //           crop.land.finca_id && 
  //           userFarms.includes(crop.land.finca_id) && 
  //           permissions.includes("ver_cultivo")
  //       );
  //       setCrops(filteredCrops);
  //     } else {
  //       console.error("La respuesta de /crops/all no es un array:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener cultivos:", error);
  //   }
  // };
  

const fetchMonitorings = async (cropId) => {
  try {
    const response = await axiosInstance.get(`/monitoring/by_crop/${cropId}`);
    if (response.data.length > 0) {
      setMonitorings(response.data); // Actualiza monitoreos sin abrir el modal
    } else {
      setMonitorings([]); // Si no hay monitoreos, solo limpia la lista
    }
  } catch (error) {
    console.error("Error al obtener monitoreos:", error);
  }
};



  useEffect(() => {
    fetchCrops();
  }, []);

  const handleCropSelect = (crop) => {
    console.log("Cultivo seleccionado:", crop); // Muestra los datos completos del cultivo en la consola
    setSelectedCrop(crop);
    fetchMonitorings(crop.id);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshMonitorings = () => {
    if (selectedCrop) fetchMonitorings(selectedCrop.id);
  };

  return (
    <div className="content-area">
      <Header title="Monitoreo de Cultivos" />
      <div className="monitoring-view-container">
        <ColumCards crops={crops} selectedCrop={selectedCrop} onSelectCrop={handleCropSelect} />
        <ColumMonitoring selectedCrop={selectedCrop}
          monitorings={monitorings}
          onOpenModal={() => setIsModalOpen(true)}
          refreshMonitorings={refreshMonitorings} // Pasa refreshMonitorings como prop
           />
      </div>

      {isModalOpen && (
        <CreateMonitoringModal
        closeModal={closeModal}
        fetchMonitorings={refreshMonitorings}
        selectedCrop={selectedCrop}
      />      
      )}
    </div>
  );
};

export default MonitoringView;

// src/components/dashboard/monitoring/MonitoringView.jsx
// import React, { useState, useEffect } from "react";
// import Header from "../Header";
// import ColumCards from "./ColumCards";
// import ColumMonitoring from "./ColumMonitoring";
// import { Navigate } from "react-router-dom";
// import "../../../css/Monitory.scss";
// import axiosInstance from "../../../config/AxiosInstance";
// import CreateMonitoringModal from "./CreateMonitoringModal";
// import { AuthProvider } from "../../../config/AuthProvider";

// const MonitoringView = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
//   const [crops, setCrops] = useState([]);
//   const [selectedCrop, setSelectedCrop] = useState(null);
//   const [monitorings, setMonitorings] = useState([]);
//   const [userFarms, setUserFarms] = useState([]);
//   const [permissions, setPermissions] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   // Función para obtener userFarms y permisos del usuario
//   const fetchUserPermissionsAndFarms = async () => {
//     try {
//       const userId = localStorage.getItem("userId"); // Usar el ID de usuario guardado
//       const farmsResponse = await axiosInstance.get(`/user-farms/${userId}`);
//       setUserFarms(farmsResponse.data.map(record => record.finca_id));

//       const permissionsResponse = await axiosInstance.get(`/roles/${userId}/permissions`);
//       setPermissions(permissionsResponse.data.permissions);
//     } catch (error) {
//       console.error("Error obteniendo permisos o fincas del usuario:", error);
//     }
//   };

//   const fetchCrops = async () => {
//     try {
//       const response = await axiosInstance.get("/crops/all");
//       if (Array.isArray(response.data)) {
//         // Filtrar cultivos según las fincas del usuario y permisos
//         const filteredCrops = response.data.filter(
//           crop =>
//             crop.land &&
//             crop.land.finca_id &&
//             userFarms.includes(crop.land.finca_id) &&
//             permissions.includes("ver_cultivo")
//         );
//         setCrops(filteredCrops);
//       } else {
//         console.error("La respuesta de /crops/all no es un array:", response.data);
//       }
//     } catch (error) {
//       console.error("Error al obtener cultivos:", error);
//     }
//   };

//   const fetchMonitorings = async (cropId) => {
//     try {
//       const response = await axiosInstance.get(`/monitoring/by_crop/${cropId}`);
//       setMonitorings(response.data.length > 0 ? response.data : []);
//     } catch (error) {
//       console.error("Error al obtener monitoreos:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserPermissionsAndFarms();
//     fetchCrops();
//   }, []);

//   const handleCropSelect = (crop) => {
//     console.log("Cultivo seleccionado:", crop); // Muestra los datos completos del cultivo en la consola
//     setSelectedCrop(crop);
//     fetchMonitorings(crop.id);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const refreshMonitorings = () => {
//     if (selectedCrop) fetchMonitorings(selectedCrop.id);
//   };

//   return (
//     <div className="content-area">
//       <Header title="Monitoreo de Cultivos" />
//       <div className="monitoring-view-container">
//         <ColumCards crops={crops} selectedCrop={selectedCrop} onSelectCrop={handleCropSelect} />
//         <ColumMonitoring
//           selectedCrop={selectedCrop}
//           monitorings={monitorings}
//           onOpenModal={() => setIsModalOpen(true)}
//           refreshMonitorings={refreshMonitorings}
//         />
//       </div>

//       {isModalOpen && (
//         <CreateMonitoringModal
//           closeModal={closeModal}
//           fetchMonitorings={refreshMonitorings}
//           selectedCrop={selectedCrop}
//         />
//       )}
//     </div>
//   );
// };

// export default MonitoringView;
