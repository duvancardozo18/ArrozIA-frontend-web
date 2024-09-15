import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound, Users, Login, Roles, Fincas, ResetPassword } from "./screens";
import Unauthorized from "./config/Unauthorized";
import { AuthProvider } from "./config/AuthProvider"; // Importar AuthProvider
import PrivateRoute from "./config/PrivateRoute"; // Importar PrivateRoute
import TablePermisos from "./components/dashboard/areaTable/TablePermisos"; // Importar TablePermisos
import ResetPasswordForm from './screens/password/ResetPasswordForm'; // Asegúrate de importar el componente correctamente

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/" element={<Login />} />

          {/* Ruta pública para la solicitud de restablecimiento de contraseña */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Ruta para restablecer la contraseña usando el token */}
          <Route path="/Reset_Password/:token" element={<ResetPasswordForm />} />

          {/* Rutas protegidas envueltas en BaseLayout */}
          <Route element={<BaseLayout />}>
            {/* Rutas protegidas con PrivateRoute */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/users" element={<PrivateRoute element={<Users />} requiredPermission="view_secure_data" />} />
            <Route path="/roles" element={<PrivateRoute element={<Roles />} requiredPermission="edit_secure_data" />} />
            <Route path="/fincas" element={<PrivateRoute element={<Fincas />} />} />
            <Route path="/permisos" element={<PrivateRoute element={<TablePermisos />} />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
            alt="theme icon"
          />
        </button>
      </Router>
    </AuthProvider>
  );
}

export default App;