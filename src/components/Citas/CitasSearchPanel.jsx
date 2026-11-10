import React from "react";
import { FaCalendarCheck, FaExclamationTriangle } from "react-icons/fa";
import CitaFiltros from "./CitaFiltros";

const CitasSearchPanel = ({
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
  especialistas,
  onLimpiar,
  total,
  error,
}) => (
  <>
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
      onLimpiar={onLimpiar}
    />

    <div className="citas-resumen mt-4">
      <div className="citas-resumen-icon">
        <FaCalendarCheck />
      </div>
      <div>
        <strong>{total}</strong>
        <span>{total === 1 ? " cita encontrada" : " citas encontradas"}</span>
      </div>
    </div>

    {error && (
      <div
        className="alert alert-danger d-flex align-items-center gap-2 mt-4"
        role="alert"
      >
        <FaExclamationTriangle />
        <span>{error}</span>
      </div>
    )}
  </>
);

export default CitasSearchPanel;
