import React from "react";
import {
  FaUser,
  FaUserMd,
  FaClock,
  FaStethoscope,
  FaFileMedical,
  FaEye,
  FaEdit,
  FaEllipsisV,
} from "react-icons/fa";

const CitaCard = ({
  cita,
  onVer,
  onEditar,
}) => {
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

    fecha.setHours(
      Number(horas),
      Number(minutos),
      0,
      0
    );

    return fecha.toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    const fechaLocal = new Date(`${fecha}T00:00:00`);

    return fechaLocal.toLocaleDateString("es-NI", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case "PROGRAMADA":
        return "programada";

      case "CONFIRMADA":
        return "confirmada";

      case "COMPLETADA":
        return "completada";

      case "CANCELADA":
        return "cancelada";

      case "NO_ATENDIDA":
        return "no-atendida";

      default:
        return "pendiente";
    }
  };

  const obtenerTextoEstado = (estado) => {
    if (!estado) return "SIN ESTADO";

    return estado.replaceAll("_", " ");
  };

  return (
    <div className="cita-card">

      {/* CABECERA */}
      <div className="cita-card-header">

        <div className="cita-horario">
          <FaClock />

          <div>
            <strong>
              {formatearHora(cita.hora_inicio)}
              {" - "}
              {formatearHora(cita.hora_fin)}
            </strong>

            <small>
              {formatearFecha(cita.fecha_cita)}
            </small>
          </div>
        </div>

        <span
          className={`cita-estado ${obtenerClaseEstado(
            cita.estado
          )}`}
        >
          {obtenerTextoEstado(cita.estado)}
        </span>

      </div>

      {/* PACIENTE */}
      <div className="cita-card-paciente">

        <div className="cita-paciente-avatar">
          <FaUser />
        </div>

        <div className="cita-paciente-info">

          <span className="cita-label">
            Paciente
          </span>

          <strong>
            {nombrePaciente || "Paciente no disponible"}
          </strong>

          <small>
            {paciente.codigo_expediente ||
              "Sin expediente"}
          </small>

        </div>

      </div>

      {/* ESPECIALISTA */}
      <div className="cita-card-especialista">

        <div className="cita-info-icon">
          <FaUserMd />
        </div>

        <div>
          <span className="cita-label">
            Especialista
          </span>

          <strong>
            {nombreEspecialista ||
              "Sin especialista"}
          </strong>

          <small>
            {especialidad.nombre ||
              "Sin especialidad"}
          </small>
        </div>

      </div>

      {/* MOTIVO */}
      <div className="cita-card-motivo">

        <div className="cita-info-icon">
          <FaFileMedical />
        </div>

        <div>
          <span className="cita-label">
            Motivo de consulta
          </span>

          <p>
            {cita.motivo ||
              "Sin motivo registrado"}
          </p>
        </div>

      </div>

      {/* TIPO */}
      {cita.tipo_consulta && (
        <div className="cita-tipo-consulta">
          <FaStethoscope />

          <span>
            {cita.tipo_consulta.replaceAll(
              "_",
              " "
            )}
          </span>
        </div>
      )}

      {/* ACCIONES */}
      <div className="cita-card-footer">

        <button
          type="button"
          className="btn btn-sm btn-light cita-action-btn"
          title="Ver cita"
          onClick={() => onVer?.(cita)}
        >
          <FaEye />
          <span>Ver</span>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light cita-action-btn"
          title="Editar cita"
          onClick={() => onEditar?.(cita)}
        >
          <FaEdit />
          <span>Editar</span>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light cita-action-btn cita-more-btn"
          title="Más opciones"
        >
          <FaEllipsisV />
        </button>

      </div>

    </div>
  );
};

export default CitaCard;