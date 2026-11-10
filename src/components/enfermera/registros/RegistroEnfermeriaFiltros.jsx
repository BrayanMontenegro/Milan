import React from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaTimes,
  FaFilter,
} from "react-icons/fa";

const RegistroEnfermeriaFiltros = ({
  busqueda,
  setBusqueda,
  fecha,
  setFecha,
  totalResultados,
}) => {
  const limpiarFiltros = () => {
    setBusqueda("");
    setFecha("");
  };

  const hayFiltros = busqueda || fecha;

  return (
    <div className="registro-enfermeria-filtros">

      <div className="registro-enfermeria-filtros-header">
        <div className="registro-enfermeria-filtros-title">
          <FaFilter />
          <span>Filtros de registros</span>
        </div>

        <span className="registro-enfermeria-resultados">
          {totalResultados}{" "}
          {totalResultados === 1
            ? "registro encontrado"
            : "registros encontrados"}
        </span>
      </div>

      <div className="row g-3">

        <div className="col-12 col-md-7">
          <label className="form-label" htmlFor="registro-enfermeria-busqueda">
            Buscar registros
          </label>
          <div className="registro-enfermeria-busqueda">
            <FaSearch />

            <input
              id="registro-enfermeria-busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar paciente, expediente o enfermero..."
            />

            {busqueda && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setBusqueda("")}
                title="Limpiar búsqueda"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className="col-12 col-md-5">
          <label className="form-label" htmlFor="registro-enfermeria-fecha">
            Fecha
          </label>
          <div className="registro-enfermeria-fecha">
            <FaCalendarAlt />

            <input
              id="registro-enfermeria-fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

            {fecha && (
              <button
                type="button"
                aria-label="Limpiar fecha"
                onClick={() => setFecha("")}
                title="Limpiar fecha"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

      </div>

      {hayFiltros && (
        <button
          type="button"
          className="registro-enfermeria-limpiar-filtros"
          onClick={limpiarFiltros}
        >
          <FaTimes className="me-2" />
          Limpiar filtros
        </button>
      )}

    </div>
  );
};

export default RegistroEnfermeriaFiltros;