import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const CitasDoctorOverview = ({ especialista, estadisticas }) => (
  <>
    {especialista && (
      <div className="citas-doctor-info mb-4">
        <div className="citas-doctor-info-icon">
          <FaCalendarAlt />
        </div>
        <div className="citas-doctor-info-content">
          <span>Agenda del especialista</span>
          <strong>
            {especialista.nombres} {especialista.apellidos}
          </strong>
          <small>
            {especialista.especialidades?.nombre ||
              "Especialidad no disponible"}
          </small>
        </div>
      </div>
    )}
    <div className="row g-3 mb-4">
      {[
        ["Total", estadisticas.total],
        ["Programadas", estadisticas.programadas],
        ["Confirmadas", estadisticas.confirmadas],
        ["Atendidas", estadisticas.atendidas],
      ].map(([label, count]) => (
        <div className="col-6 col-md-3" key={label}>
          <div className="citas-stat-card">
            <span>{label}</span>
            <strong>{count}</strong>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default CitasDoctorOverview;
