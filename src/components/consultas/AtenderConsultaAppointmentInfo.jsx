import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaUserMd,
} from "react-icons/fa";

const AtenderConsultaAppointmentInfo = ({
  cita,
  nombreEspecialista,
  especialidad,
  formatearFecha,
  formatearHora,
}) => (
  <section className="atender-seccion">
    <div className="atender-seccion-header">
      <div>
        <span className="atender-seccion-icon">
          <FaCalendarAlt />
        </span>
        <div>
          <h3>Información de la cita</h3>
          <p>Datos de la cita programada</p>
        </div>
      </div>
    </div>
    <div className="cita-info-grid">
      <div>
        <span>Especialista</span>
        <strong>
          <FaUserMd />
          {nombreEspecialista}
        </strong>
      </div>
      <div>
        <span>Especialidad</span>
        <strong>
          <FaStethoscope />
          {especialidad}
        </strong>
      </div>
      <div>
        <span>Fecha</span>
        <strong>
          <FaCalendarAlt />
          {formatearFecha(cita.fecha_cita)}
        </strong>
      </div>
      <div>
        <span>Hora</span>
        <strong>
          <FaClock />
          {formatearHora(cita.hora_inicio)}
        </strong>
      </div>
      <div>
        <span>Tipo de consulta</span>
        <strong>
          {cita.tipo_consulta === "PRIMERA_VEZ"
            ? "Primera vez"
            : "Seguimiento"}
        </strong>
      </div>
      <div>
        <span>Motivo registrado</span>
        <strong>{cita.motivo || "Sin motivo"}</strong>
      </div>
    </div>
  </section>
);

export default AtenderConsultaAppointmentInfo;
