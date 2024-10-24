import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo.png";
import LogoWhite from "../../assets/images/logo.png";
import { FaUserCog } from "react-icons/fa";
import {
  MdOutlineAgriculture,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlinePeople,
  MdOutlinePerson2,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { AuthContext } from "../../config/AuthProvider"; // Importar el contexto de autenticación

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const { userId, permissions } = useContext(AuthContext); // Obtener userId y permisos desde el contexto de autenticación
  const navbarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Función para determinar si el enlace está activo
  const isActive = (path) => location.pathname === path;

  // Verificar permisos desde el contexto
  const hasPermission = (permission) => permissions.includes(permission); // Generalizar la verificación de permisos

  // Función para cerrar la barra lateral al hacer clic fuera de ella
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

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  // Componente para un enlace del menú
  const MenuItem = ({ to, icon, text }) => (
    <li className="menu-item">
      <Link
        to={to}
        className={`menu-link ${isActive(to) ? "active" : ""}`}
        onClick={closeSidebar} // Cerrar el sidebar al hacer clic
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
          <p style={{ fontSize: '20px', color: '#ABABB5', fontWeight: 'bold' }}>Arroz IA</p>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            {/* Menú de Fincas */}
            <MenuItem to="/farms" icon={<MdOutlineBarChart size={35} />} text="Fincas" />
            {/* <MenuItem to="/crops" icon={<MdOutlineBarChart size={35} />} text="Cultivos" /> */}
            
            {/* Menú de Gestión Agrícola con el icono actualizado */}
            <MenuItem to="/agricultural_management" icon={<MdOutlineAgriculture size={35} />} text="Gestión Agrícola" />

            {hasPermission("crear_usuario") && (
              <MenuItem to="/vegetative-cycle" icon={<MdOutlineBarChart size={35} />} text="Ciclo Vegetativo" />
            )}

            {/* Menú de Usuarios y Roles con verificación de permisos */}
            {hasPermission("crear_usuario") && (
              <MenuItem to="/users" icon={<MdOutlinePeople size={35} />} text="Usuarios" />
            )}
            {hasPermission("crear_rol") && (
              <MenuItem to="/roles" icon={<FaUserCog size={35}/>} text="Roles" />
            )}
          </ul>
        </div>

        {/* Menú de perfil y logout */}
        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <MenuItem to="/profile" icon={<MdOutlinePerson2 size={35} />} text="Perfil" />
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={35} />
                </span>
                <span className="menu-link-text" style={{ fontSize: '16px' }}>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
