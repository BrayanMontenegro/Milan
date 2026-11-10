import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { FaNotesMedical } from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "../database/supabase";

import RegistrosEnfermeriaContenido from "../components/enfermera/registros/RegistrosEnfermeriaContenido";
import RegistroEnfermeriaDetalle from "../components/enfermera/registros/RegistroEnfermeriaDetalle";
import "../styles/RegistrosEnfermeria.css";

const REGISTROS_POR_PAGINA = 10;

const RegistrosEnfermeria = () => {
  const {
    busqueda,
    setBusqueda,
    fecha,
    setFecha,
    registrosFiltrados,
    registrosPagina,
    cargando,
    paginaVisible,
    totalPaginas,
    cambiarFiltro,
    verRegistro,
    paginaAnterior,
    paginaSiguiente,
    mostrarDetalle,
    registroSeleccionado,
    cerrarDetalle
  } = useRegistrosEnfermeriaController();

  return (

    <div className="registros-enfermeria-page">

      {/* HEADER */}

      <div className="registros-enfermeria-header">

        <div className="container-fluid px-3 px-md-4">

          <div className="d-flex align-items-center gap-3">

            <div className="registros-enfermeria-header-icon">
              <FaNotesMedical />
            </div>

            <div>

              <h2>
                Registros de Enfermería
              </h2>

              <p>
                Historial de signos vitales y registros
                realizados por el personal de enfermería
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* CONTENIDO */}

      <RegistrosEnfermeriaContenido
        busqueda={busqueda}
        cambiarFiltro={cambiarFiltro}
        setBusqueda={setBusqueda}
        fecha={fecha}
        setFecha={setFecha}
        totalResultados={registrosFiltrados.length}
        cargando={cargando}
        registrosPagina={registrosPagina}
        onVerRegistro={verRegistro}
        paginaVisible={paginaVisible}
        totalPaginas={totalPaginas}
        paginaAnterior={paginaAnterior}
        paginaSiguiente={paginaSiguiente}
      />


      {/* DETALLE */}

      {mostrarDetalle &&
        registroSeleccionado && (

          <RegistroEnfermeriaDetalle
            registro={registroSeleccionado}
            onCerrar={cerrarDetalle}
          />

        )}

    </div>

  );
};


const useRegistrosEnfermeriaController = () => {

  const [registros, setRegistros] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);

  const [
    registroSeleccionado,
    setRegistroSeleccionado,
  ] = useState(null);

  const [
    mostrarDetalle,
    setMostrarDetalle,
  ] = useState(false);


  /* =====================================================
     CARGAR REGISTROS
     ===================================================== */

  const cargarRegistros = async () => {

    try {

      setCargando(true);

      const { data, error } = await supabase
        .from("registros_enfermeria")
        .select(`
          id_registro_enfermeria,
          id_paciente,
          id_usuario,
          fecha_registro,
          peso,
          talla,
          temperatura,
          presion_arterial,
          frecuencia_cardiaca,
          frecuencia_respiratoria,
          saturacion_oxigeno,
          motivo_consulta,
          observaciones,

          pacientes (
            id_paciente,
            codigo_expediente,
            nombres,
            apellidos
          ),

          usuarios (
            id_usuario,
            nombres,
            apellidos
          )
        `)
        .order("fecha_registro", {
          ascending: false,
        });

      if (error) {

        console.error(
          "Error cargando registros:",
          error
        );

        toast.error(
          "No se pudieron cargar los registros de enfermería."
        );

        return;
      }

      setRegistros(data || []);

    } catch (error) {

      console.error(
        "Error inesperado:",
        error
      );

      toast.error(
        "Ocurrió un error al cargar los registros."
      );

    } finally {

      setCargando(false);

    }

  };


  useEffect(() => {
    cargarRegistros();
  }, []);


  /* =====================================================
     FILTRADO
     ===================================================== */

  const registrosFiltrados = useMemo(() => {

    const texto =
      busqueda.trim().toLowerCase();

    return registros.filter((registro) => {

      const paciente =
        registro.pacientes || {};

      const usuario =
        registro.usuarios || {};

      const nombrePaciente =
        `${paciente.nombres || ""} ${
          paciente.apellidos || ""
        }`.toLowerCase();

      const nombreUsuario =
        `${usuario.nombres || ""} ${
          usuario.apellidos || ""
        }`.toLowerCase();

      const expediente =
        (
          paciente.codigo_expediente || ""
        ).toLowerCase();

      const fechaRegistro =
        registro.fecha_registro
          ? registro.fecha_registro.substring(
              0,
              10
            )
          : "";

      const coincideBusqueda =
        !texto ||
        nombrePaciente.includes(texto) ||
        nombreUsuario.includes(texto) ||
        expediente.includes(texto);

      const coincideFecha =
        !fecha ||
        fechaRegistro === fecha;

      return (
        coincideBusqueda &&
        coincideFecha
      );

    });

  }, [
    registros,
    busqueda,
    fecha,
  ]);


  /* =====================================================
     PAGINACIÓN
     ===================================================== */

  const totalPaginas = Math.ceil(
    registrosFiltrados.length /
      REGISTROS_POR_PAGINA
  );

  const paginaVisible = Math.min(
    paginaActual,
    Math.max(1, totalPaginas)
  );

  const indiceInicio =
    (paginaVisible - 1) *
    REGISTROS_POR_PAGINA;

  const registrosPagina =
    registrosFiltrados.slice(
      indiceInicio,
      indiceInicio +
        REGISTROS_POR_PAGINA
    );


  const cambiarFiltro = (actualizarFiltro, valor) => {
    actualizarFiltro(valor);
    setPaginaActual(1);
  };


  /* =====================================================
     DETALLE
     ===================================================== */

  const verRegistro = (registro) => {

    setRegistroSeleccionado(registro);
    setMostrarDetalle(true);

  };


  const cerrarDetalle = () => {

    setMostrarDetalle(false);
    setRegistroSeleccionado(null);

  };


  /* =====================================================
     PAGINACIÓN
     ===================================================== */

  const paginaAnterior = () => {

    setPaginaActual(Math.max(paginaVisible - 1, 1));

  };


  const paginaSiguiente = () => {

    setPaginaActual(Math.min(paginaVisible + 1, totalPaginas));

  };


  /* =====================================================
     RENDER
     ===================================================== */

  return {
    busqueda,
    setBusqueda,
    fecha,
    setFecha,
    registrosFiltrados,
    registrosPagina,
    cargando,
    paginaVisible,
    totalPaginas,
    cambiarFiltro,
    verRegistro,
    paginaAnterior,
    paginaSiguiente,
    mostrarDetalle,
    registroSeleccionado,
    cerrarDetalle
  };
};
export default RegistrosEnfermeria;