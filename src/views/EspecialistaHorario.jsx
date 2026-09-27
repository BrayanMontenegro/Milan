import React, { useEffect, useState } from "react";
import { supabase } from "../database/supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserMd,
} from "react-icons/fa";

import HorarioModal from "../components/especialistas/especialistaHorario/HorarioModal";
import "../styles/EspecialistaHorario.css";

const diasSemana = [
  { valor: 1, nombre: "Lunes" },
  { valor: 2, nombre: "Martes" },
  { valor: 3, nombre: "Miércoles" },
  { valor: 4, nombre: "Jueves" },
  { valor: 5, nombre: "Viernes" },
  { valor: 6, nombre: "Sábado" },
  { valor: 0, nombre: "Domingo" },
];

const EspecialistaHorario = () => {
  const {
    usuario,
    perfil,
    cargando: cargandoAuth,
  } = useAuth();

  const [especialista, setEspecialista] = useState(null);
  const [horarios, setHorarios] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [horarioEditar, setHorarioEditar] =
    useState(null);

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    if (!cargandoAuth && usuario?.id) {
      cargarEspecialista();
    }
  }, [usuario, cargandoAuth]);

  // =========================================================
  // OBTENER ESPECIALISTA
  // =========================================================

  const cargarEspecialista = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("especialistas")
        .select(`
          id_especialista,
          id_usuario,
          nombres,
          apellidos,
          codigo_profesional,
          telefono,
          correo,
          activo,
          especialidades (
            id_especialidad,
            nombre,
            descripcion
          )
        `)
        .eq("id_usuario", usuario.id)
        .single();

      if (error) {
        console.error(
          "Error obteniendo especialista:",
          error
        );

        throw error;
      }

      setEspecialista(data);

      await cargarHorarios(
        data.id_especialista
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se encontró el perfil de especialista."
      );

      setEspecialista(null);
    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // OBTENER HORARIOS
  // =========================================================

  const cargarHorarios = async (
    idEspecialista
  ) => {
    try {
      const { data, error } = await supabase
        .from("horarios_especialistas")
        .select(`
          id_horario,
          id_especialista,
          dia_semana,
          hora_inicio,
          hora_fin,
          activo
        `)
        .eq(
          "id_especialista",
          idEspecialista
        )
        .eq("activo", true)
        .order("dia_semana", {
          ascending: true,
        })
        .order("hora_inicio", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Error obteniendo horarios:",
          error
        );

        throw error;
      }

      setHorarios(data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudieron cargar los horarios."
      );

      setHorarios([]);
    }
  };

  // =========================================================
  // ABRIR MODAL NUEVO
  // =========================================================

  const abrirNuevoHorario = () => {
    setHorarioEditar(null);
    setMostrarModal(true);
  };

  // =========================================================
  // ABRIR MODAL EDITAR
  // =========================================================

  const abrirEditarHorario = (horario) => {
    setHorarioEditar(horario);
    setMostrarModal(true);
  };

  // =========================================================
  // CERRAR MODAL
  // =========================================================

  const cerrarModal = () => {
    setMostrarModal(false);
    setHorarioEditar(null);
  };

  // =========================================================
  // GUARDAR HORARIO
  // =========================================================

  const guardarHorario = async (datos) => {
    if (!especialista?.id_especialista) {
      throw new Error(
        "No se encontró el especialista."
      );
    }

    // =====================================================
    // EDITAR
    // =====================================================

    if (datos.id_horario) {
      const { error } = await supabase
        .from("horarios_especialistas")
        .update({
          dia_semana: datos.dia_semana,
          hora_inicio: datos.hora_inicio,
          hora_fin: datos.hora_fin,
          updated_at: new Date().toISOString(),
        })
        .eq(
          "id_horario",
          datos.id_horario
        )
        .eq(
          "id_especialista",
          especialista.id_especialista
        );

      if (error) {
        console.error(
          "Error actualizando horario:",
          error
        );

        throw error;
      }

      toast.success(
        "Horario actualizado correctamente."
      );
    }

    // =====================================================
    // CREAR
    // =====================================================

    else {
      const { error } = await supabase
        .from("horarios_especialistas")
        .insert({
          id_especialista:
            especialista.id_especialista,

          dia_semana:
            datos.dia_semana,

          hora_inicio:
            datos.hora_inicio,

          hora_fin:
            datos.hora_fin,

          activo: true,
        });

      if (error) {
        console.error(
          "Error creando horario:",
          error
        );

        throw error;
      }

      toast.success(
        "Horario agregado correctamente."
      );
    }

    await cargarHorarios(
      especialista.id_especialista
    );

    cerrarModal();
  };

  // =========================================================
  // ELIMINAR HORARIO
  // =========================================================

  const eliminarHorario = async (horario) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este horario?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const { error } = await supabase
        .from("horarios_especialistas")
        .update({
          activo: false,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id_horario",
          horario.id_horario
        )
        .eq(
          "id_especialista",
          especialista.id_especialista
        );

      if (error) {
        console.error(
          "Error eliminando horario:",
          error
        );

        throw error;
      }

      toast.success(
        "Horario eliminado correctamente."
      );

      await cargarHorarios(
        especialista.id_especialista
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo eliminar el horario."
      );
    }
  };

  // =========================================================
  // OBTENER HORARIOS POR DÍA
  // =========================================================

  const obtenerHorariosDia = (dia) => {
    return horarios.filter(
      (horario) =>
        horario.dia_semana === dia
    );
  };

  // =========================================================
  // FORMATEAR HORA
  // =========================================================

  const formatearHora = (hora) => {
    if (!hora) return "";

    const [horas, minutos] =
      hora.split(":");

    const fecha = new Date();

    fecha.setHours(
      Number(horas),
      Number(minutos),
      0,
      0
    );

    return fecha.toLocaleTimeString(
      "es-NI",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =========================================================
  // CARGANDO
  // =========================================================

  if (cargandoAuth || cargando) {
    return (
      <div className="especialista-horario-loading">

        <div
          className="spinner-border"
          role="status"
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>

        <p>
          Cargando horario...
        </p>

      </div>
    );
  }

  // =========================================================
  // SIN ESPECIALISTA
  // =========================================================

  if (!especialista) {
    return (
      <div className="especialista-horario-empty">

        <FaUserMd />

        <h4>
          No se encontró el perfil
          de especialista
        </h4>

        <p>
          El usuario actual no está asociado
          a un especialista.
        </p>

      </div>
    );
  }

  // =========================================================
  // VISTA PRINCIPAL
  // =========================================================

  return (
    <div className="especialista-horario-container">

      {/* ===================================================
          ENCABEZADO
      ==================================================== */}

      <div className="especialista-horario-header">

        <div className="especialista-horario-titulo">

          <span className="especialista-horario-label">
            <FaCalendarAlt />
            Mi horario de atención
          </span>

          <h2>
            {especialista.nombres}{" "}
            {especialista.apellidos}
          </h2>

          <p>
            {especialista.especialidades?.nombre ||
              "Especialidad no asignada"}
          </p>

        </div>

        <div className="especialista-horario-info">

          <span>
            Código profesional
          </span>

          <strong>
            {especialista.codigo_profesional ||
              "No asignado"}
          </strong>

        </div>

      </div>

      {/* ===================================================
          BOTÓN AGREGAR
      ==================================================== */}

      <div className="especialista-horario-toolbar">

        <div>
          <h4>
            Horarios de atención
          </h4>

          <p>
            Configure los días y horas en los
            que estará disponible para atender.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={abrirNuevoHorario}
        >
          <FaPlus />
          Agregar horario
        </button>

      </div>

      {/* ===================================================
          DÍAS
      ==================================================== */}

      <div className="especialista-horario-grid">

        {diasSemana.map((dia) => {

          const horariosDia =
            obtenerHorariosDia(
              dia.valor
            );

          return (
            <div
              className="especialista-horario-dia"
              key={dia.valor}
            >

              <div className="especialista-horario-dia-header">

                <h5>
                  {dia.nombre}
                </h5>

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={abrirNuevoHorario}
                  title={`Agregar horario para ${dia.nombre}`}
                >
                  <FaPlus />
                </button>

              </div>

              <div className="especialista-horario-dia-body">

                {horariosDia.length === 0 ? (

                  <div className="horario-sin-registro">

                    <FaClock />

                    <span>
                      No hay horario configurado
                    </span>

                  </div>

                ) : (

                  horariosDia.map(
                    (horario) => (

                      <div
                        className="horario-bloque"
                        key={
                          horario.id_horario
                        }
                      >

                        <div className="horario-bloque-horas">

                          <FaClock />

                          <span>
                            {formatearHora(
                              horario.hora_inicio
                            )}

                            {" - "}

                            {formatearHora(
                              horario.hora_fin
                            )}
                          </span>

                        </div>

                        <div className="horario-bloque-acciones">

                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            title="Editar horario"
                            onClick={() =>
                              abrirEditarHorario(
                                horario
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-light text-danger"
                            title="Eliminar horario"
                            onClick={() =>
                              eliminarHorario(
                                horario
                              )
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>
          );
        })}

      </div>

      {/* ===================================================
          MODAL
      ==================================================== */}

      <HorarioModal
        mostrar={mostrarModal}
        horarioEditar={horarioEditar}
        horarios={horarios}
        onCerrar={cerrarModal}
        onGuardar={guardarHorario}
      />

    </div>
  );
};

export default EspecialistaHorario;
