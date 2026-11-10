import React from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

const ConsultaFiltros = ({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
  mostrarEstado = true,
  mostrarFechas = false,
  fechaDesde = "",
  setFechaDesde,
  fechaHasta = "",
  setFechaHasta,
}) => {

  const limpiar = () => {
    setBusqueda("");
    setEstado("TODOS");
    setFechaDesde?.("");
    setFechaHasta?.("");
  };

  const hayFiltros =
    busqueda ||
    (mostrarEstado && estado !== "TODOS") ||
    fechaDesde ||
    fechaHasta;

  return (
    <div className="consulta-filtros">

      <div className="consulta-filtros-titulo">
        <FaFilter />
        <span>Filtros de consultas</span>
      </div>

      <div className="row g-3">

        <div className={`col-12 ${mostrarEstado ? "col-md-7" : "col-md-12"}`}>

          <label className="form-label" htmlFor="consultas-busqueda">
            Buscar paciente
          </label>

          <div className="consulta-busqueda">

            <FaSearch />

            <input
              id="consultas-busqueda"
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar paciente, expediente, especialista..."
            />

            {busqueda && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setBusqueda("")}
              >
                <FaTimes />
              </button>
            )}

          </div>

        </div>

        {mostrarEstado && (
          <div className="col-12 col-md-5">
            <label className="form-label" htmlFor="consultas-estado">
              Estado
            </label>
            <select
              id="consultas-estado"
              className="form-select consulta-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="CONFIRMADA">Listos para consulta</option>
              <option value="PROGRAMADA">Pendientes de enfermería</option>
              <option value="ATENDIDA">Atendidos</option>
              <option value="CANCELADA">Cancelados</option>
              <option value="NO_ASISTIO">No asistieron</option>
            </select>
          </div>
        )}

        {mostrarFechas && (
          <>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="consultas-fecha-desde">
                Desde
              </label>
              <input
                id="consultas-fecha-desde"
                className="form-control consulta-select"
                type="date"
                value={fechaDesde}
                max={fechaHasta || undefined}
                onChange={(event) => setFechaDesde?.(event.target.value)}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="consultas-fecha-hasta">
                Hasta
              </label>
              <input
                id="consultas-fecha-hasta"
                className="form-control consulta-select"
                type="date"
                value={fechaHasta}
                min={fechaDesde || undefined}
                onChange={(event) => setFechaHasta?.(event.target.value)}
              />
            </div>
          </>
        )}

      </div>

      {hayFiltros && (
        <button
          type="button"
          className="consulta-limpiar"
          onClick={limpiar}
        >
          <FaTimes />
          Limpiar filtros
        </button>
      )}

    </div>
  );
};

export default ConsultaFiltros;