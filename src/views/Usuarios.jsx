import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";

import { supabase } from "../database/supabase";
import { useAuth } from "../context/AuthContextValue";
import UsuariosEncabezado from "../components/usuarios/UsuariosEncabezado";
import UsuariosFiltros from "../components/usuarios/UsuariosFiltros";
import UsuariosTabla from "../components/usuarios/UsuariosTabla";
import UsuarioCrearModal from "../components/usuarios/UsuarioCrearModal";
import UsuarioEditarModal from "../components/usuarios/UsuarioEditarModal";
import UsuarioDetallesModal from "../components/usuarios/UsuarioDetallesModal";

import "../styles/Usuarios.css";

const Usuarios = () => {
  const {
    roles,
    cargando,
    guardando,
    error,
    setError,
    mensaje,
    setMensaje,
    busqueda,
    setBusqueda,
    filtroRol,
    setFiltroRol,
    filtroEstado,
    setFiltroEstado,
    mostrarModal,
    mostrarModalEditar,
    setMostrarModalEditar,
    mostrarModalDetalles,
    setMostrarModalDetalles,
    usuarioSeleccionado,
    formulario,
    cambiarFormulario,
    formularioEditar,
    setFormularioEditar,
    esAdministrador,
    cargarDatos,
    crearUsuario,
    cerrarModalCrear,
    abrirModalCrear,
    editarUsuario,
    abrirEditar,
    cambiarEstado,
    verDetalles,
    obtenerNombreRol,
    nombreRolMostrar,
    usuariosFiltrados,
    usuarios,
    totalUsuarios,
    usuariosActivos,
    usuariosInactivos,
    especialistas
  } = useUsuariosController();

  if (!cargando && !esAdministrador) {
    return (
      <div className="usuarios-page">
        <div className="container-fluid">
          <Alert variant="danger" className="mt-4">
            <strong>Acceso restringido</strong>
            <br />
            Solo los administradores pueden acceder a la gestión de usuarios.
          </Alert>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="usuarios-page">
        <div className="usuarios-loading">
          <Spinner animation="border" variant="primary" />
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-page">
      <div className="container-fluid px-3 px-lg-4">
        <UsuariosEncabezado
          error={error}
          mensaje={mensaje}
          onDismissError={() => setError("")}
          onDismissMessage={() => setMensaje("")}
          onRefresh={() => cargarDatos()}
          onCreate={abrirModalCrear}
          cargando={cargando}
          total={totalUsuarios}
          activos={usuariosActivos}
          inactivos={usuariosInactivos}
          especialistas={especialistas}
        />

        <Card className="usuarios-main-card">
          <Card.Body>
            <UsuariosFiltros
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              filtroRol={filtroRol}
              setFiltroRol={setFiltroRol}
              filtroEstado={filtroEstado}
              setFiltroEstado={setFiltroEstado}
              roles={roles}
              nombreRolMostrar={nombreRolMostrar}
            />
            <UsuariosTabla
              usuariosFiltrados={usuariosFiltrados}
              usuarios={usuarios}
              obtenerNombreRol={obtenerNombreRol}
              nombreRolMostrar={nombreRolMostrar}
              onVerDetalles={verDetalles}
              onEditar={abrirEditar}
              onCambiarEstado={cambiarEstado}
            />
          </Card.Body>
        </Card>
      </div>

      <UsuarioCrearModal
        mostrar={mostrarModal}
        onCerrar={cerrarModalCrear}
        formulario={formulario}
        cambiarFormulario={cambiarFormulario}
        onSubmit={crearUsuario}
        guardando={guardando}
        error={error}
        roles={roles}
        nombreRolMostrar={nombreRolMostrar}
      />
      <UsuarioEditarModal
        mostrar={mostrarModalEditar}
        onCerrar={() => setMostrarModalEditar(false)}
        formulario={formularioEditar}
        setFormulario={setFormularioEditar}
        onSubmit={editarUsuario}
        guardando={guardando}
        error={error}
        roles={roles}
        nombreRolMostrar={nombreRolMostrar}
      />
      <UsuarioDetallesModal
        mostrar={mostrarModalDetalles}
        onCerrar={() => setMostrarModalDetalles(false)}
        usuario={usuarioSeleccionado}
        obtenerNombreRol={obtenerNombreRol}
        nombreRolMostrar={nombreRolMostrar}
      />
    </div>
  );
};


const useUsuariosController = () => {
  const { perfil } = useAuth();

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
    let vigente = true;

    if (!esAdministrador) {
      setCargando(false);
      return () => {
        vigente = false;
      };
    }

    cargarDatos(() => vigente);

    return () => {
      vigente = false;
    };
  }, [esAdministrador]);

  // ==========================================
  // CARGAR USUARIOS
  // ==========================================

  async function obtenerUsuarios() {
    return supabase
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
  }

  const cargarUsuarios = async () => {
    const { data, error } = await obtenerUsuarios();

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

  async function obtenerRoles() {
    return supabase
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
  }

  async function cargarDatos(estaVigente = () => true) {
    setCargando(true);
    setError("");

    try {
      const [usuariosResp, rolesResp] = await Promise.all([
        obtenerUsuarios(),
        obtenerRoles(),
      ]);

      if (!estaVigente()) return;

      if (usuariosResp.error) {
        console.error("Error cargando usuarios:", usuariosResp.error);
        setError("No se pudieron cargar los usuarios.");
      } else {
        setUsuarios(usuariosResp.data || []);
      }

      if (rolesResp.error) {
        console.error("Error cargando roles:", rolesResp.error);
        setError("No se pudieron cargar los roles.");
      } else {
        setRoles(rolesResp.data || []);
      }
    } catch (error) {
      if (!estaVigente()) return;

      console.error("Error cargando datos de usuarios:", error);
      setError("No se pudieron cargar los datos.");
    } finally {
      if (estaVigente()) {
        setCargando(false);
      }
    }
  }

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

  return {
    roles,
    cargando,
    guardando,
    error,
    setError,
    mensaje,
    setMensaje,
    busqueda,
    setBusqueda,
    filtroRol,
    setFiltroRol,
    filtroEstado,
    setFiltroEstado,
    mostrarModal,
    mostrarModalEditar,
    setMostrarModalEditar,
    mostrarModalDetalles,
    setMostrarModalDetalles,
    usuarioSeleccionado,
    formulario,
    cambiarFormulario,
    formularioEditar,
    setFormularioEditar,
    esAdministrador,
    cargarDatos,
    crearUsuario,
    cerrarModalCrear,
    abrirModalCrear,
    editarUsuario,
    abrirEditar,
    cambiarEstado,
    verDetalles,
    obtenerNombreRol,
    nombreRolMostrar,
    usuariosFiltrados,
    usuarios,
    totalUsuarios,
    usuariosActivos,
    usuariosInactivos,
    especialistas
  };
};
export default Usuarios;