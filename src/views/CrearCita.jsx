import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaUser,
  FaUserMd,
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { supabase } from "../database/supabase";

import CitaPacienteSelector from "../components/citas/crear/CitaPacienteSelector";
import CitaEspecialidadSelector from "../components/citas/crear/CitaEspecialidadSelector";
import CitaEspecialistasDisponibles from "../components/citas/crear/CitaEspecialistasDisponibles";
import CitaCalendario from "../components/citas/crear/CitaCalendario";
import CitaHorariosDisponibles from "../components/citas/crear/CitaHorariosDisponibles";
import CitaForm from "../components/citas/crear/CitaForm";

import "../styles/CrearCita.css";

const DURACION_CITA_MINUTOS = 30;

const ESTADOS_NO_DISPONIBLES = "(CANCELADA,NO_ASISTIO)";

const CrearCita = () => {
  const navigate = useNavigate();

  // =========================================================
  // PACIENTE
  // =========================================================

  const [pacientes, setPacientes] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [cargandoPacientes, setCargandoPacientes] = useState(false);

  // =========================================================
  // ESPECIALIDADES
  // =========================================================

  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState(null);
  const [cargandoEspecialidades, setCargandoEspecialidades] =
    useState(false);

  // =========================================================
  // ESPECIALISTAS
  // =========================================================

  const [especialistas, setEspecialistas] = useState([]);
  const [especialista, setEspecialista] = useState(null);
  const [cargandoEspecialistas, setCargandoEspecialistas] =
    useState(false);

  // =========================================================
  // FECHA Y HORARIOS
  // =========================================================

  const [fecha, setFecha] = useState("");
  const [horariosEspecialista, setHorariosEspecialista] = useState([]);
  const [citasExistentes, setCitasExistentes] = useState([]);
  const [horario, setHorario] = useState(null);
  const [cargandoDisponibilidad, setCargandoDisponibilidad] =
    useState(false);

  // =========================================================
  // FORMULARIO
  // =========================================================

  const [datosCita, setDatosCita] = useState({
    tipo_consulta: "PRIMERA_VEZ",
    motivo: "",
    observaciones: "",
  });

  const [guardando, setGuardando] = useState(false);

  // =========================================================
  // CARGAR PACIENTES INICIAL
  // =========================================================

  useEffect(() => {
    cargarPacientes("");
  }, []);

  // =========================================================
  // BUSCAR PACIENTES DIRECTAMENTE EN SUPABASE
  // =========================================================

  useEffect(() => {
    const texto = busquedaPaciente.trim();

    const temporizador = setTimeout(() => {
      cargarPacientes(texto);
    }, 300);

    return () => clearTimeout(temporizador);
  }, [busquedaPaciente]);

  const cargarPacientes = async (texto = "") => {
    try {
      setCargandoPacientes(true);

      let consulta = supabase
        .from("pacientes")
        .select(`
          id_paciente,
          codigo_expediente,
          nombres,
          apellidos,
          telefono,
          activo
        `)
        .eq("activo", true)
        .order("nombres", { ascending: true })
        .order("apellidos", { ascending: true })
        .limit(20);

      if (texto) {
        const termino = texto.replace(/[%_]/g, "");

        consulta = consulta.or(
          `nombres.ilike.%${termino}%,` +
          `apellidos.ilike.%${termino}%,` +
          `codigo_expediente.ilike.%${termino}%,` +
          `telefono.ilike.%${termino}%`
        );
      }

      const { data, error } = await consulta;

      if (error) throw error;

      setPacientes(data || []);
    } catch (error) {
      console.error("Error buscando pacientes:", error);

      toast.error("No se pudieron buscar los pacientes.");
      setPacientes([]);
    } finally {
      setCargandoPacientes(false);
    }
  };

  // =========================================================
  // CARGAR ESPECIALIDADES
  // =========================================================

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      setCargandoEspecialidades(true);

      const { data, error } = await supabase
        .from("especialidades")
        .select(`
          id_especialidad,
          nombre,
          descripcion,
          activo
        `)
        .eq("activo", true)
        .order("nombre", { ascending: true });

      if (error) throw error;

      setEspecialidades(data || []);
    } catch (error) {
      console.error("Error cargando especialidades:", error);

      toast.error(
        "No se pudieron cargar las especialidades."
      );
    } finally {
      setCargandoEspecialidades(false);
    }
  };

  // =========================================================
  // CARGAR ESPECIALISTAS
  // =========================================================

  useEffect(() => {
    if (!especialidad?.id_especialidad) {
      setEspecialistas([]);
      setEspecialista(null);
      setFecha("");
      setHorario(null);
      setHorariosEspecialista([]);
      setCitasExistentes([]);
      return;
    }

    cargarEspecialistas(
      especialidad.id_especialidad
    );
  }, [especialidad]);

  const cargarEspecialistas = async (idEspecialidad) => {
    try {
      setCargandoEspecialistas(true);

      setEspecialistas([]);
      setEspecialista(null);
      setFecha("");
      setHorario(null);
      setHorariosEspecialista([]);
      setCitasExistentes([]);

      // =====================================================
      // PRIMERO: ESPECIALISTAS
      // =====================================================

      const {
        data: especialistasData,
        error: especialistasError,
      } = await supabase
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
          especialidades (
            id_especialidad,
            nombre,
            descripcion
          )
        `)
        .eq("id_especialidad", idEspecialidad)
        .eq("activo", true)
        .order("nombres", {
          ascending: true,
        })
        .order("apellidos", {
          ascending: true,
        });

      if (especialistasError) {
        throw especialistasError;
      }

      if (!especialistasData?.length) {
        setEspecialistas([]);
        return;
      }

      // =====================================================
      // SEGUNDO: CARGAR TODOS LOS HORARIOS DE ESOS
      // ESPECIALISTAS
      // =====================================================

      const idsEspecialistas =
        especialistasData.map(
          (item) => item.id_especialista
        );

      const {
        data: horariosData,
        error: horariosError,
      } = await supabase
        .from("horarios_especialistas")
        .select(`
          id_horario,
          id_especialista,
          dia_semana,
          hora_inicio,
          hora_fin,
          activo
        `)
        .in("id_especialista", idsEspecialistas)
        .eq("activo", true)
        .order("dia_semana", {
          ascending: true,
        })
        .order("hora_inicio", {
          ascending: true,
        });

      if (horariosError) {
        console.error(
          "Error cargando horarios:",
          horariosError
        );
      }

      // =====================================================
      // UNIR ESPECIALISTAS + HORARIOS
      // =====================================================

      const especialistasCompletos =
        especialistasData.map((item) => {
          const horarios = (
            horariosData || []
          )
            .filter(
              (horario) =>
                horario.id_especialista ===
                item.id_especialista
            )
            .sort((a, b) => {
              if (
                Number(a.dia_semana) !==
                Number(b.dia_semana)
              ) {
                return (
                  Number(a.dia_semana) -
                  Number(b.dia_semana)
                );
              }

              return String(
                a.hora_inicio
              ).localeCompare(
                String(b.hora_inicio)
              );
            });

          return {
            ...item,
            horarios,
            citas_hoy: 0,
          };
        });

      setEspecialistas(
        especialistasCompletos
      );
    } catch (error) {
      console.error(
        "Error cargando especialistas:",
        error
      );

      toast.error(
        "No se pudieron cargar los especialistas."
      );

      setEspecialistas([]);
    } finally {
      setCargandoEspecialistas(false);
    }
  };

  // =========================================================
  // SELECCIONAR ESPECIALISTA
  // =========================================================

  const seleccionarEspecialista = async (
    seleccionado
  ) => {
    if (!seleccionado) {
      setEspecialista(null);
      setFecha("");
      setHorario(null);
      setHorariosEspecialista([]);
      setCitasExistentes([]);
      return;
    }

    setEspecialista(seleccionado);

    setFecha("");
    setHorario(null);
    setCitasExistentes([]);

    // Usamos los horarios que ya cargamos
    let horarios =
      seleccionado.horarios || [];

    // =====================================================
    // RECARGAR HORARIOS DEL ESPECIALISTA
    // Esto evita que el calendario conserve horarios viejos.
    // =====================================================

    try {
      const {
        data,
        error,
      } = await supabase
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
          seleccionado.id_especialista
        )
        .eq("activo", true)
        .order("dia_semana", {
          ascending: true,
        })
        .order("hora_inicio", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      horarios = data || [];
    } catch (error) {
      console.error(
        "Error recargando horarios del especialista:",
        error
      );

      toast.error(
        "No se pudieron cargar los horarios del especialista."
      );

      horarios = [];
    }

    setHorariosEspecialista(
      horarios
    );

    // Actualizamos también el especialista
    // dentro de la lista.
    setEspecialistas((prev) =>
      prev.map((item) =>
        item.id_especialista ===
        seleccionado.id_especialista
          ? {
              ...item,
              horarios,
            }
          : item
      )
    );

    if (horarios.length === 0) {
      toast.warning(
        "Este especialista todavía no tiene horarios registrados."
      );
    }
  };

  // =========================================================
  // CAMBIAR FECHA
  // =========================================================

  useEffect(() => {
    if (!especialista || !fecha) {
      setCitasExistentes([]);
      setHorario(null);
      return;
    }

    cargarCitasDelDia();
  }, [especialista, fecha]);

  const cargarCitasDelDia = async () => {
    if (
      !especialista?.id_especialista ||
      !fecha
    ) {
      return;
    }

    try {
      setCargandoDisponibilidad(true);
      setHorario(null);

      const {
        data,
        error,
      } = await supabase
        .from("citas")
        .select(`
          id_cita,
          fecha_cita,
          hora_inicio,
          hora_fin,
          estado,
          id_paciente
        `)
        .eq(
          "id_especialista",
          especialista.id_especialista
        )
        .eq("fecha_cita", fecha)
        .not(
          "estado",
          "in",
          ESTADOS_NO_DISPONIBLES
        )
        .order("hora_inicio", {
          ascending: true,
        });

      if (error) throw error;

      setCitasExistentes(data || []);

      setEspecialistas((prev) =>
        prev.map((item) => {
          if (
            item.id_especialista !==
            especialista.id_especialista
          ) {
            return item;
          }

          return {
            ...item,
            citas_hoy: data?.length || 0,
          };
        })
      );
    } catch (error) {
      console.error(
        "Error cargando citas del día:",
        error
      );

      toast.error(
        "No se pudieron consultar las citas existentes."
      );
    } finally {
      setCargandoDisponibilidad(false);
    }
  };

  // =========================================================
  // GENERAR HORARIOS DISPONIBLES
  // =========================================================

  const horariosDisponibles = useMemo(() => {
    if (
      !especialista ||
      !fecha ||
      !horariosEspecialista.length
    ) {
      return [];
    }

    const fechaSeleccionada =
      new Date(`${fecha}T00:00:00`);

    const diaSemana =
      fechaSeleccionada.getDay();

    const horariosDelDia =
      horariosEspecialista.filter(
        (item) =>
          Number(item.dia_semana) ===
            Number(diaSemana) &&
          item.activo
      );

    if (horariosDelDia.length === 0) {
      return [];
    }

    const convertirMinutos = (hora) => {
      if (!hora) return 0;

      const [horas, minutos] =
        hora
          .slice(0, 5)
          .split(":")
          .map(Number);

      return (
        horas * 60 + minutos
      );
    };

    const convertirHora = (
      minutosTotales
    ) => {
      const horas = Math.floor(
        minutosTotales / 60
      );

      const minutos =
        minutosTotales % 60;

      return `${String(
        horas
      ).padStart(2, "0")}:${String(
        minutos
      ).padStart(2, "0")}:00`;
    };

    const resultado = [];

    horariosDelDia.forEach(
      (horarioDia) => {
        const inicio =
          convertirMinutos(
            horarioDia.hora_inicio
          );

        const fin =
          convertirMinutos(
            horarioDia.hora_fin
          );

        for (
          let minuto = inicio;
          minuto +
            DURACION_CITA_MINUTOS <=
          fin;
          minuto +=
            DURACION_CITA_MINUTOS
        ) {
          const horaInicio =
            convertirHora(minuto);

          const horaFin =
            convertirHora(
              minuto +
                DURACION_CITA_MINUTOS
            );

          const estaOcupado =
            citasExistentes.some(
              (cita) => {
                const citaInicio =
                  convertirMinutos(
                    cita.hora_inicio
                  );

                const citaFin =
                  cita.hora_fin
                    ? convertirMinutos(
                        cita.hora_fin
                      )
                    : citaInicio +
                      DURACION_CITA_MINUTOS;

                return (
                  minuto < citaFin &&
                  minuto +
                    DURACION_CITA_MINUTOS >
                    citaInicio
                );
              }
            );

          if (!estaOcupado) {
            resultado.push({
              hora_inicio:
                horaInicio,

              hora_fin:
                horaFin,

              ocupado: false,
              citas: 0,
            });
          }
        }
      }
    );

    // Eliminar horarios duplicados
    const unicos = [];

    resultado.forEach((item) => {
      const existe = unicos.some(
        (horario) =>
          horario.hora_inicio ===
            item.hora_inicio &&
          horario.hora_fin ===
            item.hora_fin
      );

      if (!existe) {
        unicos.push(item);
      }
    });

    return unicos;
  }, [
    especialista,
    fecha,
    horariosEspecialista,
    citasExistentes,
  ]);

  // =========================================================
  // SELECCIONAR PACIENTE
  // =========================================================

  const seleccionarPaciente = (item) => {
    setPaciente(item);

    if (item) {
      setBusquedaPaciente("");
    }
  };

  // =========================================================
  // SELECCIONAR ESPECIALIDAD
  // =========================================================

  const seleccionarEspecialidad = (
    item
  ) => {
    setEspecialidad(item);

    setEspecialista(null);
    setFecha("");
    setHorario(null);
    setHorariosEspecialista([]);
    setCitasExistentes([]);
    setEspecialistas([]);
  };

  // =========================================================
  // SELECCIONAR HORARIO
  // =========================================================

  const seleccionarHorario = (item) => {
    setHorario(item);
  };

  // =========================================================
  // GUARDAR CITA
  // =========================================================

  const guardarCita = async () => {
    if (!paciente) {
      toast.warning(
        "Seleccione un paciente."
      );
      return;
    }

    if (!especialidad) {
      toast.warning(
        "Seleccione una especialidad."
      );
      return;
    }

    if (!especialista) {
      toast.warning(
        "Seleccione un especialista."
      );
      return;
    }

    if (!fecha) {
      toast.warning(
        "Seleccione una fecha."
      );
      return;
    }

    if (!horario) {
      toast.warning(
        "Seleccione un horario."
      );
      return;
    }

    try {
      setGuardando(true);

      const {
        data: citasConflicto,
        error: errorConflicto,
      } = await supabase
        .from("citas")
        .select(`
          id_cita,
          hora_inicio,
          hora_fin,
          estado
        `)
        .eq(
          "id_especialista",
          especialista.id_especialista
        )
        .eq("fecha_cita", fecha)
        .not(
          "estado",
          "in",
          ESTADOS_NO_DISPONIBLES
        );

      if (errorConflicto) {
        throw errorConflicto;
      }

      const convertirMinutos = (
        hora
      ) => {
        if (!hora) return 0;

        const [horas, minutos] =
          hora
            .slice(0, 5)
            .split(":")
            .map(Number);

        return (
          horas * 60 + minutos
        );
      };

      const nuevoInicio =
        convertirMinutos(
          horario.hora_inicio
        );

      const nuevoFin =
        convertirMinutos(
          horario.hora_fin
        );

      const existeConflicto =
        (citasConflicto || []).some(
          (cita) => {
            const inicio =
              convertirMinutos(
                cita.hora_inicio
              );

            const fin =
              cita.hora_fin
                ? convertirMinutos(
                    cita.hora_fin
                  )
                : inicio +
                  DURACION_CITA_MINUTOS;

            return (
              nuevoInicio < fin &&
              nuevoFin > inicio
            );
          }
        );

      if (existeConflicto) {
        toast.error(
          "Ese horario acaba de ser ocupado. Seleccione otro horario."
        );

        await cargarCitasDelDia();

        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("citas")
        .insert({
          id_paciente:
            paciente.id_paciente,

          id_especialista:
            especialista.id_especialista,

          fecha_cita: fecha,

          hora_inicio:
            horario.hora_inicio,

          hora_fin:
            horario.hora_fin,

          motivo:
            datosCita.motivo.trim() ||
            null,

          tipo_consulta:
            datosCita.tipo_consulta,

          observaciones:
            datosCita.observaciones.trim() ||
            null,
        })
        .select(`
          id_cita,
          fecha_cita,
          hora_inicio,
          hora_fin,
          estado
        `)
        .single();

      if (error) {
        throw error;
      }

      console.log(
        "Cita creada:",
        data
      );

      toast.success(
        "Cita creada correctamente."
      );

      limpiarSeleccion();

      setTimeout(() => {
        navigate("/citas");
      }, 700);
    } catch (error) {
      console.error(
        "Error creando cita:",
        error
      );

      toast.error(
        error?.message ||
          "No se pudo crear la cita."
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // VOLVER
  // =========================================================

  const volver = () => {
    if (guardando) return;

    navigate("/citas");
  };

  // =========================================================
  // LIMPIAR
  // =========================================================

  const limpiarSeleccion = () => {
    if (guardando) return;

    setPaciente(null);
    setBusquedaPaciente("");

    setEspecialidad(null);

    setEspecialistas([]);

    setEspecialista(null);

    setFecha("");

    setHorariosEspecialista([]);

    setCitasExistentes([]);

    setHorario(null);

    setDatosCita({
      tipo_consulta: "PRIMERA_VEZ",
      motivo: "",
      observaciones: "",
    });
  };

  // =========================================================
  // RESUMEN
  // =========================================================

  const resumenCompleto =
    !!paciente &&
    !!especialidad &&
    !!especialista &&
    !!fecha &&
    !!horario;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="crear-cita-container">

      <div className="crear-cita-header">

        <button
          type="button"
          className="crear-cita-btn-regresar"
          onClick={volver}
          disabled={guardando}
        >
          <FaArrowLeft />
          <span>
            Volver a citas
          </span>
        </button>

        <div className="crear-cita-titulo">

          <div className="crear-cita-icono">
            <FaCalendarCheck />
          </div>

          <div>
            <h1>
              Nueva cita médica
            </h1>

            <p>
              Seleccione el paciente,
              especialista, fecha y horario
            </p>
          </div>

        </div>

      </div>

      {/* PASOS */}

      <div className="crear-cita-pasos">

        <div
          className={`crear-cita-paso ${
            paciente ? "completado" : ""
          }`}
        >
          <div className="crear-cita-paso-icono">
            <FaUser />
          </div>

          <div className="crear-cita-paso-info">
            <span>Paso 1</span>
            <strong>Paciente</strong>
          </div>
        </div>

        <div className="crear-cita-paso-linea" />

        <div
          className={`crear-cita-paso ${
            especialidad ? "completado" : ""
          }`}
        >
          <div className="crear-cita-paso-icono">
            <FaStethoscope />
          </div>

          <div className="crear-cita-paso-info">
            <span>Paso 2</span>
            <strong>Especialidad</strong>
          </div>
        </div>

        <div className="crear-cita-paso-linea" />

        <div
          className={`crear-cita-paso ${
            especialista ? "completado" : ""
          }`}
        >
          <div className="crear-cita-paso-icono">
            <FaUserMd />
          </div>

          <div className="crear-cita-paso-info">
            <span>Paso 3</span>
            <strong>Especialista</strong>
          </div>
        </div>

        <div className="crear-cita-paso-linea" />

        <div
          className={`crear-cita-paso ${
            fecha && horario
              ? "completado"
              : ""
          }`}
        >
          <div className="crear-cita-paso-icono">
            <FaClock />
          </div>

          <div className="crear-cita-paso-info">
            <span>Paso 4</span>
            <strong>Fecha y hora</strong>
          </div>
        </div>

      </div>

      {/* CONTENIDO */}

      <div className="crear-cita-layout">

        <main className="crear-cita-contenido">

          {/* PACIENTE */}

          <section className="crear-cita-seccion">

            <div className="crear-cita-seccion-header">

              <div className="crear-cita-seccion-icono paciente">
                <FaUser />
              </div>

              <div>
                <h2>
                  1. Seleccionar paciente
                </h2>

                <p>
                  Busque el paciente que
                  desea agendar
                </p>
              </div>

            </div>

            <CitaPacienteSelector
              paciente={paciente}
              pacientes={pacientes}
              busqueda={busquedaPaciente}
              setBusqueda={setBusquedaPaciente}
              onSeleccionar={
                seleccionarPaciente
              }
              cargando={
                cargandoPacientes
              }
            />

          </section>

          {/* ESPECIALIDAD */}

          <section className="crear-cita-seccion">

            <div className="crear-cita-seccion-header">

              <div className="crear-cita-seccion-icono especialidad">
                <FaStethoscope />
              </div>

              <div>
                <h2>
                  2. Seleccionar especialidad
                </h2>

                <p>
                  Seleccione la especialidad
                  médica requerida
                </p>
              </div>

            </div>

            <CitaEspecialidadSelector
              especialidad={especialidad}
              especialidades={
                especialidades
              }
              onSeleccionar={
                seleccionarEspecialidad
              }
              cargando={
                cargandoEspecialidades
              }
            />

          </section>

          {/* ESPECIALISTAS */}

          <section className="crear-cita-seccion">

            <div className="crear-cita-seccion-header">

              <div className="crear-cita-seccion-icono especialista">
                <FaUserMd />
              </div>

              <div>
                <h2>
                  3. Especialista disponible
                </h2>

                <p>
                  Seleccione el especialista
                  que atenderá al paciente
                </p>
              </div>

            </div>

            {!especialidad ? (
              <div className="crear-cita-bloqueo">

                <FaStethoscope />

                <strong>
                  Seleccione primero una
                  especialidad
                </strong>

                <span>
                  Aquí aparecerán los
                  especialistas disponibles.
                </span>

              </div>
            ) : (
              <CitaEspecialistasDisponibles
                especialistas={
                  especialistas
                }
                especialista={
                  especialista
                }
                onSeleccionar={
                  seleccionarEspecialista
                }
                cargando={
                  cargandoEspecialistas
                }
              />
            )}

          </section>

          {/* FECHA Y HORARIO */}

          <section className="crear-cita-seccion">

            <div className="crear-cita-seccion-header">

              <div className="crear-cita-seccion-icono horario">
                <FaClock />
              </div>

              <div>
                <h2>
                  4. Fecha y horario
                </h2>

                <p>
                  Seleccione un día y una
                  hora disponible
                </p>
              </div>

            </div>

            {!especialista ? (
              <div className="crear-cita-bloqueo">

                <FaUserMd />

                <strong>
                  Seleccione primero un
                  especialista
                </strong>

                <span>
                  Aquí aparecerá su
                  disponibilidad.
                </span>

              </div>
            ) : (
              <>
                <div className="crear-cita-calendario-wrapper">

                  <CitaCalendario
                    fecha={fecha}
                    setFecha={setFecha}
                    horarios={
                      horariosEspecialista
                    }
                  />

                </div>

                {fecha && (
                  <div className="crear-cita-horarios-wrapper">

                    <div className="crear-cita-subtitulo">

                      <FaClock />

                      <div>
                        <strong>
                          Horarios disponibles
                        </strong>

                        <span>
                          Seleccione una hora
                          para la cita
                        </span>
                      </div>

                    </div>

                    <CitaHorariosDisponibles
                      horarios={
                        horariosDisponibles
                      }
                      horarioSeleccionado={
                        horario
                      }
                      onSeleccionar={
                        seleccionarHorario
                      }
                      cargando={
                        cargandoDisponibilidad
                      }
                    />

                  </div>
                )}

              </>
            )}

          </section>

          {/* FORMULARIO */}

          <section className="crear-cita-seccion">

            <div className="crear-cita-seccion-header">

              <div className="crear-cita-seccion-icono formulario">
                <FaClipboardList />
              </div>

              <div>
                <h2>
                  5. Información de la cita
                </h2>

                <p>
                  Complete la información
                  adicional
                </p>
              </div>

            </div>

            <CitaForm
              datos={datosCita}
              setDatos={setDatosCita}
            />

          </section>

        </main>

        {/* RESUMEN */}

        <aside className="crear-cita-resumen">

          <div className="crear-cita-resumen-header">

            <FaCalendarCheck />

            <div>
              <h3>
                Resumen de la cita
              </h3>

              <span>
                Información seleccionada
              </span>
            </div>

          </div>

          <div className="crear-cita-resumen-body">

            <div className="crear-cita-resumen-item">
              <span>Paciente</span>

              <strong>
                {paciente
                  ? `${paciente.nombres} ${paciente.apellidos}`
                  : "Sin seleccionar"}
              </strong>

              {paciente && (
                <small>
                  {paciente.codigo_expediente}
                </small>
              )}
            </div>

            <div className="crear-cita-resumen-item">
              <span>Especialidad</span>

              <strong>
                {especialidad?.nombre ||
                  "Sin seleccionar"}
              </strong>
            </div>

            <div className="crear-cita-resumen-item">
              <span>Especialista</span>

              <strong>
                {especialista
                  ? `Dr(a). ${especialista.nombres} ${especialista.apellidos}`
                  : "Sin seleccionar"}
              </strong>

              {especialista?.codigo_profesional && (
                <small>
                  Código:{" "}
                  {especialista.codigo_profesional}
                </small>
              )}
            </div>

            <div className="crear-cita-resumen-item">
              <span>Fecha</span>

              <strong>
                {fecha
                  ? formatearFecha(fecha)
                  : "Sin seleccionar"}
              </strong>
            </div>

            <div className="crear-cita-resumen-item">
              <span>Horario</span>

              <strong>
                {horario
                  ? `${formatearHora(
                      horario.hora_inicio
                    )} - ${formatearHora(
                      horario.hora_fin
                    )}`
                  : "Sin seleccionar"}
              </strong>
            </div>

            <div className="crear-cita-resumen-item">
              <span>Tipo de consulta</span>

              <strong>
                {datosCita.tipo_consulta ===
                "PRIMERA_VEZ"
                  ? "Primera vez"
                  : "Seguimiento"}
              </strong>
            </div>

          </div>

          <div className="crear-cita-resumen-footer">

            <button
              type="button"
              className="btn btn-light"
              onClick={limpiarSeleccion}
              disabled={guardando}
            >
              Limpiar selección
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={guardarCita}
              disabled={
                !resumenCompleto ||
                guardando
              }
            >
              {guardando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />

                  Guardando...
                </>
              ) : (
                <>
                  <FaCalendarCheck />

                  Confirmar cita
                </>
              )}
            </button>

          </div>

          {!resumenCompleto && (
            <div className="crear-cita-resumen-ayuda">

              <FaCheckCircle />

              <span>
                Complete los datos requeridos
                para confirmar la cita.
              </span>

            </div>
          )}

        </aside>

      </div>

    </div>
  );
};

// =========================================================
// FUNCIONES AUXILIARES
// =========================================================

const formatearHora = (hora) => {
  if (!hora) return "";

  const [horas, minutos] =
    hora.slice(0, 5).split(":");

  let h = Number(horas);

  const periodo =
    h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${minutos} ${periodo}`;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  const fechaLocal =
    new Date(`${fecha}T00:00:00`);

  return new Intl.DateTimeFormat(
    "es-NI",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(fechaLocal);
};

export default CrearCita;