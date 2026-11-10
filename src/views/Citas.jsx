import React from "react";
import { useNavigate } from "react-router-dom";
import useCitas from "./useCitas";
import CitasHeader from "../components/citas/CitasHeader";
import CitasSearchPanel from "../components/citas/CitasSearchPanel";
import CitasResultsPanel from "../components/citas/CitasResultsPanel";
import CitasDialogs from "../components/citas/CitasDialogs";
import "../styles/Citas.css";

const Citas = () => {
  const navigate = useNavigate();
  const flow = useCitas(navigate);

  return (
    <div className="citas-page">
      <CitasHeader onNuevaCita={flow.nuevaCita} />
      <div className="container-fluid px-3 px-md-4 py-4">
        <CitasSearchPanel
          busqueda={flow.busqueda}
          setBusqueda={(value) => flow.cambiarFiltro(flow.setBusqueda, value)}
          fecha={flow.fecha}
          setFecha={(value) => flow.cambiarFiltro(flow.setFecha, value)}
          mes={flow.mes}
          setMes={(value) => flow.cambiarFiltro(flow.setMes, value)}
          diaSemana={flow.diaSemana}
          setDiaSemana={(value) => flow.cambiarFiltro(flow.setDiaSemana, value)}
          especialista={flow.especialista}
          setEspecialista={(value) => flow.cambiarFiltro(flow.setEspecialista, value)}
          especialistas={flow.especialistas}
          onLimpiar={flow.limpiarFiltros}
          total={flow.citasFiltradas.length}
          error={flow.error}
        />
        <CitasResultsPanel
          loading={flow.cargando}
          pageAppointments={flow.citasPagina}
          filteredCount={flow.citasFiltradas.length}
          onClearFilters={flow.limpiarFiltros}
          onView={flow.verCita}
          onEdit={flow.editarCita}
          visiblePage={flow.paginaVisible}
          totalPages={flow.totalPaginas}
          onPreviousPage={() =>
            flow.setPaginaActual(Math.max(1, flow.paginaVisible - 1))
          }
          onNextPage={() =>
            flow.setPaginaActual(Math.min(flow.totalPaginas, flow.paginaVisible + 1))
          }
        />
      </div>
      <CitasDialogs
        citaSeleccionada={flow.citaSeleccionada}
        mostrarDetalle={flow.mostrarDetalle}
        mostrarModal={flow.mostrarModal}
        onCloseDetalle={() => {
          flow.setMostrarDetalle(false);
          flow.setCitaSeleccionada(null);
        }}
        onCloseModal={() => {
          flow.setMostrarModal(false);
          flow.setCitaSeleccionada(null);
        }}
        onActualizada={flow.manejarCitaActualizada}
      />
    </div>
  );
};

export default Citas;
