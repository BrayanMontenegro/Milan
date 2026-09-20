import { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Dropdown,
} from "react-bootstrap";

import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiFileText,
  FiUserCheck,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/Encabezado.css";

const Encabezado = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mostrarMenu, setMostrarMenu] =
    useState(false);

  const {
    usuario,
    perfil,
    cerrarSesion,
  } = useAuth();

  const rolUsuario =
    perfil?.roles?.nombre;

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    navigate("/");
  };

  // ==========================================
  // CERRAR MENÚ MÓVIL
  // ==========================================

  const cerrarMenu = () => {
    setMostrarMenu(false);
  };

  // ==========================================
  // VERIFICAR ROL
  // ==========================================

  const esAdministrador =
    rolUsuario === "ADMINISTRADOR";

  const esRecepcion =
    rolUsuario === "RECEPCION";

  const esEnfermeria =
    rolUsuario === "ENFERMERIA";

  const esEspecialista =
    rolUsuario === "ESPECIALISTA";

  // ==========================================
  // NOMBRE DEL USUARIO
  // ==========================================

  const nombreUsuario =
    perfil?.nombres ||
    usuario?.user_metadata?.nombres ||
    "Usuario";

  const apellidosUsuario =
    perfil?.apellidos ||
    usuario?.user_metadata?.apellidos ||
    "";

  const nombreCompleto =
    `${nombreUsuario} ${apellidosUsuario}`.trim();

  // ==========================================
  // INICIALES
  // ==========================================

  const iniciales =
    `${nombreUsuario.charAt(0)}${apellidosUsuario.charAt(0)}`
      .toUpperCase();

  // ==========================================
  // MENÚ
  // ==========================================

  const menuPrincipal = [
    {
      nombre: "Inicio",
      ruta: "/inicio",
      icono: <FiHome />,
      mostrar: true,
    },

    {
      nombre: "Pacientes",
      ruta: "/pacientes",
      icono: <FiUsers />,
      mostrar:
        esAdministrador ||
        esRecepcion ||
        esEnfermeria ||
        esEspecialista,
    },

    {
      nombre: "Citas",
      ruta: "/citas",
      icono: <FiCalendar />,
      mostrar:
        esAdministrador ||
        esRecepcion ||
        esEspecialista,
    },

    {
      nombre: "Enfermería",
      ruta: "/enfermeria",
      icono: <FiHeart />,
      mostrar:
        esAdministrador ||
        esEnfermeria,
    },

    {
      nombre: "Consultas",
      ruta: "/consultas",
      icono: <FiClipboard />,
      mostrar:
        esAdministrador ||
        esEspecialista,
    },

    {
      nombre: "Especialistas",
      ruta: "/especialistas",
      icono: <FiUserCheck />,
      mostrar:
        esAdministrador ||
        esRecepcion,
    },

    {
      nombre: "Expedientes",
      ruta: "/expedientes",
      icono: <FiFileText />,
      mostrar:
        esAdministrador ||
        esEspecialista,
    },
  ];

  // ==========================================
  // MENÚ CONFIGURACIÓN
  // ==========================================

  const mostrarConfiguracion =
    esAdministrador;

  // ==========================================
  // OCULTAR ENCABEZADO EN LOGIN
  // ==========================================

  if (location.pathname === "/") {
    return null;
  }

  return (
    <Navbar
      expand="lg"
      className="encabezado"
      sticky="top"
    >
      <Container fluid className="px-3 px-lg-4">

        {/* ======================================
            LOGO
        ====================================== */}

        <Navbar.Brand
          as={Link}
          to="/inicio"
          className="encabezado-logo"
        >
          <div className="logo-icon">
            M
          </div>

          <div className="logo-text">
            <strong>
              Clínica Milán
            </strong>

            <span>
              Sistema de Gestión
            </span>
          </div>
        </Navbar.Brand>

        {/* ======================================
            BOTÓN MÓVIL
        ====================================== */}

        <Navbar.Toggle
          aria-controls="menu-clinica"
          onClick={() =>
            setMostrarMenu(true)
          }
          className="encabezado-toggle"
        >
          <FiMenu />
        </Navbar.Toggle>

        {/* ======================================
            MENÚ DESKTOP
        ====================================== */}

        <Navbar.Collapse
          id="menu-clinica"
          className="justify-content-center"
        >
          <Nav className="encabezado-menu">

            {menuPrincipal
              .filter(
                (item) => item.mostrar
              )
              .map((item) => (
                <Nav.Link
                  key={item.ruta}
                  as={Link}
                  to={item.ruta}
                  className={
                    location.pathname ===
                    item.ruta
                      ? "menu-item active"
                      : "menu-item"
                  }
                >
                  <span className="menu-icon">
                    {item.icono}
                  </span>

                  <span>
                    {item.nombre}
                  </span>
                </Nav.Link>
              ))}

            {/* CONFIGURACIÓN */}

            {mostrarConfiguracion && (
              <Dropdown className="menu-dropdown">

                <Dropdown.Toggle
                  variant="link"
                  className="menu-item dropdown-toggle-custom"
                >
                  <span className="menu-icon">
                    <FiSettings />
                  </span>

                  <span>
                    Configuración
                  </span>

                  <FiChevronDown
                    className="dropdown-arrow"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu
                  align="end"
                  className="config-dropdown"
                >

                  <Dropdown.Item
                    as={Link}
                    to="/usuarios"
                  >
                    <FiUsers />
                    Usuarios
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={Link}
                    to="/especialidades"
                  >
                    <FiClipboard />
                    Especialidades
                  </Dropdown.Item>

                </Dropdown.Menu>

              </Dropdown>
            )}

          </Nav>
        </Navbar.Collapse>

        {/* ======================================
            USUARIO
        ====================================== */}

        <Dropdown className="usuario-dropdown">

          <Dropdown.Toggle
            variant="link"
            className="usuario-toggle"
          >

            <div className="usuario-avatar">
              {iniciales}
            </div>

            <div className="usuario-info">
              <strong>
                {nombreCompleto}
              </strong>

              <span>
                {rolUsuario ===
                "ESPECIALISTA"
                  ? "Especialista"
                  : rolUsuario ===
                    "RECEPCION"
                  ? "Recepcionista"
                  : rolUsuario ===
                    "ENFERMERIA"
                  ? "Enfermería"
                  : rolUsuario ===
                    "ADMINISTRADOR"
                  ? "Administrador"
                  : "Usuario"}
              </span>
            </div>

            <FiChevronDown />

          </Dropdown.Toggle>

          <Dropdown.Menu
            align="end"
            className="usuario-menu"
          >

            <div className="usuario-menu-header">

              <div className="usuario-avatar large">
                {iniciales}
              </div>

              <div>
                <strong>
                  {nombreCompleto}
                </strong>

                <small>
                  {usuario?.email ||
                    "Sin correo"}
                </small>
              </div>

            </div>

            <Dropdown.Divider />

            <Dropdown.Item
              as={Link}
              to="/perfil"
            >
              <FiUserCheck />
              Mi perfil
            </Dropdown.Item>

            <Dropdown.Item
              as={Link}
              to="/inicio"
            >
              <FiHome />
              Inicio
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              className="logout-item"
              onClick={
                manejarCerrarSesion
              }
            >
              <FiLogOut />
              Cerrar sesión
            </Dropdown.Item>

          </Dropdown.Menu>

        </Dropdown>

        {/* ======================================
            MENÚ MÓVIL
        ====================================== */}

        <Offcanvas
          show={mostrarMenu}
          onHide={cerrarMenu}
          placement="start"
          className="encabezado-mobile"
        >

          <Offcanvas.Header
            closeButton
          >
            <Offcanvas.Title>

              <div className="mobile-brand">

                <div className="logo-icon">
                  M
                </div>

                <div>
                  <strong>
                    Clínica Milán
                  </strong>

                  <span>
                    Sistema de Gestión
                  </span>
                </div>

              </div>

            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>

            <div className="mobile-user">

              <div className="usuario-avatar large">
                {iniciales}
              </div>

              <div>
                <strong>
                  {nombreCompleto}
                </strong>

                <span>
                  {rolUsuario}
                </span>
              </div>

            </div>

            <Nav className="mobile-menu">

              {menuPrincipal
                .filter(
                  (item) => item.mostrar
                )
                .map((item) => (
                  <Nav.Link
                    key={item.ruta}
                    as={Link}
                    to={item.ruta}
                    onClick={cerrarMenu}
                    className={
                      location.pathname ===
                      item.ruta
                        ? "mobile-menu-item active"
                        : "mobile-menu-item"
                    }
                  >
                    {item.icono}

                    <span>
                      {item.nombre}
                    </span>
                  </Nav.Link>
                ))}

              {mostrarConfiguracion && (
                <>
                  <div className="mobile-section-title">
                    CONFIGURACIÓN
                  </div>

                  <Nav.Link
                    as={Link}
                    to="/usuarios"
                    onClick={cerrarMenu}
                    className={
                      location.pathname ===
                      "/usuarios"
                        ? "mobile-menu-item active"
                        : "mobile-menu-item"
                    }
                  >
                    <FiUsers />

                    <span>
                      Usuarios
                    </span>
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/especialidades"
                    onClick={cerrarMenu}
                    className={
                      location.pathname ===
                      "/especialidades"
                        ? "mobile-menu-item active"
                        : "mobile-menu-item"
                    }
                  >
                    <FiClipboard />

                    <span>
                      Especialidades
                    </span>
                  </Nav.Link>
                </>
              )}

            </Nav>

            <button
              className="mobile-logout"
              onClick={() => {
                cerrarMenu();
                manejarCerrarSesion();
              }}
            >
              <FiLogOut />

              Cerrar sesión
            </button>

          </Offcanvas.Body>

        </Offcanvas>

      </Container>
    </Navbar>
  );
};

export default Encabezado;