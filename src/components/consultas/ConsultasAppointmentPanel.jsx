import React from "react";
import { FaClipboardCheck } from "react-icons/fa";
import ConsultaCard from "./ConsultaCard";
import ConsultaPaginacion from "./ConsultaPaginacion";

const ConsultasAppointmentPanel = ({
  loading,
  filteredAppointments,
  pageAppointments,
  page,
  totalPages,
  onAttend,
  onView,
  onPrevious,
  onNext,
}) => (
  <>
    {loading && (
      <div className="consulta-estado-vista">
        <div className="spinner-border" role="status" />
        <p>Cargando citas de hoy...</p>
      </div>
    )}

    {!loading && filteredAppointments.length === 0 && (
      <div className="consulta-estado-vista">
        <div className="consulta-vacio-icon">
          <FaClipboardCheck />
        </div>
        <h4>No hay citas para mostrar</h4>
        <p>
          No existen citas que coincidan con los filtros seleccionados.
        </p>
      </div>
    )}

    {!loading && pageAppointments.length > 0 && (
      <div className="consultas-lista">
        {pageAppointments.map((cita) => (
          <ConsultaCard
            key={cita.id_cita}
            cita={cita}
            onAtender={onAttend}
            onVer={onView}
          />
        ))}
      </div>
    )}

    {totalPages > 0 && (
      <ConsultaPaginacion
        paginaActual={page}
        totalPaginas={totalPages}
        onAnterior={onPrevious}
        onSiguiente={onNext}
      />
    )}
  </>
);

export default ConsultasAppointmentPanel;
