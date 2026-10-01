
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaExclamationTriangle } from "react-icons/fa";
import { supabase } from "../database/supabase";

import CitasHeader from "../components/Citas/CitasHeader";
import CitaFiltros from "../components/Citas/CitaFiltros";
import CitaCard from "../components/Citas/CitaCard";
import CitaPaginacion from "../components/Citas/CitaPaginacion";

// Si todavía no tienes estos componentes,
// puedes comentar temporalmente sus imports.
import CitaDetalle from "../components/Citas/CitaDetalles";
import CitaModal from "../components/Citas/CitaModal";

import "../styles/Citas.css";

const CITAS_POR_PAGINA = 9;

const Citas = () => {
  const navigate = useNavigate();

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

  const citasPagina = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      CITAS_POR_PAGINA;

    const fin =
      inicio + CITAS_POR_PAGINA;

    return citasFiltradas.slice(
      inicio,
      fin
    );
  }, [
    citasFiltradas,
    paginaActual,
  ]);

  /* =====================================================
     REINICIAR PÁGINA AL FILTRAR
  ===================================================== */

  useEffect(() => {
    setPaginaActual(1);
  }, [
    busqueda,
    fecha,
    mes,
    diaSemana,
    especialista,
  ]);

  /* =====================================================
     CORREGIR PÁGINA SI QUEDA FUERA DE RANGO
  ===================================================== */

  useEffect(() => {
    if (
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas);
    }
  }, [
    paginaActual,
    totalPaginas,
  ]);

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

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="citas-page">

      {/* HEADER */}
      <CitasHeader
        onNuevaCita={nuevaCita}
      />

      <div className="container-fluid px-3 px-md-4 py-4">

        {/* FILTROS */}
        <CitaFiltros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          fecha={fecha}
          setFecha={setFecha}
          mes={mes}
          setMes={setMes}
          diaSemana={diaSemana}
          setDiaSemana={setDiaSemana}
          especialista={especialista}
          setEspecialista={setEspecialista}
          especialistas={especialistas}
          onLimpiar={limpiarFiltros}
        />

        {/* RESUMEN */}
        <div className="citas-resumen mt-4">

          <div className="citas-resumen-icon">
            <FaCalendarCheck />
          </div>

          <div>
            <strong>
              {citasFiltradas.length}
            </strong>

            <span>
              {citasFiltradas.length === 1
                ? " cita encontrada"
                : " citas encontradas"}
            </span>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mt-4"
            role="alert"
          >
            <FaExclamationTriangle />

            <span>
              {error}
            </span>
          </div>
        )}

        {/* CARGANDO */}
        {cargando ? (
          <div className="citas-loading">

            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Cargando...
              </span>
            </div>

            <p>
              Cargando citas...
            </p>

          </div>
        ) : citasPagina.length === 0 ? (

          /* SIN RESULTADOS */
          <div className="citas-empty">

            <div className="citas-empty-icon">
              <FaCalendarCheck />
            </div>

            <h4>
              No hay citas
            </h4>

            <p>
              No encontramos citas que
              coincidan con los filtros
              seleccionados.
            </p>

            <button
              type="button"
              className="btn btn-milan-primary"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>

          </div>

        ) : (

          /* CATÁLOGO */
          <div className="row g-4 mt-1">

            {citasPagina.map((cita) => (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={cita.id_cita}
              >
                <CitaCard
                  cita={cita}
                  onVer={verCita}
                  onEditar={editarCita}
                />
              </div>
            ))}

          </div>
        )}

        {/* PAGINACIÓN */}
        {!cargando &&
          citasFiltradas.length > 0 && (
            <div className="mt-4">
              <CitaPaginacion
                paginaActual={
                  paginaActual
                }
                totalPaginas={
                  totalPaginas
                }
                onPaginaAnterior={() =>
                  setPaginaActual(
                    (pagina) =>
                      Math.max(
                        1,
                        pagina - 1
                      )
                  )
                }
                onPaginaSiguiente={() =>
                  setPaginaActual(
                    (pagina) =>
                      Math.min(
                        totalPaginas,
                        pagina + 1
                      )
                  )
                }
              />
            </div>
          )}

      </div>

      {/* DETALLE */}
      {mostrarDetalle && (
        <CitaDetalle
          cita={citaSeleccionada}
          onCerrar={() => {
            setMostrarDetalle(false);
            setCitaSeleccionada(null);
          }}
        />
      )}

      {/* EDITAR */}
      {mostrarModal && (
        <CitaModal
          cita={citaSeleccionada}
          onCerrar={() => {
            setMostrarModal(false);
            setCitaSeleccionada(null);
          }}
          onGuardado={
            manejarCitaActualizada
          }
        />
      )}

    </div>
  );
};

export default Citas;
