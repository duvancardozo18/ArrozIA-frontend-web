import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo.png";
import LogoWhite from "../../assets/images/logo.png";
import { FaUserCog, FaDrupal, FaClock } from "react-icons/fa"; // Importamos FaClock para el ícono del reloj
import {
  MdOutlineAgriculture,
  MdOutlineCloud,
  MdOutlineClose,
  MdOutlineLogout,
  MdOutlinePeople,
  MdOutlinePerson2,
  MdOutlineAssignment,
} from "react-icons/md";
import { GiBarn } from "react-icons/gi";
import { BiTask } from "react-icons/bi";
import { LuMonitorDot } from "react-icons/lu";
import { FaSearch, FaMapSigns, FaSeedling } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/Sidebar.css";
import { SidebarContext } from "../../context/SidebarContext";
import { AuthContext } from "../../config/AuthProvider";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const { userId, permissions } = useContext(AuthContext);
  const navbarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const hasPermission = (permission) => permissions.includes(permission);

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const MenuItem = ({ to, icon, text, onClick }) => (
    <li className="menu-item">
      <Link
        to={to || "#"}
        className={`menu-link ${isActive(to) ? "active" : ""}`}
        onClick={onClick || closeSidebar}
      >
        <span className="menu-link-icon">{icon}</span>
        <span className="menu-link-text">{text}</span>
      </Link>
    </li>
  );

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img
            src={theme === LIGHT_THEME ? LogoBlue : LogoWhite}
            alt="Logo"
            width="50"
            height="50"
          />
          <p style={{ fontSize: "20px", color: "#ABABB5", fontWeight: "bold" }}>
            Arroz IA
          </p>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
          {hasPermission("ver_finca") && (
              <MenuItem to="/farms" icon={<GiBarn size={35} />} text="Fincas" />
            )}
            {hasPermission("ver_gestion_agricola") && (
              <MenuItem
              to="/agricultural_management"
              icon={<MdOutlineAgriculture size={35} />}
              text="Gestión Agrícola"
            />
            )}
             {hasPermission("ver_diagnosticos") && (
               <MenuItem to="/diagnosis" icon={<FaSearch size={35} />} text="Diagnósticos" />
            )}
             {hasPermission("ver_reportes") && (
               <MenuItem
               to="/reports"
               icon={<MdOutlineAssignment size={35} />}
               text="Reportes"
             />
            )}
             {hasPermission("ver_tarea") && (
              <MenuItem to="/task" icon={<BiTask size={35} />} text="Tareas" />
            )}
            {hasPermission("ver_monitoreo") && (
                <MenuItem
                to="/monitoring"
                icon={<LuMonitorDot size={35} />}
                text="Monitoreo"
              />
            )}
             {hasPermission("ver_datos_meteorologicos") && (
               <MenuItem
               to="/weather-monitoring"
               icon={<MdOutlineCloud size={35} />}
               text="Datos Meteorológicos"
             />
            )}
             {hasPermission("ver_analisis_edafologico") && (
               <MenuItem
               to="/soil_analysis"
               icon={<FaSeedling size={35} />}
               text="Análisis edafológico"
             />
            )}
             {hasPermission("ver_auditorias") && (
               <MenuItem
               to="/audits" // Nueva ruta para Auditorías
               icon={<FaClock size={35} />} // Ícono de reloj
               text="Auditorías"
             />
            )}
            {hasPermission("crear_usuario") && (
              <MenuItem
                to="/users"
                icon={<MdOutlinePeople size={35} />}
                text="Usuarios"
              />
            )}
            {hasPermission("crear_rol") && (
              <MenuItem to="/roles" icon={<FaUserCog size={35} />} text="Roles" />
            )}
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <MenuItem
              to="/profile"
              icon={<MdOutlinePerson2 size={35} />}
              text="Perfil"
            />
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={35} />
                </span>
                <span
                  className="menu-link-text"
                  style={{ fontSize: "16px" }}
                >
                  Cerrar sesión
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
