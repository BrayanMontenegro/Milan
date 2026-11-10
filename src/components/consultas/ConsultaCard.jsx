import React from "react";
import {
  FaUser,
  FaUserMd,
  FaClock,
  FaStethoscope,
  FaNotesMedical,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlay,
  FaEye,
} from "react-icons/fa";

const ConsultaCard = ({
  cita,
  onAtender,
  onVer,
}) => {

  const paciente = cita.pacientes || {};
  const especialista = cita.especialistas || {};

  const especialidad =
    especialista.especialidades?.nombre ||
    "Sin especialidad";

  const nombrePaciente =
    `${paciente.nombres || ""} ${
      paciente.apellidos || ""
    }`.trim();

  const nombreEspecialista =
    `${especialista.nombres || ""} ${
      especialista.apellidos || ""
    }`.trim();

  const formatearHora = (hora) => {

    if (!hora) return "--:--";

    const [horas, minutos] =
      hora.split(":");

    const fecha = new Date();

    fecha.setHours(
      Number(horas),
      Number(minutos),
      0,
      0
    );

    return fecha.toLocaleTimeString(
      "es-NI",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  const obtenerEstado = () => {

    switch (cita.estado) {

      case "CONFIRMADA":
        return {
          texto: "LISTO PARA CONSULTA",
          clase: "confirmada",
          icono: <FaCheckCircle />,
        };

      case "ATENDIDA":
        return {
          texto: "ATENDIDA",
          clase: "atendida",
          icono: <FaCheckCircle />,
        };

      case "PROGRAMADA":
        return {
          texto: "PENDIENTE DE ENFERMERÍA",
          clase: "programada",
          icono: <FaHourglassHalf />,
        };

      case "CANCELADA":
        return {
          texto: "CANCELADA",
          clase: "cancelada",
          icono: <FaHourglassHalf />,
        };

      case "NO_ASISTIO":
        return {
          texto: "NO ASISTIÓ",
          clase: "no-asistio",
          icono: <FaHourglassHalf />,
        };

      default:
        return {
          texto: cita.estado,
          clase: "programada",
          icono: <FaHourglassHalf />,
        };
    }
  };

  const estado = obtenerEstado();

  return (
    <div
      className={`consulta-card consulta-card-${estado.clase}`}
    >

      {/* HORA */}

      <div className="consulta-card-hora">

        <FaClock />

        <strong>
          {formatearHora(
            cita.hora_inicio
          )}
        </strong>

        {cita.hora_fin && (
          <span>
            hasta{" "}
            {formatearHora(
              cita.hora_fin
            )}
          </span>
        )}

      </div>


      {/* CONTENIDO */}

      <div className="consulta-card-contenido">

        <div className="consulta-card-principal">

          <div className="consulta-paciente-icon">
            <FaUser />
          </div>

          <div>

            <h4>
              {nombrePaciente ||
                "Paciente no disponible"}
            </h4>

            <span className="consulta-expediente">
              {paciente.codigo_expediente ||
                "Sin expediente"}
            </span>

          </div>

        </div>


        {/* ESPECIALISTA */}

        <div className="consulta-card-info">

          <div className="consulta-info-item">

            <FaUserMd />

            <div>
              <span>Especialista</span>

              <strong>
                {nombreEspecialista ||
                  "No disponible"}
              </strong>
            </div>

          </div>


          <div className="consulta-info-item">

            <FaStethoscope />

            <div>
              <span>Especialidad</span>

              <strong>
                {especialidad}
              </strong>
            </div>

          </div>


          <div className="consulta-info-item">

            <FaNotesMedical />

            <div>
              <span>Motivo</span>

              <strong>
                {cita.motivo ||
                  "Sin motivo registrado"}
              </strong>
            </div>

          </div>

        </div>

      </div>


      {/* ESTADO */}

      <div className="consulta-card-acciones">

        <span
          className={`consulta-estado consulta-estado-${estado.clase}`}
        >
          {estado.icono}
          {estado.texto}
        </span>


        {cita.estado === "CONFIRMADA" && (
          <button
            type="button"
            className="consulta-btn-atender"
            onClick={() =>
              onAtender?.(cita)
            }
          >
            <FaPlay />
            Atender
          </button>
        )}


        {cita.estado === "ATENDIDA" && (
          <button
            type="button"
            className="consulta-btn-ver"
            onClick={() =>
              onVer?.(cita)
            }
          >
            <FaEye />
            Ver consulta
          </button>
        )}

      </div>

    </div>
  );
};

export default ConsultaCard;