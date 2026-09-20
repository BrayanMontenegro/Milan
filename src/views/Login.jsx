import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabase";
import "./../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setError("");

    if (!correo || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    navigate("/inicio");
    setCargando(false);
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-logo">
          <div className="logo-icon">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>

          <h2>Clínica Milán</h2>

          <p>
            Sistema de Gestión Clínica
          </p>
        </div>

        <div className="login-content">

          <h4>Iniciar sesión</h4>

          <p className="text-muted">
            Ingrese sus credenciales para continuar
          </p>

          {error && (
            <Alert variant="danger">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          <Form onSubmit={iniciarSesion}>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>

              <div className="input-icon">
                <i className="bi bi-envelope"></i>

                <Form.Control
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>

              <div className="password-container">

                <i className="bi bi-lock"></i>

                <Form.Control
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                >
                  <i
                    className={
                      mostrarPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>
                </button>

              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 login-button"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                    className="me-2"
                  />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar sesión
                </>
              )}
            </Button>

          </Form>

        </div>

        <div className="login-footer">
          <small>
            Clínica de Especialidades Milán
          </small>
          <br />
          <small>
            Sistema interno de gestión
          </small>
        </div>

      </div>

    </div>
  );
};

export default Login;