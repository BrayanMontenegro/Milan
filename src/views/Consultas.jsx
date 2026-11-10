import React from "react";
import { useNavigate } from "react-router-dom";
import useConsultas from "./useConsultas";
import ConsultaHeader from "../components/consultas/ConsultaHeader";
import ConsultaFiltros from "../components/consultas/ConsultaFiltros";
import ConsultaDetalle from "../components/consultas/ConsultaDetalle";
import ConsultasAppointmentPanel from "../components/consultas/ConsultasAppointmentPanel";
import "../styles/Consultas.css";

const Consultas = () => {
  const navigate = useNavigate();
  const flow = useConsultas(navigate);

  return (
    <div className="consultas-page">
      <ConsultaHeader
        total={flow.total}
        confirmadas={flow.confirmadas}
        pendientes={flow.pendientes}
        atendidas={flow.atendidas}
      />
      <main className="container-fluid px-3 px-md-4 py-4">
        <ConsultaFiltros
          busqueda={flow.busqueda}
          setBusqueda={flow.setBusqueda}
          estado={flow.estado}
          setEstado={flow.setEstado}
        />
        <ConsultasAppointmentPanel
          loading={flow.cargando}
          filteredAppointments={flow.citasFiltradas}
          pageAppointments={flow.citasPagina}
          page={flow.paginaActual}
          totalPages={flow.totalPaginas}
          onAttend={flow.atenderCita}
          onView={flow.verConsulta}
          onPrevious={() =>
            flow.setPaginaActual((page) => Math.max(page - 1, 1))
          }
          onNext={() =>
            flow.setPaginaActual((page) => Math.min(page + 1, flow.totalPaginas))
          }
        />
      </main>
      {flow.mostrarDetalle && flow.citaSeleccionada && (
        <ConsultaDetalle
          cita={flow.citaSeleccionada}
          onCerrar={flow.cerrarDetalle}
        />
      )}
    </div>
  );
};

export default Consultas;
