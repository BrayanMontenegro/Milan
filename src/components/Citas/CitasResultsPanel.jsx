import React from "react";
import { FaCalendarCheck } from "react-icons/fa";
import CitaCard from "./CitaCard";
import CitaPaginacion from "./CitaPaginacion";

const CitasResultsPanel = ({
  loading,
  pageAppointments,
  filteredCount,
  onClearFilters,
  onView,
  onEdit,
  visiblePage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => (
  <>
    {loading ? (
      <div className="citas-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando citas...</p>
      </div>
    ) : pageAppointments.length === 0 ? (
      <div className="citas-empty">
        <div className="citas-empty-icon">
          <FaCalendarCheck />
        </div>
        <h4>No hay citas</h4>
        <p>
          No encontramos citas que coincidan con los filtros seleccionados.
        </p>
        <button
          type="button"
          className="btn btn-milan-primary"
          onClick={onClearFilters}
        >
          Limpiar filtros
        </button>
      </div>
    ) : (
      <div className="row g-4 mt-1">
        {pageAppointments.map((cita) => (
          <div
            className="col-12 col-md-6 col-xl-4"
            key={cita.id_cita}
          >
            <CitaCard cita={cita} onVer={onView} onEditar={onEdit} />
          </div>
        ))}
      </div>
    )}

    {!loading && filteredCount > 0 && (
      <div className="mt-4">
        <CitaPaginacion
          paginaActual={visiblePage}
          totalPaginas={totalPages}
          onPaginaAnterior={onPreviousPage}
          onPaginaSiguiente={onNextPage}
        />
      </div>
    )}
  </>
);

export default CitasResultsPanel;
