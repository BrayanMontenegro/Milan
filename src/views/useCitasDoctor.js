import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../database/supabase";

const CITAS_POR_PAGINA = 9;

const useCitasDoctor = (usuario, cargandoAuth, navigate) => {
  const userId = usuario?.id;
  const [especialista, setEspecialista] = useState(null);
  const [citas, setCitas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtros, setFiltros] = useState({
    busqueda: "",
    fecha: "",
    mes: "",
    dia: "",
    estado: "",
  });

  const [paginaActual, setPaginaActual] = useState(1);

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);

  /**
   * Obtener el especialista relacionado con el usuario autenticado.
   */
  const obtenerEspecialista = useCallback(async () => {
    if (!userId) {
      setEspecialista(null);
      return null;
    }

    const { data, error: errorEspecialista } = await supabase
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
        id_especialidad,
        especialidades (
          id_especialidad,
          nombre,
          descripcion
        )
      `)
      .eq("id_usuario", userId)
      .maybeSingle();

    if (errorEspecialista) {
      console.error("Error obteniendo especialista:", errorEspecialista);
      throw errorEspecialista;
    }

    if (!data) {
      throw new Error(
        "No se encontró un registro de especialista asociado al usuario actual."
      );
    }

    setEspecialista(data);

    return data;
  }, [userId]);

  /**
   * Cargar únicamente las citas del especialista autenticado.
   */
  const cargarCitas = useCallback(async () => {
    if (!userId) return;

    try {
      setCargando(true);
      setError("");

      const especialistaActual = especialista || await obtenerEspecialista();

      if (!especialistaActual?.id_especialista) {
        setCitas([]);
        return;
      }

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
            fecha_nacimiento,
            sexo,
            telefono,
            correo,
            direccion,
            procedencia,
            ocupacion,
            estado_civil,
            es_menor_edad,
            nombre_tutor,
            parentesco_tutor,
            telefono_tutor,
            observaciones,
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
        .eq("id_especialista", especialistaActual.id_especialista)
        .order("fecha_cita", { ascending: true })
        .order("hora_inicio", { ascending: true });

      if (errorCitas) {
        console.error("Error cargando citas:", errorCitas);
        throw errorCitas;
      }

      setCitas(data || []);
    } catch (err) {
      console.error("Error en CitasDoctor:", err);

      setError(
        err?.message ||
          "No fue posible cargar las citas del especialista."
      );

      setCitas([]);
    } finally {
      setCargando(false);
    }
  }, [userId, especialista, obtenerEspecialista]);

  /**
   * Cargar especialista y citas al iniciar sesión.
   */
  useEffect(() => {
    if (cargandoAuth || !userId) return;

    cargarCitas();
  }, [cargandoAuth, userId, cargarCitas]);

  /**
   * Filtrar citas.
   */
  const citasFiltradas = useMemo(() => {
    let resultado = [...citas];

    const busqueda = filtros.busqueda.trim().toLowerCase();

    if (busqueda) {
      resultado = resultado.filter((cita) => {
        const paciente = cita.pacientes || {};

        const nombrePaciente =
          `${paciente.nombres || ""} ${paciente.apellidos || ""}`
            .trim()
            .toLowerCase();

        const expediente = (
          paciente.codigo_expediente || ""
        ).toLowerCase();

        const telefono = (
          paciente.telefono || ""
        ).toLowerCase();

        const motivo = (
          cita.motivo || ""
        ).toLowerCase();

        return (
          nombrePaciente.includes(busqueda) ||
          expediente.includes(busqueda) ||
          telefono.includes(busqueda) ||
          motivo.includes(busqueda)
        );
      });
    }

    /**
     * Fecha exacta.
     */
    if (filtros.fecha) {
      resultado = resultado.filter(
        (cita) => cita.fecha_cita === filtros.fecha
      );
    }

    /**
     * Mes.
     * El valor esperado puede ser:
     * 1-12 o "01"-"12".
     */
    if (filtros.mes) {
      const mesSeleccionado = String(filtros.mes).padStart(2, "0");

      resultado = resultado.filter((cita) => {
        if (!cita.fecha_cita) return false;

        const [, mes] = cita.fecha_cita.split("-");

        return mes === mesSeleccionado;
      });
    }

    /**
     * Día de la semana.
     *
     * JS:
     * 0 = domingo
     * 1 = lunes
     * ...
     * 6 = sábado
     */
    if (
      filtros.dia !== "" &&
      filtros.dia !== null &&
      filtros.dia !== undefined
    ) {
      resultado = resultado.filter((cita) => {
        if (!cita.fecha_cita) return false;

        const fecha = new Date(`${cita.fecha_cita}T00:00:00`);
        return String(fecha.getDay()) === String(filtros.dia);
      });
    }

    /**
     * Estado.
     */
    if (filtros.estado) {
      resultado = resultado.filter(
        (cita) => cita.estado === filtros.estado
      );
    }

    return resultado;
  }, [citas, filtros]);

  /**
   * Paginación.
   */
  const totalPaginas = Math.max(
    1,
    Math.ceil(citasFiltradas.length / CITAS_POR_PAGINA)
  );

  const paginaVisible = Math.min(paginaActual, totalPaginas);

  const citasPagina = useMemo(() => {
    const inicio = (paginaVisible - 1) * CITAS_POR_PAGINA;
    const fin = inicio + CITAS_POR_PAGINA;

    return citasFiltradas.slice(inicio, fin);
  }, [citasFiltradas, paginaVisible]);

  /**
   * Estadísticas.
   */
  const estadisticas = useMemo(() => {
    return {
      total: citas.length,
      programadas: citas.filter(
        (cita) => cita.estado === "PROGRAMADA"
      ).length,
      confirmadas: citas.filter(
        (cita) => cita.estado === "CONFIRMADA"
      ).length,
      atendidas: citas.filter(
        (cita) => cita.estado === "ATENDIDA"
      ).length,
    };
  }, [citas]);

  /**
   * Abrir detalle.
   */
  const handleVer = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarDetalle(true);
  };

  /**
   * Abrir edición.
   */
  const handleEditar = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarEditar(true);
  };

  /**
   * Cerrar detalle.
   */
  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setCitaSeleccionada(null);
  };

  /**
   * Cerrar edición.
   */
  const cerrarEditar = () => {
    setMostrarEditar(false);
    setCitaSeleccionada(null);
  };

  /**
   * Después de editar una cita.
   */
  const handleActualizada = async () => {
    setMostrarEditar(false);
    setCitaSeleccionada(null);

    await cargarCitas();
  };

  /**
   * Nueva cita.
   */
  const handleNuevaCita = () => {
    navigate("/citas/nueva");
  };

  /**
   * Cambio de filtros.
   *
   * Soporta:
   * - onChange={(e) => setFiltros(...)}
   * - onFiltrosChange={(nuevos) => ...}
   */
  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros((actuales) => ({
      ...actuales,
      ...nuevosFiltros,
    }));
    setPaginaActual(1);
  };

  /**
   * Página anterior.
   */
  const paginaAnterior = () => {
    setPaginaActual(Math.max(1, paginaVisible - 1));
  };

  /**
   * Página siguiente.
   */
  const paginaSiguiente = () => {
    setPaginaActual(Math.min(totalPaginas, paginaVisible + 1));
  };


  return {
    especialista,
    citas,
    cargando,
    error,
    filtros,
    citaSeleccionada,
    mostrarDetalle,
    mostrarEditar,
    citasFiltradas,
    totalPaginas,
    paginaVisible,
    citasPagina,
    estadisticas,
    handleVer,
    handleEditar,
    cerrarDetalle,
    cerrarEditar,
    handleActualizada,
    handleNuevaCita,
    handleFiltrosChange,
    paginaAnterior,
    paginaSiguiente,
    cargarCitas,
  };
};

export default useCitasDoctor;
