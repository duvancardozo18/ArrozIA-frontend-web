import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo.png";
import LogoWhite from "../../assets/images/logo.png";
import { FaUserCog, FaKey } from "react-icons/fa";

import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineMessage,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importar useLocation y useNavigate
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation(); // Usar useLocation para obtener la ruta actual
  const navigate = useNavigate(); // Usar useNavigate para manejar la navegación programáticamente

  // Función para determinar si el enlace está activo
  const isActive = (path) => location.pathname === path;

  // Cerrar la barra lateral al hacer clic fuera de ella
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
    // Aquí puedes eliminar tokens o realizar cualquier limpieza necesaria
    localStorage.removeItem('access_token');
    // Redirigir al login o a la página principal
    navigate('/');
  };

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
            width="50"  // Agrega el tamaño deseado
            height="50" // Agrega el tamaño deseado
          />
          <span className="sidebar-brand-text">ARROZ IA</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/dashboard" className={`menu-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Inicio</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/fincas" className={`menu-link ${isActive('/fincas') ? 'active' : ''}`}>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={20} />
                </span>
                <span className="menu-link-text">Fincas</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/users" className={`menu-link ${isActive('/users') ? 'active' : ''}`}>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Usuarios</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/roles" className={`menu-link ${isActive('/roles') ? 'active' : ''}`}>
                <span className="menu-link-icon">
                  <FaUserCog />
                </span>
                <span className="menu-link-text">Roles</span>
              </Link>
            </li>
            <li className="menu-item">
              
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/settings" className={`menu-link ${isActive('/settings') ? 'active' : ''}`}>
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li>
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
