import { useEffect, useMemo, useState } from "react";
import { supabase } from "../database/supabase";

const CITAS_POR_PAGINA = 9;

const useCitas = (navigate) => {
  /* =====================================================
     ESTADOS
  ===================================================== */

  const [citas, setCitas] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");
  const [mes, setMes] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [especialista, setEspecialista] = useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);

  // Modales
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  /* =====================================================
     CARGAR CITAS
  ===================================================== */

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError("");

      const { data, error: errorCitas } = await supabase
        .from("citas")
        .select(`
          id_cita,
          id_paciente,
          id_especialista,
          fecha_cita,
          hora_inicio,
          hora_fin,
          motivo,
          tipo_consulta,
          estado,
          observaciones,
          created_at,
          updated_at,

          pacientes (
            id_paciente,
            codigo_expediente,
            nombres,
            apellidos,
            telefono,
            correo,
            activo
          ),

          especialistas (
            id_especialista,
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
          )
        `)
        .order("fecha_cita", { ascending: false })
        .order("hora_inicio", { ascending: true });

      if (errorCitas) {
        console.error("Error cargando citas:", errorCitas);
        throw errorCitas;
      }

      setCitas(data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "No fue posible cargar las citas."
      );
    } finally {
      setCargando(false);
    }
  };

  /* =====================================================
     CARGAR ESPECIALISTAS
  ===================================================== */

  const cargarEspecialistas = async () => {
    try {
      const { data, error: errorEspecialistas } =
        await supabase
          .from("especialistas")
          .select(`
            id_especialista,
            nombres,
            apellidos,
            activo
          `)
          .eq("activo", true)
          .order("nombres", { ascending: true })
          .order("apellidos", { ascending: true });

      if (errorEspecialistas) {
        console.error(
          "Error cargando especialistas:",
          errorEspecialistas
        );
        return;
      }

      setEspecialistas(data || []);
    } catch (err) {
      console.error(
        "Error cargando especialistas:",
        err
      );
    }
  };

  /* =====================================================
     CARGA INICIAL
  ===================================================== */

  useEffect(() => {
    cargarCitas();
    cargarEspecialistas();
  }, []);

  /* =====================================================
     FILTRADO
  ===================================================== */

  const citasFiltradas = useMemo(() => {
    let resultado = [...citas];

    // -----------------------------------------------
    // BUSCAR PACIENTE
    // -----------------------------------------------

    const texto = busqueda
      .trim()
      .toLowerCase();

    if (texto) {
      resultado = resultado.filter((cita) => {
        const paciente =
          cita.pacientes || {};

        const nombrePaciente =
          `${paciente.nombres || ""} ${
            paciente.apellidos || ""
          }`.toLowerCase();

        const expediente =
          (
            paciente.codigo_expediente || ""
          ).toLowerCase();

        const telefono =
          (
            paciente.telefono || ""
          ).toLowerCase();

        return (
          nombrePaciente.includes(texto) ||
          expediente.includes(texto) ||
          telefono.includes(texto)
        );
      });
    }

    // -----------------------------------------------
    // FECHA EXACTA
    // -----------------------------------------------

    if (fecha) {
      resultado = resultado.filter(
        (cita) =>
          cita.fecha_cita === fecha
      );
    }

    // -----------------------------------------------
    // MES
    // -----------------------------------------------

    if (mes) {
      resultado = resultado.filter(
        (cita) => {
          if (!cita.fecha_cita)
            return false;

          const fechaCita =
            new Date(
              `${cita.fecha_cita}T00:00:00`
            );

          const mesCita =
            fechaCita.getMonth() + 1;

          return (
            mesCita === Number(mes)
          );
        }
      );
    }

    // -----------------------------------------------
    // DÍA DE LA SEMANA
    // -----------------------------------------------

    if (diaSemana !== "") {
      resultado = resultado.filter(
        (cita) => {
          if (!cita.fecha_cita)
            return false;

          const fechaCita =
            new Date(
              `${cita.fecha_cita}T00:00:00`
            );

          return (
            fechaCita.getDay() ===
            Number(diaSemana)
          );
        }
      );
    }

    // -----------------------------------------------
    // ESPECIALISTA
    // -----------------------------------------------

    if (especialista) {
      resultado = resultado.filter(
        (cita) =>
          cita.id_especialista ===
          especialista
      );
    }

    return resultado;
  }, [
    citas,
    busqueda,
    fecha,
    mes,
    diaSemana,
    especialista,
  ]);

  /* =====================================================
     PAGINACIÓN
  ===================================================== */

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      citasFiltradas.length /
        CITAS_POR_PAGINA
    )
  );

  const paginaVisible = Math.min(
    paginaActual,
    totalPaginas
  );

  const citasPagina = useMemo(() => {
    const inicio =
      (paginaVisible - 1) *
      CITAS_POR_PAGINA;

    const fin =
      inicio + CITAS_POR_PAGINA;

    return citasFiltradas.slice(
      inicio,
      fin
    );
  }, [
    citasFiltradas,
    paginaVisible,
  ]);

  const cambiarFiltro = (actualizarFiltro, valor) => {
    actualizarFiltro(valor);
    setPaginaActual(1);
  };

  /* =====================================================
     LIMPIAR FILTROS
  ===================================================== */

  const limpiarFiltros = () => {
    setBusqueda("");
    setFecha("");
    setMes("");
    setDiaSemana("");
    setEspecialista("");
    setPaginaActual(1);
  };

  /* =====================================================
     VER CITA
  ===================================================== */

  const verCita = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarDetalle(true);
  };

  /* =====================================================
     EDITAR CITA
  ===================================================== */

  const editarCita = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  /* =====================================================
     NUEVA CITA
  ===================================================== */

  const nuevaCita = () => {
    navigate("/crear-cita");
  };

  /* =====================================================
     CITA ACTUALIZADA
  ===================================================== */

  const manejarCitaActualizada = () => {
    setMostrarModal(false);
    setCitaSeleccionada(null);
    cargarCitas();
  };


  return {
    citas,
    especialistas,
    cargando,
    error,
    busqueda,
    setBusqueda,
    fecha,
    setFecha,
    mes,
    setMes,
    diaSemana,
    setDiaSemana,
    especialista,
    setEspecialista,
    paginaActual,
    setPaginaActual,
    citaSeleccionada,
    setCitaSeleccionada,
    mostrarDetalle,
    setMostrarDetalle,
    mostrarModal,
    setMostrarModal,
    citasFiltradas,
    citasPagina,
    paginaVisible,
    totalPaginas,
    cambiarFiltro,
    limpiarFiltros,
    verCita,
    editarCita,
    nuevaCita,
    manejarCitaActualizada,
    cargarCitas,
  };
};

export default useCitas;
