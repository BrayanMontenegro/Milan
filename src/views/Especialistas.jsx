import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { FaUserMd } from "react-icons/fa";

import { toast } from "react-toastify";

import { supabase } from "../database/supabase";

import EspecialistaHeader from "../components/especialistas/EspecialistaHeader";
import EspecialistaFiltros from "../components/especialistas/EspecialistaFiltros";
import EspecialistaTabla from "../components/especialistas/EspecialistaTabla";
import EspecialistaCard from "../components/especialistas/EspecialistaCard";
import EspecialistaModal from "../components/especialistas/EspecialistaModal";

import "../styles/especialistas.css";

// =========================================================
// FORMULARIO INICIAL
// =========================================================

const formularioInicial = {
  nombres: "",
  apellidos: "",
  id_especialidad: "",
  codigo_profesional: "",
  telefono: "",
  correo: "",
  password: "",
  confirmar_password: "",
};

// =========================================================
// COMPONENTE
// =========================================================

const Especialistas = () => {
  // =======================================================
  // ESTADOS
  // =======================================================

  const [especialistas, setEspecialistas] =
    useState([]);

  const [especialidades, setEspecialidades] =
    useState([]);

  const [rolEspecialista, setRolEspecialista] =
    useState(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [especialidadFiltro, setEspecialidadFiltro] =
    useState("");

  const [estadoFiltro, setEstadoFiltro] =
    useState("");

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [especialistaSeleccionado, setEspecialistaSeleccionado] =
    useState(null);

  const [formulario, setFormulario] =
    useState(formularioInicial);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  // =========================================================
  // CARGAR ESPECIALISTAS
  // =========================================================

  const cargarEspecialistas = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("especialistas")
        .select(`
          id_especialista,
          id_usuario,
          id_especialidad,
          nombres,
          apellidos,
          codigo_profesional,
          telefono,
          correo,
          activo,
          created_at,
          updated_at,
          especialidades (
            id_especialidad,
            nombre,
            descripcion
          )
        `)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);

        toast.error(
          "No se pudieron cargar los especialistas."
        );

        return;
      }

      setEspecialistas(data || []);

    } catch (error) {
      console.error(error);

      toast.error(
        "Ocurrió un error al cargar los especialistas."
      );

    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // CARGAR ESPECIALIDADES
  // =========================================================

  const cargarEspecialidades = async () => {
    try {
      const { data, error } =
        await supabase
          .from("especialidades")
          .select(`
            id_especialidad,
            nombre,
            descripcion,
            activo
          `)
          .order("nombre", {
            ascending: true,
          });

      if (error) {
        console.error(
          "Error cargando especialidades:",
          error
        );

        toast.error(
          error.message ||
            "No se pudieron cargar las especialidades."
        );

        return;
      }

      const especialidadesActivas =
        (data || []).filter(
          (item) =>
            item.activo !== false
        );

      setEspecialidades(
        especialidadesActivas
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Ocurrió un error al cargar las especialidades."
      );
    }
  };

  // =========================================================
  // CARGAR ROL ESPECIALISTA
  // =========================================================

  const cargarRolEspecialista = async () => {
    try {
      const { data, error } =
        await supabase
          .from("roles")
          .select(`
            id_rol,
            nombre
          `)
          .eq(
            "nombre",
            "ESPECIALISTA"
          )
          .eq(
            "activo",
            true
          )
          .single();

      if (error) {
        console.error(
          "Error cargando rol ESPECIALISTA:",
          error
        );

        toast.error(
          "No se pudo obtener el rol de especialista."
        );

        return;
      }

      setRolEspecialista(data);

    } catch (error) {
      console.error(error);

      toast.error(
        "Ocurrió un error al cargar el rol."
      );
    }
  };

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    cargarEspecialistas();
    cargarEspecialidades();
    cargarRolEspecialista();
  }, []);

  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {
    setFormulario({
      ...formularioInicial,
    });

    setEspecialistaSeleccionado(null);

    setModoEdicion(false);
  };

  // =========================================================
  // NUEVO ESPECIALISTA
  // =========================================================

  const nuevoEspecialista = () => {
    limpiarFormulario();

    setMostrarModal(true);
  };

  const agregarEspecialidad = async ({ nombre, descripcion }) => {
    try {
      const nombreNormalizado = nombre.trim();

      if (!nombreNormalizado) {
        toast.error("Debe ingresar el nombre de la especialidad.");
        return null;
      }

      const existente = especialidades.find(
        (especialidad) =>
          especialidad.nombre?.trim().toLowerCase() ===
          nombreNormalizado.toLowerCase()
      );

      if (existente) {
        toast.warning("Esta especialidad ya existe.");
        return existente;
      }

      const { data, error } = await supabase
        .from("especialidades")
        .insert({
          nombre: nombreNormalizado,
          descripcion: descripcion?.trim() || null,
          activo: true,
        })
        .select("id_especialidad, nombre, descripcion, activo")
        .single();

      if (error) {
        console.error(
          "ERROR INSERTANDO ESPECIALIDAD:",
          error
        );

        const mensaje =
          error.code === "42501"
            ? "No tienes permisos para guardar especialidades en Supabase. Revisa las políticas de RLS."
            : error.message ||
              "No se pudo agregar la especialidad.";

        toast.error(mensaje);
        return null;
      }

      if (!data) {
        toast.error(
          "La especialidad no se pudo guardar porque la respuesta de Supabase quedó vacía."
        );
        return null;
      }

      const siguiente = [
        ...especialidades,
        data,
      ].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

      setEspecialidades(siguiente);

      toast.success("Especialidad agregada correctamente.");

      await cargarEspecialidades();

      return data;

    } catch (error) {
      console.error("ERROR:", error);
      toast.error("Ocurrió un error al agregar la especialidad.");
      return null;
    }
  };
  // =========================================================
  // EDITAR ESPECIALISTA
  // =========================================================

  const editarEspecialista = (
    especialista
  ) => {
    setEspecialistaSeleccionado(
      especialista
    );

    setFormulario({
      nombres:
        especialista.nombres || "",

      apellidos:
        especialista.apellidos || "",

      id_especialidad:
        especialista.id_especialidad || "",

      codigo_profesional:
        especialista.codigo_profesional || "",

      telefono:
        especialista.telefono || "",

      correo:
        especialista.correo || "",

      password: "",

      confirmar_password: "",
    });

    setModoEdicion(true);

    setMostrarModal(true);
  };

  // =========================================================
  // VALIDAR FORMULARIO
  // =========================================================

  const validarFormulario = () => {
    if (
      !formulario.nombres.trim()
    ) {
      toast.warning(
        "Ingrese los nombres del especialista."
      );

      return false;
    }

    if (
      !formulario.apellidos.trim()
    ) {
      toast.warning(
        "Ingrese los apellidos del especialista."
      );

      return false;
    }

    if (
      !formulario.id_especialidad
    ) {
      toast.warning(
        "Seleccione una especialidad."
      );

      return false;
    }

    if (
      !formulario.telefono.trim()
    ) {
      toast.warning(
        "Ingrese el teléfono del especialista."
      );

      return false;
    }

    if (
      !formulario.correo.trim()
    ) {
      toast.warning(
        "Ingrese el correo electrónico."
      );

      return false;
    }

    // -------------------------------------------------------
    // VALIDAR CORREO
    // -------------------------------------------------------

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formulario.correo.trim()
      );

    if (!correoValido) {
      toast.warning(
        "Ingrese un correo electrónico válido."
      );

      return false;
    }

    // -------------------------------------------------------
    // CONTRASEÑA SOLO AL CREAR
    // -------------------------------------------------------

    if (!modoEdicion) {
      if (!formulario.password) {
        toast.warning(
          "Ingrese una contraseña."
        );

        return false;
      }

      if (
        formulario.password.length < 6
      ) {
        toast.warning(
          "La contraseña debe tener al menos 6 caracteres."
        );

        return false;
      }

      if (
        formulario.password !==
        formulario.confirmar_password
      ) {
        toast.warning(
          "Las contraseñas no coinciden."
        );

        return false;
      }
    }

    return true;
  };

  // =========================================================
  // CREAR ESPECIALISTA
  // =========================================================

  const registrarEspecialista = async () => {
    if (!validarFormulario()) {
      return;
    }

    // -------------------------------------------------------
    // VERIFICAR ROL
    // -------------------------------------------------------

    if (
      !rolEspecialista?.id_rol
    ) {
      toast.error(
        "No se encontró el rol ESPECIALISTA."
      );

      return;
    }

    try {
      setGuardando(true);

      // -----------------------------------------------------
      // LLAMAR EDGE FUNCTION
      // -----------------------------------------------------

      const {
        data,
        error,
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
                formulario.correo.trim(),

              telefono:
                formulario.telefono.trim(),

              password:
                formulario.password,

              id_rol:
                rolEspecialista.id_rol,

              id_especialidad:
                formulario.id_especialidad,
            },
          }
        );

      // -----------------------------------------------------
      // ERROR DE LA FUNCIÓN
      // -----------------------------------------------------

      if (error) {
        console.error(
          "Error en crear-usuario:",
          error
        );

        toast.error(
          error.message ||
            "No se pudo crear el especialista."
        );

        return;
      }

      // -----------------------------------------------------
      // SIN RESPUESTA
      // -----------------------------------------------------

      if (!data) {
        toast.error(
          "La función no devolvió una respuesta."
        );

        return;
      }

      // -----------------------------------------------------
      // ERROR DEVUELTO POR LA FUNCIÓN
      // -----------------------------------------------------

      if (data.error) {
        console.error(
          "Error de la Edge Function:",
          data
        );

        toast.error(
          data.error ||
            "No se pudo registrar el especialista."
        );

        return;
      }

      // -----------------------------------------------------
      // ÉXITO
      // -----------------------------------------------------

      const codigo =
        data?.especialista
          ?.codigo_profesional;

      toast.success(
        codigo
          ? `Especialista registrado correctamente. Código: ${codigo}`
          : "Especialista registrado correctamente."
      );

      // -----------------------------------------------------
      // CERRAR MODAL
      // -----------------------------------------------------

      setMostrarModal(false);

      limpiarFormulario();

      // -----------------------------------------------------
      // ACTUALIZAR LISTA
      // -----------------------------------------------------

      await cargarEspecialistas();

    } catch (error) {
      console.error(
        "Error al registrar especialista:",
        error
      );

      toast.error(
        "Ocurrió un error al registrar el especialista."
      );

    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // ACTUALIZAR ESPECIALISTA
  // =========================================================

  const actualizarEspecialista = async () => {
    if (!validarFormulario()) {
      return;
    }

    if (!especialistaSeleccionado) {
      toast.error(
        "No se encontró el especialista."
      );

      return;
    }

    try {
      setGuardando(true);

      const datos = {
        nombres:
          formulario.nombres.trim(),

        apellidos:
          formulario.apellidos.trim(),

        id_especialidad:
          formulario.id_especialidad,

        telefono:
          formulario.telefono.trim(),

        correo:
          formulario.correo.trim(),

        updated_at:
          new Date().toISOString(),
      };

      const {
        data,
        error,
      } =
        await supabase
          .from("especialistas")
          .update(datos)
          .eq(
            "id_especialista",
            especialistaSeleccionado.id_especialista
          )
          .select(`
            id_especialista,
            id_usuario,
            id_especialidad,
            nombres,
            apellidos,
            codigo_profesional,
            telefono,
            correo,
            activo,
            created_at,
            updated_at,
            especialidades (
              id_especialidad,
              nombre,
              descripcion
            )
          `)
          .single();

      if (error) {
        console.error(error);

        if (
          error.code === "23505"
        ) {
          toast.error(
            "El correo o código profesional ya está registrado."
          );
        } else {
          toast.error(
            "No se pudo actualizar el especialista."
          );
        }

        return;
      }

      setEspecialistas(
        (prev) =>
          prev.map(
            (item) =>
              item.id_especialista ===
              data.id_especialista
                ? data
                : item
          )
      );

      toast.success(
        "Especialista actualizado correctamente."
      );

      setMostrarModal(false);

      limpiarFormulario();

    } catch (error) {
      console.error(error);

      toast.error(
        "Ocurrió un error al actualizar el especialista."
      );

    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // GUARDAR
  // =========================================================

  const guardarEspecialista = async (
    e
  ) => {
    e.preventDefault();

    if (modoEdicion) {
      await actualizarEspecialista();
    } else {
      await registrarEspecialista();
    }
  };

  // =========================================================
  // CAMBIAR ESTADO
  // =========================================================

  const cambiarEstado = async (
    especialista
  ) => {
    const nuevoEstado =
      !especialista.activo;

    const accion =
      nuevoEstado
        ? "activar"
        : "desactivar";

    const confirmar =
      window.confirm(
        `¿Está seguro que desea ${accion} a ${especialista.nombres} ${especialista.apellidos}?`
      );

    if (!confirmar) {
      return;
    }

    try {
      const {
        data,
        error,
      } =
        await supabase
          .from("especialistas")
          .update({
            activo:
              nuevoEstado,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id_especialista",
            especialista.id_especialista
          )
          .select(`
            id_especialista,
            id_usuario,
            id_especialidad,
            nombres,
            apellidos,
            codigo_profesional,
            telefono,
            correo,
            activo,
            created_at,
            updated_at,
            especialidades (
              id_especialidad,
              nombre,
              descripcion
            )
          `)
          .single();

      if (error) {
        console.error(error);

        toast.error(
          "No se pudo cambiar el estado del especialista."
        );

        return;
      }

      setEspecialistas(
        (prev) =>
          prev.map(
            (item) =>
              item.id_especialista ===
              data.id_especialista
                ? data
                : item
          )
      );

      toast.success(
        nuevoEstado
          ? "Especialista activado correctamente."
          : "Especialista desactivado correctamente."
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Ocurrió un error al cambiar el estado."
      );
    }
  };

  // =========================================================
  // VER
  // =========================================================

  const verEspecialista = (
    especialista
  ) => {
    setEspecialistaSeleccionado(
      especialista
    );
  };

  // =========================================================
  // FILTROS
  // =========================================================

  const especialistasFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return especialistas.filter(
        (especialista) => {
          const nombreCompleto =
            `${especialista.nombres || ""} ${
              especialista.apellidos || ""
            }`.toLowerCase();

          const codigo =
            especialista.codigo_profesional?.toLowerCase() ||
            "";

          const telefono =
            especialista.telefono?.toLowerCase() ||
            "";

          const correo =
            especialista.correo?.toLowerCase() ||
            "";

          const nombreEspecialidad =
            especialista.especialidades?.nombre?.toLowerCase() ||
            "";

          const coincideBusqueda =
            !texto ||
            nombreCompleto.includes(
              texto
            ) ||
            codigo.includes(
              texto
            ) ||
            telefono.includes(
              texto
            ) ||
            correo.includes(
              texto
            ) ||
            nombreEspecialidad.includes(
              texto
            );

          const coincideEspecialidad =
            !especialidadFiltro ||
            especialista.id_especialidad ===
              especialidadFiltro;

          const coincideEstado =
            estadoFiltro === "" ||
            (
              estadoFiltro ===
                "ACTIVO" &&
              especialista.activo
            ) ||
            (
              estadoFiltro ===
                "INACTIVO" &&
              !especialista.activo
            );

          return (
            coincideBusqueda &&
            coincideEspecialidad &&
            coincideEstado
          );
        }
      );
    }, [
      especialistas,
      busqueda,
      especialidadFiltro,
      estadoFiltro,
    ]);

  // =========================================================
  // LIMPIAR FILTROS
  // =========================================================

  const limpiarFiltros = () => {
    setBusqueda("");
    setEspecialidadFiltro("");
    setEstadoFiltro("");
  };

  // =========================================================
  // ESTADÍSTICAS
  // =========================================================

  const estadisticas =
    useMemo(() => {
      return {
        total:
          especialistas.length,

        activos:
          especialistas.filter(
            (item) =>
              item.activo
          ).length,

        inactivos:
          especialistas.filter(
            (item) =>
              !item.activo
          ).length,

        especialidadesUsadas:
          new Set(
            especialistas
              .map(
                (item) =>
                  item.id_especialidad
              )
              .filter(Boolean)
          ).size,
      };
    }, [especialistas]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="especialistas-page">

      <EspecialistaHeader
        onNuevoEspecialista={
          nuevoEspecialista
        }
      />

      <div className="container-fluid px-3 px-md-4 pb-4">

        {/* ESTADÍSTICAS */}

        <div className="row g-3 mb-4">

          <div className="col-6 col-xl-3">
            <div className="especialista-stat-card">

              <div className="especialista-stat-icon purple">
                <FaUserMd />
              </div>

              <div>
                <span>Total</span>

                <strong>
                  {estadisticas.total}
                </strong>
              </div>

            </div>
          </div>

          <div className="col-6 col-xl-3">
            <div className="especialista-stat-card">

              <div className="especialista-stat-icon turquoise">
                <FaUserMd />
              </div>

              <div>
                <span>Activos</span>

                <strong>
                  {estadisticas.activos}
                </strong>
              </div>

            </div>
          </div>

          <div className="col-6 col-xl-3">
            <div className="especialista-stat-card">

              <div className="especialista-stat-icon yellow">
                <FaUserMd />
              </div>

              <div>
                <span>Inactivos</span>

                <strong>
                  {estadisticas.inactivos}
                </strong>
              </div>

            </div>
          </div>

          <div className="col-6 col-xl-3">
            <div className="especialista-stat-card">

              <div className="especialista-stat-icon fuchsia">
                <FaUserMd />
              </div>

              <div>
                <span>Especialidades</span>

                <strong>
                  {
                    estadisticas.especialidadesUsadas
                  }
                </strong>
              </div>

            </div>
          </div>

        </div>

        {/* FILTROS */}

        <EspecialistaFiltros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          especialidad={
            especialidadFiltro
          }
          setEspecialidad={
            setEspecialidadFiltro
          }
          estado={estadoFiltro}
          setEstado={setEstadoFiltro}
          especialidades={
            especialidades
          }
          onLimpiar={
            limpiarFiltros
          }
        />

        {/* TABLA */}

        <div className="especialistas-main-card">

          <div className="especialistas-section-title">

            <div>

              <h5>
                Especialistas
              </h5>

              <span>
                {
                  especialistasFiltrados.length
                }{" "}
                resultado
                {
                  especialistasFiltrados.length !==
                  1
                    ? "s"
                    : ""
                }
              </span>

            </div>

          </div>

          {cargando ? (

            <div className="especialistas-loading">

              <div
                className="spinner-border"
                role="status"
              />

              <p>
                Cargando especialistas...
              </p>

            </div>

          ) : (

            <>

              <div className="especialistas-table-wrapper">

                <EspecialistaTabla
                  especialistas={
                    especialistasFiltrados
                  }
                  onVer={
                    verEspecialista
                  }
                  onEditar={
                    editarEspecialista
                  }
                  onCambiarEstado={
                    cambiarEstado
                  }
                />

              </div>

              <div className="especialistas-mobile-list">

                {especialistasFiltrados.map(
                  (
                    especialista
                  ) => (

                    <EspecialistaCard
                      key={
                        especialista.id_especialista
                      }
                      especialista={
                        especialista
                      }
                      onVer={
                        verEspecialista
                      }
                      onEditar={
                        editarEspecialista
                      }
                      onCambiarEstado={
                        cambiarEstado
                      }
                    />

                  )
                )}

              </div>

              {!especialistasFiltrados.length && (

                <div className="text-center py-5">

                  <FaUserMd
                    size={42}
                    className="mb-3 opacity-50"
                  />

                  <h6>
                    No hay especialistas
                  </h6>

                  <p className="text-muted mb-0">
                    No se encontraron
                    especialistas con
                    los filtros
                    seleccionados.
                  </p>

                </div>

              )}

            </>

          )}

        </div>

      </div>

      {/* MODAL */}

        <EspecialistaModal
          mostrar={mostrarModal}
          onCerrar={() => {
            if (!guardando) {
              setMostrarModal(false);
              limpiarFormulario();
            }
          }}
          formulario={formulario}
          setFormulario={setFormulario}
          onSubmit={guardarEspecialista}
          guardando={guardando}
          modoEdicion={modoEdicion}
          especialidades={especialidades}
          onAgregarEspecialidad={agregarEspecialidad}
        />

    </div>
  );
};

export default Especialistas;