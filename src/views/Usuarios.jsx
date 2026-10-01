import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  FiEdit,
  FiEye,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiX,
} from "react-icons/fi";

import { supabase } from "../database/supabase";
import { useAuth } from "../context/AuthContext";

import "../styles/Usuarios.css";

const Usuarios = () => {
  const { usuario, perfil } = useAuth();

  // ==========================================
  // ESTADOS
  // ==========================================

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // Modal crear
  const [mostrarModal, setMostrarModal] = useState(false);

  // Modal editar
  const [mostrarModalEditar, setMostrarModalEditar] =
    useState(false);

  // Modal detalles
  const [mostrarModalDetalles, setMostrarModalDetalles] =
    useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState(null);

  // ==========================================
  // FORMULARIO
  // ==========================================

  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    id_rol: "",
  });

  const [formularioEditar, setFormularioEditar] =
    useState({
      nombres: "",
      apellidos: "",
      id_rol: "",
    });

  // ==========================================
  // VERIFICAR ADMINISTRADOR
  // ==========================================

  const esAdministrador =
    perfil?.roles?.nombre === "ADMINISTRADOR";

  // ==========================================
  // CARGAR DATOS
  // ==========================================

  useEffect(() => {
    if (esAdministrador) {
      cargarDatos();
    } else {
      setCargando(false);
    }
  }, [esAdministrador]);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");

    await Promise.all([
      cargarUsuarios(),
      cargarRoles(),
    ]);

    setCargando(false);
  };

  // ==========================================
  // CARGAR USUARIOS
  // ==========================================

  const cargarUsuarios = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select(`
        id_usuario,
        id_rol,
        nombres,
        apellidos,
        telefono,
        activo,
        created_at,
        updated_at,
        roles (
          id_rol,
          nombre,
          descripcion
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error cargando usuarios:",
        error
      );

      setError(
        "No se pudieron cargar los usuarios."
      );

      return;
    }

    setUsuarios(data || []);
  };

  // ==========================================
  // CARGAR ROLES
  // ==========================================

  const cargarRoles = async () => {
    const { data, error } = await supabase
      .from("roles")
      .select(`
        id_rol,
        nombre,
        descripcion,
        activo
      `)
      .eq("activo", true)
      .neq("nombre", "ADMINISTRADOR")
      .order("nombre");

    if (error) {
      console.error(
        "Error cargando roles:",
        error
      );

      setError(
        "No se pudieron cargar los roles."
      );

      return;
    }

    setRoles(data || []);
  };

  // ==========================================
  // CAMBIAR FORMULARIO
  // ==========================================

  const cambiarFormulario = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  // ==========================================
  // ABRIR MODAL CREAR
  // ==========================================

  const abrirModalCrear = () => {
    setFormulario({
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      id_rol: "",
    });

    setError("");
    setMensaje("");

    setMostrarModal(true);
  };

  // ==========================================
  // CERRAR MODAL CREAR
  // ==========================================

  const cerrarModalCrear = () => {
    if (guardando) return;

    setMostrarModal(false);

    setFormulario({
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      id_rol: "",
    });
  };

  // ==========================================
  // CREAR USUARIO
  // ==========================================

  const crearUsuario = async (e) => {
    e?.preventDefault();

    setError("");
    setMensaje("");

    // ------------------------------------------
    // VALIDAR CAMPOS
    // ------------------------------------------

    if (
      !formulario.nombres?.trim() ||
      !formulario.apellidos?.trim() ||
      !formulario.email?.trim() ||
      !formulario.password ||
      !formulario.id_rol
    ) {
      setError(
        "Todos los campos son obligatorios."
      );

      return;
    }

    // ------------------------------------------
    // VALIDAR CONTRASEÑA
    // ------------------------------------------

    if (
      formulario.password.length < 6
    ) {
      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;
    }

    // ------------------------------------------
    // VALIDAR EMAIL
    // ------------------------------------------

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailValido.test(
        formulario.email.trim()
      )
    ) {
      setError(
        "Ingrese un correo electrónico válido."
      );

      return;
    }

    // ------------------------------------------
    // VALIDAR ROL
    // ------------------------------------------

    const rolSeleccionado =
      roles.find(
        (rol) =>
          rol.id_rol === formulario.id_rol
      );

    if (!rolSeleccionado) {
      setError(
        "Debe seleccionar un rol válido."
      );

      return;
    }

    try {
      setGuardando(true);

      console.log(
        "Datos enviados a Edge Function:",
        {
          nombres:
            formulario.nombres.trim(),

          apellidos:
            formulario.apellidos.trim(),

          email:
            formulario.email.trim(),

          id_rol:
            formulario.id_rol,
        }
      );

      // ------------------------------------------
      // LLAMAR EDGE FUNCTION
      // ------------------------------------------

      const {
        data,
        error: functionError,
      } =
        await supabase.functions.invoke(
          "crear-usuario",
          {
            body: {
              nombres:
                formulario.nombres.trim(),

              apellidos:
                formulario.apellidos.trim(),

              email:
                formulario.email.trim(),

              password:
                formulario.password,

              // IMPORTANTE:
              // id_rol es UUID
              id_rol:
                formulario.id_rol,
            },
          }
        );

      // ------------------------------------------
      // ERROR DE EDGE FUNCTION
      // ------------------------------------------

      if (functionError) {
        console.error(
          "Error Edge Function:",
          functionError
        );

        let mensajeError =
          "No se pudo crear el usuario.";

        try {
          if (
            functionError.context
          ) {
            const respuesta =
              await functionError.context.json();

            console.error(
              "Respuesta Edge Function:",
              respuesta
            );

            if (respuesta?.error) {
              mensajeError =
                respuesta.error;
            }
          }
        } catch (lecturaError) {
          console.error(
            "No se pudo leer la respuesta:",
            lecturaError
          );
        }

        setError(mensajeError);

        return;
      }

      // ------------------------------------------
      // RESPUESTA EXITOSA
      // ------------------------------------------

      console.log(
        "Usuario creado:",
        data
      );

      setMensaje(
        data?.mensaje ||
          "Usuario creado correctamente."
      );

      // ------------------------------------------
      // LIMPIAR FORMULARIO
      // ------------------------------------------

      setFormulario({
        nombres: "",
        apellidos: "",
        email: "",
        password: "",
        id_rol: "",
      });

      // ------------------------------------------
      // CERRAR MODAL
      // ------------------------------------------

      setMostrarModal(false);

      // ------------------------------------------
      // RECARGAR USUARIOS
      // ------------------------------------------

      await cargarUsuarios();

    } catch (error) {
      console.error(
        "Error inesperado creando usuario:",
        error
      );

      setError(
        "Ocurrió un error inesperado al crear el usuario."
      );

    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // ABRIR EDITAR
  // ==========================================

  const abrirEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);

    setFormularioEditar({
      nombres:
        usuario.nombres || "",

      apellidos:
        usuario.apellidos || "",

      id_rol:
        usuario.id_rol || "",
    });

    setError("");
    setMensaje("");

    setMostrarModalEditar(true);
  };

  // ==========================================
  // EDITAR USUARIO
  // ==========================================

  const editarUsuario = async (e) => {
    e?.preventDefault();

    setError("");
    setMensaje("");

    if (
      !formularioEditar.nombres?.trim() ||
      !formularioEditar.apellidos?.trim() ||
      !formularioEditar.id_rol
    ) {
      setError(
        "Nombres, apellidos y rol son obligatorios."
      );

      return;
    }

    try {
      setGuardando(true);

      const { error } = await supabase
        .from("usuarios")
        .update({
          nombres:
            formularioEditar.nombres.trim(),

          apellidos:
            formularioEditar.apellidos.trim(),

          id_rol:
            formularioEditar.id_rol,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id_usuario",
          usuarioSeleccionado.id_usuario
        );

      if (error) {
        console.error(
          "Error actualizando usuario:",
          error
        );

        setError(
          "No se pudo actualizar el usuario."
        );

        return;
      }

      setMensaje(
        "Usuario actualizado correctamente."
      );

      setMostrarModalEditar(false);

      await cargarUsuarios();

    } catch (error) {
      console.error(
        "Error inesperado:",
        error
      );

      setError(
        "Ocurrió un error al actualizar el usuario."
      );

    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // CAMBIAR ESTADO
  // ==========================================

  const cambiarEstado = async (
    usuarioActual
  ) => {
    const nuevoEstado =
      !usuarioActual.activo;

    const confirmar = window.confirm(
      nuevoEstado
        ? `¿Desea activar a ${usuarioActual.nombres} ${usuarioActual.apellidos}?`
        : `¿Desea desactivar a ${usuarioActual.nombres} ${usuarioActual.apellidos}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      const { error } =
        await supabase
          .from("usuarios")
          .update({
            activo:
              nuevoEstado,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id_usuario",
            usuarioActual.id_usuario
          );

      if (error) {
        console.error(
          "Error cambiando estado:",
          error
        );

        setError(
          "No se pudo cambiar el estado del usuario."
        );

        return;
      }

      setMensaje(
        nuevoEstado
          ? "Usuario activado correctamente."
          : "Usuario desactivado correctamente."
      );

      await cargarUsuarios();

    } catch (error) {
      console.error(
        "Error inesperado:",
        error
      );

      setError(
        "Ocurrió un error al cambiar el estado."
      );
    }
  };

  // ==========================================
  // VER DETALLES
  // ==========================================

  const verDetalles = (usuarioActual) => {
    setUsuarioSeleccionado(
      usuarioActual
    );

    setMostrarModalDetalles(true);
  };

  // ==========================================
  // OBTENER NOMBRE DEL ROL
  // ==========================================

  const obtenerNombreRol = (usuarioActual) => {
    if (!usuarioActual?.roles) {
      return "Sin rol";
    }

    if (
      Array.isArray(
        usuarioActual.roles
      )
    ) {
      return (
        usuarioActual.roles[0]
          ?.nombre || "Sin rol"
      );
    }

    return (
      usuarioActual.roles.nombre ||
      "Sin rol"
    );
  };

  // ==========================================
  // NOMBRE DEL ROL PARA MOSTRAR
  // ==========================================

  const nombreRolMostrar = (nombre) => {
    switch (nombre) {
      case "ADMINISTRADOR":
        return "Administrador";

      case "RECEPCION":
        return "Recepcionista";

      case "ENFERMERIA":
        return "Enfermera";

      case "ESPECIALISTA":
        return "Especialista";

      default:
        return nombre || "Sin rol";
    }
  };

  // ==========================================
  // FILTRAR USUARIOS
  // ==========================================

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(
      (usuarioActual) => {
        const nombreCompleto =
          `${usuarioActual.nombres || ""} ${
            usuarioActual.apellidos || ""
          }`.toLowerCase();

        const textoBusqueda =
          busqueda
            .trim()
            .toLowerCase();

        const coincideBusqueda =
          !textoBusqueda ||
          nombreCompleto.includes(
            textoBusqueda
          ) ||
          usuarioActual.id_usuario
            ?.toLowerCase()
            .includes(textoBusqueda);

        const nombreRol =
          obtenerNombreRol(
            usuarioActual
          );

        const coincideRol =
          !filtroRol ||
          usuarioActual.id_rol ===
            filtroRol ||
          nombreRol === filtroRol;

        const coincideEstado =
          !filtroEstado ||
          (filtroEstado ===
            "ACTIVO" &&
            usuarioActual.activo) ||
          (filtroEstado ===
            "INACTIVO" &&
            !usuarioActual.activo);

        return (
          coincideBusqueda &&
          coincideRol &&
          coincideEstado
        );
      }
    );
  }, [
    usuarios,
    busqueda,
    filtroRol,
    filtroEstado,
  ]);

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const totalUsuarios =
    usuarios.length;

  const usuariosActivos =
    usuarios.filter(
      (usuarioActual) =>
        usuarioActual.activo
    ).length;

  const usuariosInactivos =
    usuarios.filter(
      (usuarioActual) =>
        !usuarioActual.activo
    ).length;

  const especialistas =
    usuarios.filter(
      (usuarioActual) =>
        obtenerNombreRol(
          usuarioActual
        ) === "ESPECIALISTA"
    ).length;

  // ==========================================
  // CONTROL DE ACCESO
  // ==========================================

  if (!cargando && !esAdministrador) {
    return (
      <div className="usuarios-page">
        <div className="container-fluid">
          <Alert
            variant="danger"
            className="mt-4"
          >
            <strong>
              Acceso restringido
            </strong>
            <br />
            Solo los administradores pueden
            acceder a la gestión de usuarios.
          </Alert>
        </div>
      </div>
    );
  }

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div className="usuarios-page">
        <div className="usuarios-loading">
          <Spinner
            animation="border"
            variant="primary"
          />

          <p>
            Cargando usuarios...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="usuarios-page">
      <div className="container-fluid px-3 px-lg-4">

        {/* =====================================
            ENCABEZADO
        ====================================== */}

        <div className="usuarios-header">
          <div className="usuarios-header-content">
            <div className="usuarios-header-title">
              <div className="usuarios-header-icon">
                <FiShield />
              </div>

              <div>
                <h2>Usuarios</h2>
                <p>
                  Administración de usuarios y permisos del sistema
                </p>
              </div>
            </div>

            <div className="usuarios-header-actions">
              <Button
                variant="light"
                className="btn-refresh"
                onClick={cargarDatos}
                disabled={cargando}
              >
                <FiRefreshCw />
                Actualizar
              </Button>

              <Button
                className="btn-primary-custom"
                onClick={abrirModalCrear}
              >
                <FiPlus />
                Nuevo usuario
              </Button>
            </div>
          </div>
        </div>

        {/* =====================================
            ALERTAS
        ====================================== */}

        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {mensaje && (
          <Alert
            variant="success"
            dismissible
            onClose={() =>
              setMensaje("")
            }
          >
            {mensaje}
          </Alert>
        )}

        {/* =====================================
            ESTADÍSTICAS
        ====================================== */}

        <Row className="g-3 mb-4">

          <Col
            xs={12}
            sm={6}
            xl={3}
          >
            <Card className="usuario-stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FiUser />
                </div>

                <div className="usuario-stat-content">
                  <span>
                    Total usuarios:
                  </span>

                  <strong>
                    {totalUsuarios}
                  </strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col
            xs={12}
            sm={6}
            xl={3}
          >
            <Card className="usuario-stat-card">
              <Card.Body>
                <div className="stat-icon success">
                  <FiUserCheck />
                </div>

                <div className="usuario-stat-content">
                  <span>
                    Usuarios activos:
                  </span>

                  <strong>
                    {usuariosActivos}
                  </strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col
            xs={12}
            sm={6}
            xl={3}
          >
            <Card className="usuario-stat-card">
              <Card.Body>
                <div className="stat-icon danger">
                  <FiUserX />
                </div>

                <div className="usuario-stat-content">
                  <span>
                    Usuarios inactivos:
                  </span>

                  <strong>
                    {usuariosInactivos}
                  </strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col
            xs={12}
            sm={6}
            xl={3}
          >
            <Card className="usuario-stat-card">
              <Card.Body>
                <div className="stat-icon specialist">
                  <FiShield />
                </div>

                <div className="usuario-stat-content">
                  <span>
                    Especialistas: 
                  </span>

                  <strong>
                    {especialistas}
                  </strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* =====================================
            FILTROS
        ====================================== */}

        <Card className="usuarios-main-card">

          <Card.Body>

            <div className="usuarios-filtros">

              <InputGroup className="usuarios-search">
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={busqueda}
                  onChange={(e) =>
                    setBusqueda(
                      e.target.value
                    )
                  }
                />

                {busqueda && (
                  <Button
                    variant="light"
                    onClick={() =>
                      setBusqueda("")
                    }
                  >
                    <FiX />
                  </Button>
                )}
              </InputGroup>

              <Form.Select
                value={filtroRol}
                onChange={(e) =>
                  setFiltroRol(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Todos los roles
                </option>

                {roles.map((rol) => (
                  <option
                    key={rol.id_rol}
                    value={rol.id_rol}
                  >
                    {nombreRolMostrar(
                      rol.nombre
                    )}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                value={filtroEstado}
                onChange={(e) =>
                  setFiltroEstado(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Todos los estados
                </option>

                <option value="ACTIVO">
                  Activos
                </option>

                <option value="INACTIVO">
                  Inactivos
                </option>
              </Form.Select>

            </div>

            {/* =================================
                TABLA
            ================================== */}

            <div className="table-responsive usuarios-table-wrapper">

              <Table
                hover
                className="usuarios-table"
              >
                <thead>
                  <tr>
                    <th>
                      Usuario
                    </th>

                    <th>
                      Rol
                    </th>

                    <th>
                      Estado
                    </th>

                    <th>
                      Fecha de registro
                    </th>

                    <th className="text-end">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {usuariosFiltrados.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="usuarios-empty"
                      >
                        <FiUser />

                        <strong>
                          No se encontraron usuarios
                        </strong>

                        <span>
                          Intenta modificar los
                          filtros de búsqueda.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map(
                      (usuarioActual) => {
                        const nombreRol =
                          obtenerNombreRol(
                            usuarioActual
                          );

                        const iniciales =
                          `${
                            usuarioActual.nombres?.charAt(
                              0
                            ) || ""
                          }${
                            usuarioActual.apellidos?.charAt(
                              0
                            ) || ""
                          }`.toUpperCase();

                        return (
                          <tr
                            key={
                              usuarioActual.id_usuario
                            }
                          >

                            <td>
                              <div className="usuario-cell">

                                <div className="usuario-table-avatar">
                                  {iniciales}
                                </div>

                                <div>
                                  <strong>
                                    {
                                      usuarioActual.nombres
                                    }{" "}
                                    {
                                      usuarioActual.apellidos
                                    }
                                  </strong>

                                  <small>
                                    Usuario del sistema
                                  </small>
                                </div>

                              </div>
                            </td>

                            <td>
                              <span className="rol-badge">
                                {nombreRolMostrar(
                                  nombreRol
                                )}
                              </span>
                            </td>

                            <td>
                              {usuarioActual.activo ? (
                                <Badge
                                  bg="success"
                                  className="estado-badge"
                                >
                                  Activo
                                </Badge>
                              ) : (
                                <Badge
                                  bg="secondary"
                                  className="estado-badge"
                                >
                                  Inactivo
                                </Badge>
                              )}
                            </td>

                            <td>
                              {usuarioActual.created_at
                                ? new Date(
                                    usuarioActual.created_at
                                  ).toLocaleDateString(
                                    "es-NI",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}
                            </td>

                            <td>
                              <div className="usuarios-actions">

                                <Button
                                  variant="light"
                                  className="action-btn"
                                  title="Ver detalles"
                                  onClick={() =>
                                    verDetalles(
                                      usuarioActual
                                    )
                                  }
                                >
                                  <FiEye />
                                </Button>

                                <Button
                                  variant="light"
                                  className="action-btn"
                                  title="Editar"
                                  onClick={() =>
                                    abrirEditar(
                                      usuarioActual
                                    )
                                  }
                                >
                                  <FiEdit />
                                </Button>

                                <Button
                                  variant="light"
                                  className={
                                    usuarioActual.activo
                                      ? "action-btn danger"
                                      : "action-btn success"
                                  }
                                  title={
                                    usuarioActual.activo
                                      ? "Desactivar"
                                      : "Activar"
                                  }
                                  onClick={() =>
                                    cambiarEstado(
                                      usuarioActual
                                    )
                                  }
                                >
                                  {usuarioActual.activo ? (
                                    <FiUserX />
                                  ) : (
                                    <FiUserCheck />
                                  )}
                                </Button>

                              </div>
                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>
              </Table>

            </div>

            <div className="usuarios-footer">
              Mostrando{" "}
              <strong>
                {usuariosFiltrados.length}
              </strong>{" "}
              de{" "}
              <strong>
                {usuarios.length}
              </strong>{" "}
              usuarios
            </div>

          </Card.Body>
        </Card>

      </div>

      {/* =======================================
          MODAL CREAR USUARIO
      ======================================== */}

      <Modal
        show={mostrarModal}
        onHide={cerrarModalCrear}
        centered
        size="lg"
      >
        <Form onSubmit={crearUsuario}>

          <Modal.Header closeButton>
            <Modal.Title>
              <FiUser />
              Nuevo usuario
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            {error && (
              <Alert
                variant="danger"
                className="mb-3"
              >
                {error}
              </Alert>
            )}

            <Row className="g-3">

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Nombres
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Ingrese los nombres"
                    value={
                      formulario.nombres
                    }
                    onChange={(e) =>
                      cambiarFormulario(
                        "nombres",
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Apellidos
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Ingrese los apellidos"
                    value={
                      formulario.apellidos
                    }
                    onChange={(e) =>
                      cambiarFormulario(
                        "apellidos",
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    Correo electrónico
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="usuario@clinicamilan.com"
                    value={
                      formulario.email
                    }
                    onChange={(e) =>
                      cambiarFormulario(
                        "email",
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Contraseña
                  </Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={
                      formulario.password
                    }
                    onChange={(e) =>
                      cambiarFormulario(
                        "password",
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Rol
                  </Form.Label>

                  <Form.Select
                    value={
                      formulario.id_rol
                    }
                    onChange={(e) =>
                      cambiarFormulario(
                        "id_rol",
                        e.target.value
                      )
                    }
                    disabled={guardando}
                  >
                    <option value="">
                      Seleccione un rol
                    </option>

                    {roles.map((rol) => (
                      <option
                        key={rol.id_rol}
                        value={rol.id_rol}
                      >
                        {nombreRolMostrar(
                          rol.nombre
                        )}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

            </Row>

            <div className="usuario-form-info">
              <FiShield />

              <span>
                El usuario podrá iniciar sesión
                utilizando el correo y contraseña
                registrados.
              </span>
            </div>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="light"
              onClick={
                cerrarModalCrear
              }
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="btn-primary-custom"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Spinner
                    size="sm"
                    className="me-2"
                  />

                  Creando...
                </>
              ) : (
                <>
                  <FiPlus />

                  Crear usuario
                </>
              )}
            </Button>

          </Modal.Footer>

        </Form>
      </Modal>

      {/* =======================================
          MODAL EDITAR
      ======================================== */}

      <Modal
        show={mostrarModalEditar}
        onHide={() =>
          setMostrarModalEditar(false)
        }
        centered
      >
        <Form onSubmit={editarUsuario}>

          <Modal.Header closeButton>
            <Modal.Title>
              <FiEdit />
              Editar usuario
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            <Row className="g-3">

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Nombres
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={
                      formularioEditar.nombres
                    }
                    onChange={(e) =>
                      setFormularioEditar({
                        ...formularioEditar,
                        nombres:
                          e.target.value,
                      })
                    }
                    disabled={guardando}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Apellidos
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={
                      formularioEditar.apellidos
                    }
                    onChange={(e) =>
                      setFormularioEditar({
                        ...formularioEditar,
                        apellidos:
                          e.target.value,
                      })
                    }
                    disabled={guardando}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    Rol
                  </Form.Label>

                  <Form.Select
                    value={
                      formularioEditar.id_rol
                    }
                    onChange={(e) =>
                      setFormularioEditar({
                        ...formularioEditar,
                        id_rol:
                          e.target.value,
                      })
                    }
                    disabled={guardando}
                  >
                    <option value="">
                      Seleccione un rol
                    </option>

                    {roles.map((rol) => (
                      <option
                        key={rol.id_rol}
                        value={rol.id_rol}
                      >
                        {nombreRolMostrar(
                          rol.nombre
                        )}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

            </Row>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="light"
              onClick={() =>
                setMostrarModalEditar(false)
              }
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="btn-primary-custom"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Spinner
                    size="sm"
                    className="me-2"
                  />

                  Guardando...
                </>
              ) : (
                <>
                  <FiEdit />

                  Guardar cambios
                </>
              )}
            </Button>

          </Modal.Footer>

        </Form>
      </Modal>

      {/* =======================================
          MODAL DETALLES
      ======================================== */}

      <Modal
        show={mostrarModalDetalles}
        onHide={() =>
          setMostrarModalDetalles(false)
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiEye />
            Detalles del usuario
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {usuarioSeleccionado && (
            <div className="usuario-detalles">

              <div className="usuario-detalle-avatar">
                {`${
                  usuarioSeleccionado.nombres?.charAt(
                    0
                  ) || ""
                }${
                  usuarioSeleccionado.apellidos?.charAt(
                    0
                  ) || ""
                }`.toUpperCase()}
              </div>

              <h4>
                {
                  usuarioSeleccionado.nombres
                }{" "}
                {
                  usuarioSeleccionado.apellidos
                }
              </h4>

              <span className="rol-badge">
                {nombreRolMostrar(
                  obtenerNombreRol(
                    usuarioSeleccionado
                  )
                )}
              </span>

              <div className="usuario-detalle-list">

                <div>
                  <span>
                    ID de usuario:
                  </span>

                  <strong>
                    {
                      usuarioSeleccionado.id_usuario
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Teléfono:
                  </span>

                  <strong>
                    {
                      usuarioSeleccionado.telefono ||
                      "No registrado"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Estado:
                  </span>

                  <strong>
                    {usuarioSeleccionado.activo
                      ? "Activo"
                      : "Inactivo"}
                  </strong>
                </div>

                <div>
                  <span>
                    Fecha de registro:
                  </span>

                  <strong>
                    {usuarioSeleccionado.created_at
                      ? new Date(
                          usuarioSeleccionado.created_at
                        ).toLocaleString(
                          "es-NI"
                        )
                      : "No disponible"}
                  </strong>
                </div>

                <div>
                  <span>
                    Última actualización:
                  </span>

                  <strong>
                    {usuarioSeleccionado.updated_at
                      ? new Date(
                          usuarioSeleccionado.updated_at
                        ).toLocaleString(
                          "es-NI"
                        )
                      : "No disponible"}
                  </strong>
                </div>

              </div>

            </div>
          )}

        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={() =>
              setMostrarModalDetalles(false)
            }
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Usuarios;