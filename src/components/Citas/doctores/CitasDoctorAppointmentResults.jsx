import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import CitaCard from "../CitaCard";
import CitaPaginacion from "../CitaPaginacion";

const CitasDoctorAppointmentResults = ({
  citas,
  loading,
  filteredAppointments,
  pageAppointments,
  onNuevaCita,
  onVer,
  onEditar,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#C6006F" }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-3">Cargando tus citas...</p>
      </div>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <div className="citas-empty">
        <div className="citas-empty-icon">
          <FaCalendarAlt />
        </div>
        <h4>
          {citas.length === 0
            ? "No tienes citas registradas"
            : "No se encontraron citas"}
        </h4>
        <p>
          {citas.length === 0
            ? "Actualmente no existen citas asignadas a tu agenda."
            : "Prueba modificando los filtros de búsqueda."}
        </p>
        {citas.length === 0 && (
          <button
            type="button"
            className="btn btn-milan-primary"
            onClick={onNuevaCita}
          >
            Nueva cita
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <div>
          <h5 className="mb-1">Mis citas</h5>
          <span className="text-muted small">
            {filteredAppointments.length}{" "}
            {filteredAppointments.length === 1
              ? "cita encontrada"
              : "citas encontradas"}
          </span>
        </div>
        <span className="text-muted small">
          Página {page} de {totalPages}
        </span>
      </div>
      <div className="row g-4">
        {pageAppointments.map((cita) => (
          <div
            className="col-12 col-md-6 col-xl-4"
            key={cita.id_cita}
          >
            <CitaCard cita={cita} onVer={onVer} onEditar={onEditar} />
          </div>
        ))}
      </div>
      <CitaPaginacion
        paginaActual={page}
        totalPaginas={totalPages}
        onPaginaAnterior={onPreviousPage}
        onPaginaSiguiente={onNextPage}
      />
    </>
  );
};

export default CitasDoctorAppointmentResults;
