import React from "react";
import {
  FaUser,
  FaUserMd,
  FaClock,
  FaStethoscope,
  FaNotesMedical,
  FaHeartbeat,
} from "react-icons/fa";

const EnfermeriaCard = ({ cita, onTomarSignos }) => {
  if (!cita) return null;

  const paciente = cita.pacientes || {};
  const especialista = cita.especialistas || {};
  const especialidad = especialista.especialidades || {};

  const nombrePaciente =
    `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim();

  const nombreEspecialista =
    `${especialista.nombres || ""} ${especialista.apellidos || ""}`.trim();

  const formatearHora = (hora) => {
    if (!hora) return "--:--";

    const [horas, minutos] = hora.split(":");

    const fecha = new Date();
    fecha.setHours(Number(horas), Number(minutos), 0, 0);

    return fecha.toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatearTipoConsulta = (tipo) => {
    if (!tipo) return "Consulta";

    return tipo
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  };

  return (
    <div className="enfermeria-card">

      {/* HEADER */}
      <div className="enfermeria-card-header">

        <div className="enfermeria-card-hora">
          <div className="enfermeria-hora-icon">
            <FaClock />
          </div>

          <div>
            <strong>{formatearHora(cita.hora_inicio)}</strong>

            {cita.hora_fin && (
              <small>
                hasta {formatearHora(cita.hora_fin)}
              </small>
            )}
          </div>
        </div>

        <span className="enfermeria-estado">
          PROGRAMADA
        </span>

      </div>

      {/* PACIENTE */}
      <div className="enfermeria-paciente">

        <div className="enfermeria-paciente-avatar">
          <FaUser />
        </div>

        <div className="enfermeria-paciente-info">

          <span>Paciente</span>

          <strong>
            {nombrePaciente || "Paciente no disponible"}
          </strong>

          <small>
            {paciente.codigo_expediente || "Sin expediente"}
          </small>

        </div>

      </div>

      {/* ESPECIALISTA */}
      <div className="enfermeria-info-row">

        <div className="enfermeria-info-icon">
          <FaUserMd />
        </div>

        <div>
          <span>Especialista</span>

          <strong>
            {nombreEspecialista || "Sin especialista"}
          </strong>

          <small>
            {especialidad.nombre || "Especialidad no disponible"}
          </small>
        </div>

      </div>

      {/* TIPO DE CONSULTA */}
      <div className="enfermeria-info-row">

        <div className="enfermeria-info-icon">
          <FaStethoscope />
        </div>

        <div>
          <span>Tipo de consulta</span>

          <strong>
            {formatearTipoConsulta(cita.tipo_consulta)}
          </strong>
        </div>

      </div>

      {/* MOTIVO */}
      <div className="enfermeria-motivo">

        <div className="enfermeria-info-icon">
          <FaNotesMedical />
        </div>

        <div>
          <span>Motivo registrado</span>

          <p>
            {cita.motivo || "Sin motivo registrado"}
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="enfermeria-card-footer">

        <button
          type="button"
          className="btn enfermeria-btn-signos"
          onClick={() => onTomarSignos?.(cita)}
        >
          <FaHeartbeat className="me-2" />
          Tomar signos vitales
        </button>

      </div>

    </div>
  );
};

export default EnfermeriaCard;