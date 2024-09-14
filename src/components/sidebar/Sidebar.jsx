import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo.png";
import LogoWhite from "../../assets/images/logo.png";
import { FaUserCog } from "react-icons/fa";
import {
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineSettings,
  MdOutlinePeople,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { AuthContext } from "../../config/AuthProvider"; // Importar el contexto de autenticación
import axiosInstance from '../../config/AxiosInstance';

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const { userId } = useContext(AuthContext); // Obtener userId desde el contexto de autenticación
  const navbarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [canViewUsers, setCanViewUsers] = useState(false);
  const [canViewRoles, setCanViewRoles] = useState(false);

  // Función para determinar si el enlace está activo
  const isActive = (path) => location.pathname === path;

  // Verificar el permiso "view_secure_data" para el módulo de usuarios
  const checkPermissionsUsers = async () => {
    try {
      console.log("User ID for permissions check (Users):", userId); // Verificar si userId es correcto
      if (userId) {
        const response = await axiosInstance.get(`/view-secure-data?user_id=${userId}`);
        if (response.status === 200) {
          setCanViewUsers(true);
        }
      }
    } catch (error) {
      console.error("Error checking user permissions:", error);
      setCanViewUsers(false); // Si hay un error, ocultar el módulo de usuarios
    }
  };

  // Verificar el permiso "edit_secure_data" para el módulo de roles
  const checkPermissionsRoles = async () => {
    try {
      console.log("User ID for permissions check (Roles):", userId); // Verificar si userId es correcto
      if (userId) {
        const response = await axiosInstance.get(`/edit-secure-data?user_id=${userId}`);
        if (response.status === 200) {
          setCanViewRoles(true);
        }
      }
    } catch (error) {
      console.error("Error checking roles permissions:", error);
      setCanViewRoles(false); // Si hay un error, ocultar el módulo de roles
    }
  };

  useEffect(() => {
    if (userId) { // Solo ejecuta si `userId` no es null
      checkPermissionsUsers();
      checkPermissionsRoles();
    }
  }, [userId]); // Asegurarse de que se ejecuta cuando `userId` está disponible

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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
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
            width="50" 
            height="50" 
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
            {canViewUsers && ( // Mostrar el módulo solo si el usuario tiene permiso
              <li className="menu-item">
                <Link to="/users" className={`menu-link ${isActive('/users') ? 'active' : ''}`}>
                  <span className="menu-link-icon">
                    <MdOutlinePeople size={20} />
                  </span>
                  <span className="menu-link-text">Usuarios</span>
                </Link>
              </li>
            )}
            {canViewRoles && ( // Mostrar el módulo solo si el usuario tiene permiso
              <li className="menu-item">
                <Link to="/roles" className={`menu-link ${isActive('/roles') ? 'active' : ''}`}>
                  <span className="menu-link-icon">
                    <FaUserCog />
                  </span>
                  <span className="menu-link-text">Roles</span>
                </Link>
              </li>
            )}
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
