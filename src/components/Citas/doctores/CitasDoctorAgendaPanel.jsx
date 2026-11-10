import React from "react";
import CitaFiltros from "../CitaFiltros";
import CitasDoctorOverview from "./CitasDoctorOverview";
import CitasDoctorLoadError from "./CitasDoctorLoadError";
import CitasDoctorAppointmentResults from "./CitasDoctorAppointmentResults";

const CitasDoctorAgendaPanel = (props) => (
  <>
    <CitasDoctorOverview
      especialista={props.especialista}
      estadisticas={props.estadisticas}
    />
    <CitasDoctorLoadError error={props.error} onRetry={props.onRetry} />
    <CitaFiltros
      filtros={props.filtros}
      onFiltrosChange={props.onFiltrosChange}
      citas={props.citas}
    />
    <CitasDoctorAppointmentResults
      citas={props.citas}
      loading={props.cargando}
      filteredAppointments={props.citasFiltradas}
      pageAppointments={props.citasPagina}
      onNuevaCita={props.onNuevaCita}
      onVer={props.onVer}
      onEditar={props.onEditar}
      page={props.paginaVisible}
      totalPages={props.totalPaginas}
      onPreviousPage={props.onPaginaAnterior}
      onNextPage={props.onPaginaSiguiente}
    />
  </>
);

export default CitasDoctorAgendaPanel;
