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
  FiDollarSign,
  FiBarChart2,
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
import { useAuth } from "../context/AuthContextValue";
import logoMilan from "../assets/logo-milan.svg";
import "../styles/Encabezado.css";

const normalizarRol = (rol) =>
  (rol || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const crearMenuPrincipal = (rolOriginal) => {
  const rol = normalizarRol(rolOriginal);
  const admin = rol === "ADMINISTRADOR";
  const recepcion = rol === "RECEPCION";
  const enfermeria = rol === "ENFERMERIA";
  const especialista = rol === "ESPECIALISTA";

  return [
    { nombre: "Inicio", ruta: "/inicio", icono: <FiHome />, mostrar: true },
    {
      nombre: "Pacientes",
      ruta: "/pacientes",
      icono: <FiUsers />,
      mostrar: admin || recepcion || enfermeria || especialista,
    },
    {
      nombre: "Citas",
      ruta: "/citas",
      icono: <FiCalendar />,
      mostrar: admin || recepcion || especialista,
    },
    {
      nombre: "Enfermería",
      ruta: "/enfermeria",
      icono: <FiHeart />,
      mostrar: admin || enfermeria,
    },
    {
      nombre: "Registros enfermería",
      ruta: "/registros-enfermeria",
      icono: <FiHeart />,
      mostrar: admin || enfermeria,
    },
    {
      nombre: "Citas doctor",
      ruta: "/citas-doctor",
      icono: <FiClipboard />,
      mostrar: especialista || enfermeria,
    },
    {
      nombre: "Consultas",
      ruta: "/consultas",
      icono: <FiClipboard />,
      mostrar: especialista || enfermeria,
    },
    {
      nombre: "Horario",
      ruta: "/especialista-horario",
      icono: <FiCalendar />,
      mostrar: especialista,
    },
    {
      nombre: "Mis procedimientos",
      ruta: "/mis-procedimientos",
      icono: <FiClipboard />,
      mostrar: especialista,
    },
    {
      nombre: "Caja",
      ruta: "/caja",
      icono: <FiDollarSign />,
      mostrar: admin || recepcion,
    },
    {
      nombre: "Reportes financieros",
      ruta: "/reportes-financieros",
      icono: <FiBarChart2 />,
      mostrar: admin,
    },
    {
      nombre: "Especialistas",
      ruta: "/especialistas",
      icono: <FiUserCheck />,
      mostrar: admin || recepcion,
    },
    {
      nombre: "Expedientes",
      ruta: "/expedientes",
      icono: <FiFileText />,
      mostrar: admin || especialista,
    },
  ];
};

const obtenerEtiquetaRol = (rol) => {
  const etiquetas = {
    ESPECIALISTA: "Especialista",
    RECEPCION: "Recepcionista",
    ENFERMERIA: "Enfermería",
    ADMINISTRADOR: "Administrador",
  };

  return etiquetas[rol] || "Usuario";
};

const LogoClinica = ({ textoClassName }) => (
  <>
    <img
      className="encabezado-logo-image"
      src={logoMilan}
      alt="Logo de Clínica Milán"
    />
    <div className={textoClassName}>
      <strong>Clínica Milán</strong>
      <span>Sistema de Gestión</span>
    </div>
  </>
);

const NavegacionDesktop = ({ menuPrincipal, rutaActual, mostrarConfiguracion }) => (
  <Navbar.Collapse
    id="menu-clinica"
    className="justify-content-center"
  >
    <Nav className="encabezado-menu">
      {menuPrincipal
        .filter((item) => item.mostrar)
        .map((item) => (
          <Nav.Link
            key={item.ruta}
            as={Link}
            to={item.ruta}
            className={
              rutaActual === item.ruta ? "menu-item active" : "menu-item"
            }
          >
            <span className="menu-icon">{item.icono}</span>
            <span>{item.nombre}</span>
          </Nav.Link>
        ))}
      {mostrarConfiguracion && (
        <Dropdown className="menu-dropdown">
          <Dropdown.Toggle
            variant="link"
            className="menu-item dropdown-toggle-custom"
          >
            <span className="menu-icon">
              <FiSettings />
            </span>
            <span>Configuración</span>
            <FiChevronDown className="dropdown-arrow" />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" className="config-dropdown">
            <Dropdown.Item as={Link} to="/usuarios">
              <FiUsers />
              Usuarios
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/especialidades">
              <FiClipboard />
              Especialidades
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Nav>
  </Navbar.Collapse>
);

const MenuUsuario = ({
  iniciales,
  nombreCompleto,
  rolUsuario,
  correo,
  manejarCerrarSesion,
}) => (
  <Dropdown className="usuario-dropdown">
    <Dropdown.Toggle variant="link" className="usuario-toggle">
      <div className="usuario-avatar">{iniciales}</div>
      <div className="usuario-info">
        <strong>{nombreCompleto}</strong>
        <span>{obtenerEtiquetaRol(rolUsuario)}</span>
      </div>
      <FiChevronDown />
    </Dropdown.Toggle>
    <Dropdown.Menu align="end" className="usuario-menu">
      <div className="usuario-menu-header">
        <div className="usuario-avatar large">{iniciales}</div>
        <div>
          <strong>{nombreCompleto}</strong>
          <small>{correo || "Sin correo"}</small>
        </div>
      </div>
      <Dropdown.Divider />
      <Dropdown.Item as={Link} to="/perfil">
        <FiUserCheck />
        Mi perfil
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/inicio">
        <FiHome />
        Inicio
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item className="logout-item" onClick={manejarCerrarSesion}>
        <FiLogOut />
        Cerrar sesión
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const MenuMovil = ({
  mostrarMenu,
  cerrarMenu,
  menuPrincipal,
  rutaActual,
  mostrarConfiguracion,
  iniciales,
  nombreCompleto,
  rolUsuario,
  manejarCerrarSesion,
}) => (
  <Offcanvas
    show={mostrarMenu}
    onHide={cerrarMenu}
    placement="start"
    className="encabezado-mobile"
  >
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>
        <div className="mobile-brand">
          <LogoClinica />
        </div>
      </Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <div className="mobile-user">
        <div className="usuario-avatar large">{iniciales}</div>
        <div>
          <strong>{nombreCompleto}</strong>
          <span>{rolUsuario}</span>
        </div>
      </div>
      <Nav className="mobile-menu">
        {menuPrincipal
          .filter((item) => item.mostrar)
          .map((item) => (
            <Nav.Link
              key={item.ruta}
              as={Link}
              to={item.ruta}
              onClick={cerrarMenu}
              className={
                rutaActual === item.ruta
                  ? "mobile-menu-item active"
                  : "mobile-menu-item"
              }
            >
              {item.icono}
              <span>{item.nombre}</span>
            </Nav.Link>
          ))}
        {mostrarConfiguracion && (
          <>
            <div className="mobile-section-title">CONFIGURACIÓN</div>
            <Nav.Link
              as={Link}
              to="/usuarios"
              onClick={cerrarMenu}
              className={
                rutaActual === "/usuarios"
                  ? "mobile-menu-item active"
                  : "mobile-menu-item"
              }
            >
              <FiUsers />
              <span>Usuarios</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/especialidades"
              onClick={cerrarMenu}
              className={
                rutaActual === "/especialidades"
                  ? "mobile-menu-item active"
                  : "mobile-menu-item"
              }
            >
              <FiClipboard />
              <span>Especialidades</span>
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
);

const Encabezado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const { usuario, perfil, cerrarSesion } = useAuth();
  const rolUsuario = normalizarRol(perfil?.roles?.nombre);
  const nombreUsuario =
    perfil?.nombres || usuario?.user_metadata?.nombres || "Usuario";
  const apellidosUsuario =
    perfil?.apellidos || usuario?.user_metadata?.apellidos || "";
  const nombreCompleto = `${nombreUsuario} ${apellidosUsuario}`.trim();
  const iniciales =
    `${nombreUsuario.charAt(0)}${apellidosUsuario.charAt(0)}`.toUpperCase();
  const menuPrincipal = crearMenuPrincipal(rolUsuario);
  const mostrarConfiguracion = rolUsuario === "ADMINISTRADOR";

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    navigate("/");
  };

  const cerrarMenu = () => setMostrarMenu(false);

  if (location.pathname === "/") return null;

  return (
    <Navbar
      expand="lg"
      className="encabezado"
      sticky="top"
      expanded={false}
    >
      <Container fluid className="px-3 px-lg-4">
        <Navbar.Brand
          as={Link}
          to="/inicio"
          className="encabezado-logo"
        >
          <LogoClinica textoClassName="logo-text" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="menu-clinica"
          onClick={() => setMostrarMenu(true)}
          className="encabezado-toggle"
        >
          <FiMenu />
        </Navbar.Toggle>
        <NavegacionDesktop
          menuPrincipal={menuPrincipal}
          rutaActual={location.pathname}
          mostrarConfiguracion={mostrarConfiguracion}
        />
        <MenuUsuario
          iniciales={iniciales}
          nombreCompleto={nombreCompleto}
          rolUsuario={rolUsuario}
          correo={usuario?.email}
          manejarCerrarSesion={manejarCerrarSesion}
        />
        <MenuMovil
          mostrarMenu={mostrarMenu}
          cerrarMenu={cerrarMenu}
          menuPrincipal={menuPrincipal}
          rutaActual={location.pathname}
          mostrarConfiguracion={mostrarConfiguracion}
          iniciales={iniciales}
          nombreCompleto={nombreCompleto}
          rolUsuario={rolUsuario}
          manejarCerrarSesion={manejarCerrarSesion}
        />
      </Container>
    </Navbar>
  );
};

export default Encabezado;
