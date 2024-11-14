import { useContext, useEffect } from "react";
import "./css/App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { PageNotFound, Users, Login, Roles, Farms, ResetPassword, AgriculturalManagement, Mechanization, Task, Monitoring, SoilAnalysis, Reports } from "./screens";
import Unauthorized from "./config/Unauthorized";
import { AuthProvider } from "./config/AuthProvider";
import PrivateRoute from "./config/PrivateRoute";
import Crops from "./screens/dashboard/Crops";
import VegetativeCycle from "./screens/dashboard/vegetativeCycle";
import LandsMain from "./components/dashboard/crops/CropsMain";
import ResetPasswordForm from './screens/password/ResetPasswordForm';
import ResetPasswordFormFirst from './screens/password/ResetPasswordFormFirst';
import CropView from './components/dashboard/crops/CropView';
import VegetativeCard from './components/dashboard/vegetativecycle/VegetativeCard';
import Calendar from './components/dashboard/lands/MyCalendarPage';
import Diagnosis from './components/dashboard/diagnosis2/CropSelection';
import WeatherMonitoringView from './components/dashboard/datosMeteorologicos/WeatherMonitoringView';
import { Profile } from "./screens";
import ReportsView from "./components/dashboard/reports/ReportsView";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  const themeToggleButton = (
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
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/" element={<Login />} />

          {/* Ruta pública para la solicitud de restablecimiento de contraseña */}
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Ruta pública para cambio de contraseña en primer login */}
          <Route path="/change-password-first" element={<ResetPasswordFormFirst />} />

          {/* Ruta para restablecer la contraseña usando el token */}
          <Route path="/Reset_Password/:token" element={<ResetPasswordForm />} />

          {/* Rutas protegidas envueltas en BaseLayout */}
          <Route element={<PrivateRoute element={<BaseLayout />} />}>
            <Route path="/users" element={<PrivateRoute element={<Users />} requiredPermission="crear_usuario" />} />
            <Route path="/roles" element={<PrivateRoute element={<Roles />} requiredPermission="crear_rol" />} />
            <Route path="/farms" element={<PrivateRoute element={<Farms />} />} />
            <Route path="/crops" element={<PrivateRoute element={<Crops />} />} />
            <Route path="/diagnosis" element={<PrivateRoute element={<Diagnosis />} />} />
            <Route path="/land/:loteId/crop" element={<PrivateRoute element={<LandsMain />} />} />
            <Route path="/agricultural_management" element={<PrivateRoute element={<AgriculturalManagement />} />} />
            <Route path="/vegetative-cycle" element={<PrivateRoute element={<VegetativeCycle />} requiredPermission="crear_usuario" />} />
            <Route path="/mechanization" element={<PrivateRoute element={<Mechanization />} />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/finca/:fincaSlug/lote/:loteSlug/cultivo/:cultivoSlug" element={<CropView />} />
            <Route path="/" element={<Calendar />} />
            <Route path="/ciclo-vegetativo" element={<VegetativeCard />} />   
            <Route path="/task" element={<PrivateRoute element={<Task />} />} />
            <Route path="/reports" element={<PrivateRoute element={<ReportsView />} />} />
            <Route path="/monitoring" element={<PrivateRoute element={<Monitoring />} />} />
            <Route path="/weather-monitoring" element={<PrivateRoute element={<WeatherMonitoringView />} />} />
            <Route path="/soil_analysis" element={<PrivateRoute element={<SoilAnalysis />} />} />
            
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
