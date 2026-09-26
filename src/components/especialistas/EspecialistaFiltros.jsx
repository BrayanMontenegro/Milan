import React from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialistaFiltros = ({
  busqueda,
  setBusqueda,
  especialidad,
  setEspecialidad,
  estado,
  setEstado,
  especialidades,
  onLimpiar,
}) => {
  return (
    <div className="especialistas-filtros-card mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaFilter className="text-muted" />

        <h6 className="mb-0">
          Buscar y filtrar especialistas
        </h6>
      </div>

      <div className="row g-3">

        {/* BUSCAR */}
        <div className="col-12 col-lg-5">
          <label className="form-label">
            Buscar
          </label>

          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Nombre, código, teléfono o especialidad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* ESPECIALIDAD */}
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label">
            Especialidad
          </label>

          <select
            className="form-select"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
          >
            <option value="">
              Todas las especialidades
            </option>

            {especialidades.map((item) => (
              <option
                key={item.id_especialidad}
                value={item.id_especialidad}
              >
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* ESTADO */}
        <div className="col-12 col-md-6 col-lg-2">
          <label className="form-label">
            Estado
          </label>

          <select
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>

        {/* LIMPIAR */}
        <div className="col-12 col-lg-2 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onLimpiar}
          >
            <FaTimes className="me-2" />
            Limpiar
          </button>
        </div>

      </div>
    </div>
  );
};

export default EspecialistaFiltros;