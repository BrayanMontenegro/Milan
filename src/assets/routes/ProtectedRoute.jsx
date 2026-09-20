import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();

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

  return children;
};

export default ProtectedRoute;