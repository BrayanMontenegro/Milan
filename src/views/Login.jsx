
import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabase";
import logoMilan from "../assets/logo-milan.svg";
import "./../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [correoError, setCorreoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (cargando) return;

    setCorreoError("");
    setPasswordError("");
    setErrorGeneral("");

    const emailLimpio = correo.trim();
    let valido = true;

    if (!emailLimpio) {
      setCorreoError("El correo electrónico es obligatorio.");
      valido = false;
    } else if (!validarEmail(emailLimpio)) {
      setCorreoError("Ingrese un correo electrónico válido.");
      valido = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
      valido = false;
    }

    if (!valido) return;

    setCargando(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpio,
        password,
      });

      if (error) {
        setErrorGeneral("Correo o contraseña incorrectos.");
        return;
      }

      navigate("/inicio", { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorGeneral(
        "No fue posible iniciar sesión. Verifique su conexión e inténtelo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-container">
      <section className="login-card" aria-label="Acceso al sistema">

        {/* Encabezado e identidad de la clínica */}
        <header className="login-logo">
          <img
            className="login-logo-image"
            src={logoMilan}
            alt="Logo de Clínica Milán"
          />

          <h1>Clínica Milán</h1>

          <p>Sistema de Gestión Clínica</p>

          <div className="login-accent">
            <span />
            <span />
            <span />
          </div>
        </header>

        {/* Formulario */}
        <div className="login-content">
          <div className="login-heading">
            <span className="login-eyebrow">BIENVENIDO</span>
            <h2>Iniciar sesión</h2>
            <p>Ingrese sus credenciales para continuar</p>
          </div>

          {errorGeneral && (
            <Alert
              variant="danger"
              className="login-alert"
              role="alert"
            >
              <i
                className="bi bi-exclamation-circle-fill"
                aria-hidden="true"
              />
              <span>{errorGeneral}</span>
            </Alert>
          )}

          <Form onSubmit={iniciarSesion} noValidate>

            {/* Correo electrónico */}
            <Form.Group className="login-field">
              <Form.Label htmlFor="login-correo">
                Correo electrónico
              </Form.Label>

              <div className={`login-input-wrapper ${correoError ? "has-error" : ""}`}>
                <i
                  className="bi bi-envelope input-leading-icon"
                  aria-hidden="true"
                />

                <Form.Control
                  id="login-correo"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setCorreoError("");
                    setErrorGeneral("");
                  }}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  isInvalid={Boolean(correoError)}
                  disabled={cargando}
                  aria-describedby={correoError ? "correo-error" : undefined}
                  aria-invalid={Boolean(correoError)}
                />
              </div>

              {correoError && (
                <div className="login-field-error" id="correo-error">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" />
                  {correoError}
                </div>
              )}
            </Form.Group>

            {/* Contraseña */}
            <Form.Group className="login-field">
              <Form.Label htmlFor="login-password">
                Contraseña
              </Form.Label>

              <div className={`login-input-wrapper ${passwordError ? "has-error" : ""}`}>
                <i
                  className="bi bi-lock input-leading-icon"
                  aria-hidden="true"
                />

                <Form.Control
                  id="login-password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                    setErrorGeneral("");
                  }}
                  autoComplete="current-password"
                  isInvalid={Boolean(passwordError)}
                  disabled={cargando}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  aria-invalid={Boolean(passwordError)}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() => setMostrarPassword((actual) => !actual)}
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  aria-pressed={mostrarPassword}
                  disabled={cargando}
                >
                  <i
                    className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {passwordError && (
                <div className="login-field-error" id="password-error">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" />
                  {passwordError}
                </div>
              )}
            </Form.Group>

            {/* Botón de acceso */}
            <Button
              type="submit"
              className="login-button w-100"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                    aria-hidden="true"
                  />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <i
                    className="bi bi-box-arrow-in-right"
                    aria-hidden="true"
                  />
                  <span>Iniciar sesión</span>
                </>
              )}
            </Button>

          </Form>

          <div className="login-security">
            <i className="bi bi-shield-lock" aria-hidden="true" />
            <span>Acceso exclusivo para personal autorizado</span>
          </div>
        </div>

        {/* Pie de página */}
        <footer className="login-footer">
          <strong>Clínica de Especialidades Milán</strong>
          <span>Sistema interno de gestión</span>
        </footer>

      </section>
    </main>
  );
};

export default Login;
