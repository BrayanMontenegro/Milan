import React from "react";
import { FaFileMedical, FaUser } from "react-icons/fa";

const AtenderConsultaPatientSummary = ({
  paciente,
  nombrePaciente,
  calcularEdad,
  onVerExpediente,
}) => (
  <section className="atender-seccion paciente-principal">
    <div className="atender-paciente-identidad">
      <div className="atender-paciente-avatar">
        <FaUser />
      </div>
      <div>
        <span className="atender-label">PACIENTE</span>
        <h2>{nombrePaciente}</h2>
        <div className="atender-paciente-datos">
          <span>
            Expediente:<strong>{paciente.codigo_expediente}</strong>
          </span>
          <span>
            Edad:
            <strong>{calcularEdad(paciente.fecha_nacimiento)} años</strong>
          </span>
          <span>
            Sexo:<strong>{paciente.sexo || "-"}</strong>
          </span>
        </div>
      </div>
    </div>
    <button
      type="button"
      className="btn-ver-expediente"
      onClick={onVerExpediente}
    >
      <FaFileMedical />
      Ver expediente
    </button>
  </section>
);

export default AtenderConsultaPatientSummary;
