import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Usuarios from "./views/Usuarios";
import Pacientes from "./views/Pacientes";
import Especialistas from "./views/Especialistas";
import Expedientes from "./views/Expedientes";
import Enfermeria from "./views/Enfermeria";
import EspecialistaHorario from "./views/EspecialistaHorario";
import RegistrosEnfermeria from "./views/RegistrosEnfermeria";
import MisProcedimientos from "./views/MisProcedimientos";
import Caja from "./views/Caja";
import ReportesFinancieros from "./views/ReportesFinancieros";
import CrearCita from "./views/CrearCita";
import Citas from "./views/Citas";
import CitasDoctor from "./views/CitasDoctor";
import Consultas from "./views/Consultas";
import AtenderConsulta from "./views/AtenderConsulta";
import Encabezado from "./components/Encabezado";
import ProtectedRoute from "./assets/routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>

      <Router>

        <Encabezado />

        <Routes>

          {/* Login */}

          <Route
            path="/"
            element={<Login />}
          />

          {/* Inicio */}

          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            }
          />

          {/* Próximos módulos */}

          <Route
            path="/pacientes"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Pacientes />
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Usuarios />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-procedimientos"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <MisProcedimientos />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/caja"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR", "RECEPCION"]}>
                <div className="p-4">
                  <Caja />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reportes-financieros"
            element={
              <ProtectedRoute roles={["ADMINISTRADOR"]}>
                <div className="p-4">
                  <ReportesFinancieros />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas-doctor"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <CitasDoctor />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/consultas"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Consultas />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path ="/consultas/atender/:id_cita"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <AtenderConsulta />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/especialista-horario"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <EspecialistaHorario />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/crear-cita"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <CrearCita />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Citas />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/enfermeria"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Enfermeria />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/registros-enfermeria"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <RegistrosEnfermeria />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/consultas"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <h2>Consultas</h2>
                  <p>Módulo en desarrollo.</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/especialistas"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Especialistas />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/expedientes"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <Expedientes />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Ruta desconocida */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </Router>

    </AuthProvider>
  );
};

export default App;