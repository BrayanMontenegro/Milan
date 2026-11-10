import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { supabase } from "../database/supabase";
import { useAuth } from "../context/AuthContextValue";

import EnfermeriaHeader from "../components/enfermera/EnfermeriaHeader";
import EnfermeriaCitas from "../components/enfermera/EnfermeriaCitas";
import EnfermeriaModal from "../components/enfermera/EnfermeriaModal";

import "../styles/Enfermeria.css";

const REGISTROS_POR_PAGINA = 8;

const Enfermeria = () => {
  const {
    busqueda,
    citasFiltradas,
    citasPagina,
    cargando,
    paginaVisible,
    totalPaginas,
    cambiarBusqueda,
    abrirModalSignos,
    irPaginaAnterior,
    irPaginaSiguiente,
    mostrarModal,
    citaSeleccionada,
    cerrarModal,
    guardarRegistroEnfermeria,
    guardando
  } = useEnfermeriaController();

  return (
    <div className="enfermeria-page">

      <EnfermeriaHeader />

      <EnfermeriaCitas
        busqueda={busqueda}
        cambiarBusqueda={cambiarBusqueda}
        citasFiltradas={citasFiltradas}
        citasPagina={citasPagina}
        cargando={cargando}
        paginaVisible={paginaVisible}
        totalPaginas={totalPaginas}
        abrirModalSignos={abrirModalSignos}
        irPaginaAnterior={irPaginaAnterior}
        irPaginaSiguiente={irPaginaSiguiente}
      />

      {/* MODAL */}
      {mostrarModal && citaSeleccionada && (
        <EnfermeriaModal
          cita={citaSeleccionada}
          onCerrar={cerrarModal}
          onGuardar={guardarRegistroEnfermeria}
          guardando={guardando}
        />
      )}

    </div>
  );
};


const useEnfermeriaController = () => {
  const { usuario } = useAuth();

  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);

  /*
   * Obtener fecha local.
   *
   * No usamos toISOString() porque puede cambiar el día
   * dependiendo de la zona horaria.
   */
  const obtenerFechaLocal = () => {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  };

  const cargarCitas = async () => {
    try {
      setCargando(true);

      const hoy = obtenerFechaLocal();

      const { data, error } = await supabase
        .from("citas")
        .select(`
          id_cita,
          fecha_cita,
          hora_inicio,
          hora_fin,
          motivo,
          tipo_consulta,
          estado,
          observaciones,

          pacientes (
            id_paciente,
            codigo_expediente,
            nombres,
            apellidos,
            fecha_nacimiento,
            sexo,
            telefono
          ),

          especialistas (
            id_especialista,
            nombres,
            apellidos,

            especialidades (
              id_especialidad,
              nombre
            )
          )
        `)
        .eq("fecha_cita", hoy)
        .eq("estado", "PROGRAMADA")
        .order("hora_inicio", {
          ascending: true,
        });

      if (error) {
        console.error("Error cargando citas de enfermería:", error);
        toast.error("No se pudieron cargar las citas de hoy.");
        return;
      }

      setCitas(data || []);
    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Ocurrió un error al cargar las citas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  /*
   * Buscar por:
   * - nombre del paciente
   * - apellido
   * - expediente
   * - especialista
   * - especialidad
   */
  const citasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return citas;
    }

    return citas.filter((cita) => {
      const paciente = cita.pacientes || {};
      const especialista = cita.especialistas || {};
      const especialidad = especialista.especialidades || {};

      const nombrePaciente =
        `${paciente.nombres || ""} ${paciente.apellidos || ""}`
          .toLowerCase();

      const nombreEspecialista =
        `${especialista.nombres || ""} ${especialista.apellidos || ""}`
          .toLowerCase();

      const expediente =
        (paciente.codigo_expediente || "").toLowerCase();

      const nombreEspecialidad =
        (especialidad.nombre || "").toLowerCase();

      return (
        nombrePaciente.includes(texto) ||
        nombreEspecialista.includes(texto) ||
        expediente.includes(texto) ||
        nombreEspecialidad.includes(texto)
      );
    });
  }, [citas, busqueda]);

  /*
   * Paginación
   */
  const totalPaginas = Math.ceil(
    citasFiltradas.length / REGISTROS_POR_PAGINA
  );

  const paginaVisible = Math.min(
    paginaActual,
    Math.max(1, totalPaginas)
  );

  const indiceInicio =
    (paginaVisible - 1) * REGISTROS_POR_PAGINA;

  const citasPagina = citasFiltradas.slice(
    indiceInicio,
    indiceInicio + REGISTROS_POR_PAGINA
  );

  const cambiarBusqueda = (valor) => {
    setBusqueda(valor);
    setPaginaActual(1);
  };

  const abrirModalSignos = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (guardando) return;

    setMostrarModal(false);
    setCitaSeleccionada(null);
  };

  /*
   * Guardar signos vitales + confirmar cita
   */
  const guardarRegistroEnfermeria = async (formulario) => {
    if (!citaSeleccionada) return;

    try {
      setGuardando(true);

      const paciente = citaSeleccionada.pacientes;

      if (!paciente?.id_paciente) {
        toast.error("No se encontró el paciente de la cita.");
        return;
      }

      /*
       * 1. Guardar registro de enfermería
       */
      const { data: registro, error: errorRegistro } =
        await supabase
          .from("registros_enfermeria")
          .insert({
            id_paciente: paciente.id_paciente,
            id_usuario: usuario?.id || null,

            peso:
              formulario.peso !== ""
                ? Number(formulario.peso)
                : null,

            talla:
              formulario.talla !== ""
                ? Number(formulario.talla)
                : null,

            temperatura:
              formulario.temperatura !== ""
                ? Number(formulario.temperatura)
                : null,

            presion_arterial:
              formulario.presion_arterial?.trim() || null,

            frecuencia_cardiaca:
              formulario.frecuencia_cardiaca !== ""
                ? Number(formulario.frecuencia_cardiaca)
                : null,

            frecuencia_respiratoria:
              formulario.frecuencia_respiratoria !== ""
                ? Number(formulario.frecuencia_respiratoria)
                : null,

            saturacion_oxigeno:
              formulario.saturacion_oxigeno !== ""
                ? Number(formulario.saturacion_oxigeno)
                : null,

            motivo_consulta:
              formulario.motivo_consulta?.trim() || null,

            observaciones:
              formulario.observaciones?.trim() || null,
          })
          .select()
          .single();

      if (errorRegistro) {
        console.error(
          "Error registrando signos:",
          errorRegistro
        );

        toast.error(
          errorRegistro.message ||
          "No se pudo guardar el registro de enfermería."
        );

        return;
      }

      /*
       * 2. Cambiar la cita a CONFIRMADA
       */
      const { error: errorCita } = await supabase
        .from("citas")
        .update({
          estado: "CONFIRMADA",
          updated_at: new Date().toISOString(),
        })
        .eq("id_cita", citaSeleccionada.id_cita)
        .eq("estado", "PROGRAMADA");

      if (errorCita) {
        console.error(
          "Error confirmando cita:",
          errorCita
        );

        /*
         * Intentamos eliminar el registro si la cita
         * no pudo confirmarse.
         */
        if (registro?.id_registro_enfermeria) {
          await supabase
            .from("registros_enfermeria")
            .delete()
            .eq(
              "id_registro_enfermeria",
              registro.id_registro_enfermeria
            );
        }

        toast.error(
          "Los signos se registraron, pero no fue posible confirmar la cita."
        );

        return;
      }

      toast.success(
        "Signos vitales registrados y cita confirmada correctamente."
      );

      setMostrarModal(false);
      setCitaSeleccionada(null);

      /*
       * La cita desaparece de la lista porque ahora
       * su estado es CONFIRMADA.
       */
      setCitas((prev) =>
        prev.filter(
          (item) =>
            item.id_cita !== citaSeleccionada.id_cita
        )
      );

    } catch (error) {
      console.error(
        "Error inesperado guardando enfermería:",
        error
      );

      toast.error(
        "Ocurrió un error al guardar el registro."
      );
    } finally {
      setGuardando(false);
    }
  };

  const irPaginaAnterior = () => {
    setPaginaActual(Math.max(paginaVisible - 1, 1));
  };

  const irPaginaSiguiente = () => {
    setPaginaActual(Math.min(paginaVisible + 1, totalPaginas));
  };

  return {
    busqueda,
    citasFiltradas,
    citasPagina,
    cargando,
    paginaVisible,
    totalPaginas,
    cambiarBusqueda,
    abrirModalSignos,
    irPaginaAnterior,
    irPaginaSiguiente,
    mostrarModal,
    citaSeleccionada,
    cerrarModal,
    guardarRegistroEnfermeria,
    guardando
  };
};
export default Enfermeria;