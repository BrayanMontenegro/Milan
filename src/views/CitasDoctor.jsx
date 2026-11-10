import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../context/AuthContextValue";
import useCitasDoctor from "./useCitasDoctor";
import CitasDoctorHeader from "../components/citas/doctores/CitaDoctorHeader";
import CitasDoctorAgendaPanel from "../components/citas/doctores/CitasDoctorAgendaPanel";
import CitasDoctorDialogs from "../components/citas/doctores/CitasDoctorDialogs";
import "../styles/Citas.css";

const CitasDoctor = () => {
  const navigate = useNavigate();
  const { usuario, cargando: cargandoAuth } = useAuth();
  const flow = useCitasDoctor(usuario, cargandoAuth, navigate);

  if (cargandoAuth) {
    return (
      <div className="citas-page">
        <div className="container-fluid px-3 px-md-4 py-5">
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "#C6006F" }}
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted mb-0">{"Verificando sesi\u00f3n..."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="citas-page">
        <div className="container-fluid px-3 px-md-4 py-5">
          <div className="alert alert-warning d-flex align-items-center gap-3">
            <FaExclamationTriangle />
            <div>
              <strong>{"Sesi\u00f3n no disponible"}</strong>
              <div>{"No se encontr\u00f3 un usuario autenticado."}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="citas-page">
      <CitasDoctorHeader onNuevaCita={flow.handleNuevaCita} />
      <div className="container-fluid px-3 px-md-4 py-4">
        <CitasDoctorAgendaPanel
          especialista={flow.especialista}
          estadisticas={flow.estadisticas}
          error={flow.error}
          onRetry={flow.cargarCitas}
          filtros={flow.filtros}
          onFiltrosChange={flow.handleFiltrosChange}
          citas={flow.citas}
          cargando={flow.cargando}
          citasFiltradas={flow.citasFiltradas}
          citasPagina={flow.citasPagina}
          onNuevaCita={flow.handleNuevaCita}
          onVer={flow.handleVer}
          onEditar={flow.handleEditar}
          paginaVisible={flow.paginaVisible}
          totalPaginas={flow.totalPaginas}
          onPaginaAnterior={flow.paginaAnterior}
          onPaginaSiguiente={flow.paginaSiguiente}
        />
      </div>
      <CitasDoctorDialogs
        citaSeleccionada={flow.citaSeleccionada}
        mostrarDetalle={flow.mostrarDetalle}
        mostrarEditar={flow.mostrarEditar}
        onCloseDetalle={flow.cerrarDetalle}
        onCloseEditar={flow.cerrarEditar}
        onActualizada={flow.handleActualizada}
      />
    </div>
  );
};

export default CitasDoctor;
