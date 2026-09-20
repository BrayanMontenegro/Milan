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
                  <h2>Pacientes</h2>
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
                  <h2>Usuarios</h2>
                  <Usuarios />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <h2>Citas</h2>
                  <p>Módulo en desarrollo.</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/enfermeria"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <h2>Enfermería</h2>
                  <p>Módulo en desarrollo.</p>
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
                  <h2>Especialistas</h2>
                  <p>Módulo en desarrollo.</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/expedientes"
            element={
              <ProtectedRoute>
                <div className="p-4">
                  <h2>Expedientes</h2>
                  <p>Módulo en desarrollo.</p>
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