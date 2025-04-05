import { useContext, useEffect } from "react";
import "./css/App.css";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Iconos y tema
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";

// Layout y configuración
import BaseLayout from "./layout/BaseLayout";
import PrivateRoute from "./config/PrivateRoute";
import { AuthProvider } from "./config/AuthProvider";
import Unauthorized from "./config/Unauthorized";

// Pantallas principales
import {
  PageNotFound,
  Users,
  Login,
  Roles,
  Farms,
  ResetPassword,
  AgriculturalManagement,
  Mechanization,
  Task,
  Monitoring,
  SoilAnalysis,
  Reports,
  Profile,
} from "./screens";

// Pantallas adicionales y componentes
import Crops from "./screens/dashboard/Crops";
import VegetativeCycle from "./screens/dashboard/vegetativeCycle";
import LandsMain from "./components/dashboard/crops/CropsMain";
import ResetPasswordForm from "./screens/password/ResetPasswordForm";
import ResetPasswordFormFirst from "./screens/password/ResetPasswordFormFirst";
import CropView from "./components/dashboard/crops/CropView";
import VegetativeCard from "./components/dashboard/vegetativecycle/VegetativeCard";
import Calendar from "./components/dashboard/lands/MyCalendarPage";
import Diagnosis from "./components/dashboard/diagnosis2/CropSelection";
import WeatherMonitoringView from "./components/dashboard/datosMeteorologicos/WeatherMonitoringView";
import ReportsView from "./components/dashboard/reports/ReportsView";
import AuditsScreen from "./screens/dashboard/AuditsScreen"; // Nueva importación

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === DARK_THEME);
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password-first" element={<ResetPasswordFormFirst />} />
          <Route path="/Reset_Password/:token" element={<ResetPasswordForm />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute element={<BaseLayout />} />}>
            {/* Gestión de usuarios y roles */}
            <Route path="/users" element={<PrivateRoute element={<Users />} requiredPermission="crear_usuario" />} />
            <Route path="/roles" element={<PrivateRoute element={<Roles />} requiredPermission="crear_rol" />} />

            {/* Gestión de fincas y cultivos */}
            <Route path="/farms" element={<PrivateRoute element={<Farms />} />} />
            <Route path="/land/:loteId/crop" element={<PrivateRoute element={<LandsMain />} />} />
            <Route path="/crops" element={<PrivateRoute element={<Crops />} />} />

            {/* Funcionalidades agrícolas */}
            <Route path="/agricultural_management" element={<PrivateRoute element={<AgriculturalManagement />} />} />
            <Route path="/vegetative-cycle" element={<PrivateRoute element={<VegetativeCycle />} />} />
            <Route path="/ciclo-vegetativo" element={<VegetativeCard />} />
            <Route path="/mechanization" element={<PrivateRoute element={<Mechanization />} />} />

            {/* Monitoreo y diagnósticos */}
            <Route path="/monitoring" element={<PrivateRoute element={<Monitoring />} />} />
            <Route path="/diagnosis" element={<PrivateRoute element={<Diagnosis />} />} />
            <Route path="/weather-monitoring" element={<PrivateRoute element={<WeatherMonitoringView />} />} />
            <Route path="/soil_analysis" element={<PrivateRoute element={<SoilAnalysis />} />} />

            {/* Reportes y auditorías */}
            <Route path="/reports" element={<PrivateRoute element={<ReportsView />} />} />
            <Route path="/audits" element={<PrivateRoute element={<AuditsScreen />} />} /> {/* Ruta de auditorías */}

            {/* Perfil y otras funcionalidades */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Vista de calendario */}
            <Route path="/" element={<Calendar />} />

            {/* Vista de cultivos específicos */}
            <Route path="/finca/:fincaSlug/lote/:loteSlug/cultivo/:cultivoSlug" element={<CropView />} />

            {/* Tareas */}
            <Route path="/task" element={<PrivateRoute element={<Task />} />} />
          </Route>

          {/* Ruta para manejar errores */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
