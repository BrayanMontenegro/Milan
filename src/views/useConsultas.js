import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../database/supabase";

const POR_PAGINA = 8;

const obtenerFechaLocal = () => {
  const ahora = new Date();
  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, "0");
  const day = String(ahora.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const useConsultas = (navigate) => {

  const [citas, setCitas] = useState([]);

  const [cargando, setCargando] =
    useState(true);

    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const [busqueda, setBusqueda] =
    useState("");

  const [estado, setEstado] =
    useState("TODOS");

  const [paginaActual, setPaginaActual] =
    useState(1);


  /* =======================================================
     CARGAR CITAS DE HOY
     ======================================================= */

  const cargarCitas = async () => {

    try {

      setCargando(true);
      setCitas([]);

      const {
        data: { user },
        error: errorAuth,
      } = await supabase.auth.getUser();

      if (errorAuth) throw errorAuth;
      if (!user) {
        throw new Error("No hay una sesión autenticada.");
      }

      const { data: especialista, error: errorEspecialista } =
        await supabase
          .from("especialistas")
          .select("id_especialista")
          .eq("id_usuario", user.id)
          .maybeSingle();

      if (errorEspecialista) throw errorEspecialista;
      if (!especialista?.id_especialista) {
        throw new Error(
          "La cuenta iniciada no está vinculada a un especialista."
        );
      }

      const fechaHoy =
        obtenerFechaLocal();


      const {
        data,
        error,
      } = await supabase
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

          pacientes (
            id_paciente,
            codigo_expediente,
            nombres,
            apellidos
          ),

          especialistas (
            id_especialista,
            nombres,
            apellidos,
            codigo_profesional,

            especialidades (
              id_especialidad,
              nombre
            )
          )
        `)
        .eq(
          "fecha_cita",
          fechaHoy
        )
        .eq(
          "id_especialista",
          especialista.id_especialista
        )
        .order(
          "hora_inicio",
          {
            ascending: true,
          }
        );


      if (error) {

        console.error(
          "Error cargando citas:",
          error
        );

        toast.error(
          "No se pudieron cargar las citas de hoy."
        );

        return;
      }


      setCitas(data || []);

    } catch (error) {

      console.error(
        "Error inesperado:",
        error
      );

      toast.error(
        error.message || "Ocurrió un error al cargar las consultas."
      );

    } finally {

      setCargando(false);

    }

  };


  /* =======================================================
     CARGA INICIAL
     ======================================================= */

  useEffect(() => {

    cargarCitas();

  }, []);

  const verConsulta = (cita) => {
    setCitaSeleccionada(cita);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setCitaSeleccionada(null);
  };

  /* =======================================================
     ESTADÍSTICAS
     ======================================================= */

  const total =
    citas.length;


  const confirmadas =
    citas.filter(
      (cita) =>
        cita.estado === "CONFIRMADA"
    ).length;


  const pendientes =
    citas.filter(
      (cita) =>
        cita.estado === "PROGRAMADA"
    ).length;


  const atendidas =
    citas.filter(
      (cita) =>
        cita.estado === "ATENDIDA"
    ).length;


  /* =======================================================
     FILTROS
     ======================================================= */

  const citasFiltradas = useMemo(() => {

    const texto =
      busqueda
        .trim()
        .toLowerCase();


    return citas.filter((cita) => {

      const paciente =
        cita.pacientes || {};


      const especialista =
        cita.especialistas || {};


      const nombrePaciente =
        `${paciente.nombres || ""} ${
          paciente.apellidos || ""
        }`.toLowerCase();


      const expediente =
        (
          paciente.codigo_expediente || ""
        ).toLowerCase();


      const nombreEspecialista =
        `${especialista.nombres || ""} ${
          especialista.apellidos || ""
        }`.toLowerCase();


      const especialidad =
        (
          especialista
            .especialidades
            ?.nombre || ""
        ).toLowerCase();


      const coincideBusqueda =
        !texto ||
        nombrePaciente.includes(texto) ||
        expediente.includes(texto) ||
        nombreEspecialista.includes(texto) ||
        especialidad.includes(texto);


      const coincideEstado =
        estado === "TODOS" ||
        cita.estado === estado;


      return (
        coincideBusqueda &&
        coincideEstado
      );

    });

  }, [
    citas,
    busqueda,
    estado,
  ]);


  /* =======================================================
     PAGINACIÓN
     ======================================================= */

  const totalPaginas =
    Math.ceil(
      citasFiltradas.length /
        POR_PAGINA
    );


  const inicio =
    (paginaActual - 1) *
    POR_PAGINA;


  const citasPagina =
    citasFiltradas.slice(
      inicio,
      inicio + POR_PAGINA
    );


  /* =======================================================
     REINICIAR PÁGINA AL FILTRAR
     ======================================================= */

  useEffect(() => {

    setPaginaActual(1);

  }, [
    busqueda,
    estado,
  ]);


  /* =======================================================
     ATENDER CITA
     ======================================================= */

  const atenderCita = (cita) => {

    if (!cita) {
      return;
    }


    if (
      cita.estado !== "CONFIRMADA"
    ) {

      toast.warning(
        "Esta cita todavía no está confirmada por enfermería."
      );

      return;
    }


    navigate(
      `/consultas/atender/${cita.id_cita}`
    );

  };



  return {
    citas,
    cargando,
    citaSeleccionada,
    mostrarDetalle,
    busqueda,
    setBusqueda,
    estado,
    setEstado,
    paginaActual,
    setPaginaActual,
    total,
    confirmadas,
    pendientes,
    atendidas,
    citasFiltradas,
    totalPaginas,
    citasPagina,
    atenderCita,
    verConsulta,
    cerrarDetalle,
  };
};

export default useConsultas;
