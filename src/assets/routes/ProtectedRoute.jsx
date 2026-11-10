import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextValue";

const normalizarRol = (rol) =>
  (rol || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const ProtectedRoute = ({ children, roles }) => {
  const { usuario, perfil, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (
    roles?.length &&
    !roles.map(normalizarRol).includes(normalizarRol(perfil?.roles?.nombre))
  ) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default ProtectedRoute;