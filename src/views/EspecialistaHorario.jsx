import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../database/supabase";
import { useAuth } from "../context/AuthContextValue";
import { toast } from "react-toastify";
import {
  FaUserMd,
} from "react-icons/fa";

import HorarioModal from "../components/especialistas/especialistaHorario/HorarioModal";
import EspecialistaHorarioPanel from "../components/especialistas/especialistaHorario/EspecialistaHorarioPanel";
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
    cargandoAuth,
    cargando,
    especialista,
    diasSemana,
    obtenerHorariosDia,
    formatearHora,
    abrirNuevoHorario,
    abrirEditarHorario,
    eliminarHorario,
    mostrarModal,
    horarioEditar,
    horarios,
    cerrarModal,
    guardarHorario
  } = useEspecialistaHorarioController();
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

      <EspecialistaHorarioPanel
        especialista={especialista}
        diasSemana={diasSemana}
        obtenerHorariosDia={obtenerHorariosDia}
        formatearHora={formatearHora}
        abrirNuevoHorario={abrirNuevoHorario}
        abrirEditarHorario={abrirEditarHorario}
        eliminarHorario={eliminarHorario}
      />

      {/* ===================================================
          MODAL
      ==================================================== */}

      <HorarioModal
        key={mostrarModal
          ? `abierto-${horarioEditar?.id_horario ?? "nuevo"}`
          : "cerrado"}
        mostrar={mostrarModal}
        horarioEditar={horarioEditar}
        horarios={horarios}
        onCerrar={cerrarModal}
        onGuardar={guardarHorario}
      />

    </div>
  );
};


const useEspecialistaHorarioController = () => {
  const {
    usuario,
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
  // OBTENER HORARIOS
  // =========================================================

  const cargarHorarios = useCallback(async (
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
  }, []);

  // =========================================================
  // OBTENER ESPECIALISTA
  // =========================================================

  const cargarEspecialista = useCallback(async () => {
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
  }, [usuario, cargarHorarios]);

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    if (!cargandoAuth && usuario?.id) {
      cargarEspecialista();
    }
  }, [usuario, cargandoAuth, cargarEspecialista]);

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

  return {
    cargandoAuth,
    cargando,
    especialista,
    diasSemana,
    obtenerHorariosDia,
    formatearHora,
    abrirNuevoHorario,
    abrirEditarHorario,
    eliminarHorario,
    mostrarModal,
    horarioEditar,
    horarios,
    cerrarModal,
    guardarHorario
  };
};
export default EspecialistaHorario;
