import React from "react";
import {
  FaSearch,
  FaTimes,
  FaFilter,
} from "react-icons/fa";

const EnfermeriaFiltros = ({
  busqueda,
  setBusqueda,
  totalResultados,
}) => {
  const limpiarBusqueda = () => {
    setBusqueda("");
  };

  return (
    <div className="enfermeria-filtros">
      <div className="enfermeria-filtros-header">
        <div className="enfermeria-filtros-title">
          <FaFilter />
          <span>Citas programadas para hoy</span>
        </div>

        <span className="enfermeria-resultados">
          {totalResultados}{" "}
          {totalResultados === 1 ? "cita encontrada" : "citas encontradas"}
        </span>
      </div>

      <label className="form-label" htmlFor="enfermeria-busqueda">
        Buscar paciente
      </label>
      <div className="enfermeria-busqueda">
        <FaSearch />

        <input
          id="enfermeria-busqueda"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por paciente, expediente o especialista..."
        />

        {busqueda && (
          <button
            type="button"
            className="enfermeria-limpiar"
            onClick={limpiarBusqueda}
            title="Limpiar búsqueda"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default EnfermeriaFiltros;