import React from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes
} from "react-icons/fa";

const PacienteFiltros = ({
  busqueda,
  setBusqueda,
  procedencia,
  setProcedencia,
  estado,
  setEstado,
  procedencias = [],
  onLimpiar
}) => {

  const hayFiltros =
    busqueda ||
    procedencia ||
    estado;

  return (
    <div className="pacientes-filtros">

      {/* Búsqueda */}
      <div className="pacientes-search">

        <FaSearch className="pacientes-search-icon" />

        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o expediente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

      </div>

      {/* Procedencia */}
      <div className="pacientes-filter-select">

        <select
          className="form-select"
          value={procedencia}
          onChange={(e) => setProcedencia(e.target.value)}
        >
          <option value="">
            Todas las procedencias
          </option>

          {procedencias.map((item, index) => (
            <option
              key={index}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>

      </div>

      {/* Estado */}
      <div className="pacientes-filter-select">

        <select
          className="form-select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">
            Todos los estados
          </option>

          <option value="activo">
            Activos
          </option>

          <option value="inactivo">
            Inactivos
          </option>

        </select>

      </div>

      {/* Limpiar */}
      {hayFiltros && (
        <button
          type="button"
          className="btn btn-outline-secondary pacientes-clear-btn"
          onClick={onLimpiar}
        >
          <FaTimes className="me-1" />
          Limpiar
        </button>
      )}

    </div>
  );
};

export default PacienteFiltros; 