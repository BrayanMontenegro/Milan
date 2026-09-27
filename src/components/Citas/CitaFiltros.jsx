import React from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaUserMd,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

const CitaFiltros = ({
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
  especialistas = [],
  onLimpiar,
}) => {
  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const diasSemana = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Lunes" },
    { value: "2", label: "Martes" },
    { value: "3", label: "Miércoles" },
    { value: "4", label: "Jueves" },
    { value: "5", label: "Viernes" },
    { value: "6", label: "Sábado" },
  ];

  return (
    <div className="cita-filtros">

      <div className="cita-filtros-header">
        <div className="cita-filtros-title">
          <FaFilter />
          <span>Buscar y filtrar citas</span>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary cita-limpiar-btn"
          onClick={onLimpiar}
        >
          <FaTimes className="me-1" />
          Limpiar
        </button>
      </div>

      <div className="row g-3">

        {/* BUSCAR */}
        <div className="col-12 col-lg-4">
          <label className="form-label">
            Buscar paciente
          </label>

          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Nombre o código de expediente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* FECHA */}
        <div className="col-12 col-md-6 col-lg-2">
          <label className="form-label">
            Fecha
          </label>

          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>

            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>

        {/* MES */}
        <div className="col-12 col-md-6 col-lg-2">
          <label className="form-label">
            Mes
          </label>

          <select
            className="form-select"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Todos los meses</option>

            {meses.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* DÍA */}
        <div className="col-12 col-md-6 col-lg-2">
          <label className="form-label">
            Día de la semana
          </label>

          <select
            className="form-select"
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
          >
            <option value="">Todos los días</option>

            {diasSemana.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* ESPECIALISTA */}
        <div className="col-12 col-md-6 col-lg-2">
          <label className="form-label">
            Especialista
          </label>

          <div className="input-group">
            <span className="input-group-text">
              <FaUserMd />
            </span>

            <select
              className="form-select"
              value={especialista}
              onChange={(e) =>
                setEspecialista(e.target.value)
              }
            >
              <option value="">
                Todos
              </option>

              {especialistas.map((item) => (
                <option
                  key={item.id_especialista}
                  value={item.id_especialista}
                >
                  Dr. {item.nombres} {item.apellidos}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CitaFiltros;