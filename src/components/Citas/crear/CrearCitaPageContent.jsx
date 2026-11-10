import React from "react";
import { FaArrowLeft, FaCalendarCheck } from "react-icons/fa";
import CitaCreationProgress from "./CitaCreationProgress";
import CitaPatientSection from "./CitaPatientSection";
import CitaSpecialtySection from "./CitaSpecialtySection";
import CitaSpecialistSection from "./CitaSpecialistSection";
import CitaScheduleSection from "./CitaScheduleSection";
import CitaExtraInfoSection from "./CitaExtraInfoSection";
import CitaCreationSummary from "./CitaCreationSummary";

const CrearCitaPageContent = ({
  flow,
  formatearFecha,
  formatearHora,
}) => (
  <div className="crear-cita-container">
    <div className="crear-cita-header">
      <button
        type="button"
        className="crear-cita-btn-regresar"
        onClick={flow.volver}
        disabled={flow.guardando}
      >
        <FaArrowLeft />
        <span>Volver a citas</span>
      </button>
      <div className="crear-cita-titulo">
        <div className="crear-cita-icono">
          <FaCalendarCheck />
        </div>
        <div>
          <h1>Nueva cita médica</h1>
          <p>
            Seleccione el paciente, especialista, fecha y horario
          </p>
        </div>
      </div>
    </div>

    <CitaCreationProgress
      paciente={flow.paciente}
      especialidad={flow.especialidad}
      especialista={flow.especialista}
      fecha={flow.fecha}
      horario={flow.horario}
    />

    <div className="crear-cita-layout">
      <main className="crear-cita-contenido">
        <CitaPatientSection flow={flow} />
        <CitaSpecialtySection flow={flow} />
        <CitaSpecialistSection flow={flow} />
        <CitaScheduleSection flow={flow} />
        <CitaExtraInfoSection flow={flow} />
      </main>
      <CitaCreationSummary
        flow={flow}
        formatearFecha={formatearFecha}
        formatearHora={formatearHora}
      />
    </div>
  </div>
);

export default CrearCitaPageContent;
