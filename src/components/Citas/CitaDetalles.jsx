import React from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
  FaStethoscope,
  FaFileMedical,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaNotesMedical,
  FaCheckCircle,
} from "react-icons/fa";

const CitaDetalle = ({
  cita,
  onCerrar,
}) => {
  if (!cita) return null;

  const paciente = cita.pacientes || {};
  const especialista = cita.especialistas || {};
  const especialidad =
    especialista.especialidades || {};

  /* =====================================================
     DATOS
  ===================================================== */

  const nombrePaciente =
    `${paciente.nombres || ""} ${
      paciente.apellidos || ""
    }`.trim() || "Paciente no disponible";

  const nombreEspecialista =
    `${especialista.nombres || ""} ${
      especialista.apellidos || ""
    }`.trim() || "Especialista no disponible";

  /* =====================================================
     FORMATEAR FECHA
  ===================================================== */

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "Fecha no disponible";
    }

    const fechaLocal =
      new Date(`${fecha}T00:00:00`);

    return fechaLocal.toLocaleDateString(
      "es-NI",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     FORMATEAR HORA
  ===================================================== */

  const formatearHora = (hora) => {
    if (!hora) {
      return "--:--";
    }

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

  /* =====================================================
     ESTADO
  ===================================================== */

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case "PROGRAMADA":
        return "programada";

      case "CONFIRMADA":
        return "confirmada";

      case "ATENDIDA":
        return "atendida";

      case "CANCELADA":
        return "cancelada";

      case "NO_ASISTIO":
        return "no-asistio";

      default:
        return "pendiente";
    }
  };

  const obtenerTextoEstado = (estado) => {
    if (!estado) {
      return "SIN ESTADO";
    }

    return estado.replaceAll(
      "_",
      " "
    );
  };

  /* =====================================================
     TIPO DE CONSULTA
  ===================================================== */

  const obtenerTipoConsulta = (
    tipo
  ) => {
    switch (tipo) {
      case "PRIMERA_VEZ":
        return "Primera vez";

      case "SEGUIMIENTO":
        return "Seguimiento";

      default:
        return tipo
          ? tipo.replaceAll(
              "_",
              " "
            )
          : "No especificado";
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="modal fade show d-block cita-detalle-overlay"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content cita-detalle-modal">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="modal-header cita-detalle-header">

            <div className="d-flex align-items-center gap-3">

              <div className="cita-detalle-header-icon">
                <FaCalendarAlt />
              </div>

              <div>
                <h5 className="modal-title mb-1">
                  Detalle de la cita
                </h5>

                <small>
                  Información completa de la cita médica
                </small>
              </div>

            </div>

            <button
              type="button"
              className="btn cita-detalle-close"
              onClick={onCerrar}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>

          </div>

          {/* =================================================
              BODY
          ================================================= */}

          <div className="modal-body">

            {/* ===============================================
                ESTADO Y FECHA
            =============================================== */}

            <div className="cita-detalle-resumen">

              <div className="cita-detalle-fecha">

                <div className="cita-detalle-icon">
                  <FaCalendarAlt />
                </div>

                <div>
                  <span className="cita-detalle-label">
                    Fecha de la cita
                  </span>

                  <strong className="text-capitalize">
                    {formatearFecha(
                      cita.fecha_cita
                    )}
                  </strong>
                </div>

              </div>

              <div className="cita-detalle-hora">

                <div className="cita-detalle-icon">
                  <FaClock />
                </div>

                <div>
                  <span className="cita-detalle-label">
                    Horario
                  </span>

                  <strong>
                    {formatearHora(
                      cita.hora_inicio
                    )}

                    {cita.hora_fin && (
                      <>
                        {" - "}
                        {formatearHora(
                          cita.hora_fin
                        )}
                      </>
                    )}
                  </strong>
                </div>

              </div>

              <span
                className={`cita-detalle-estado ${obtenerClaseEstado(
                  cita.estado
                )}`}
              >
                {obtenerTextoEstado(
                  cita.estado
                )}
              </span>

            </div>

            {/* ===============================================
                PACIENTE
            =============================================== */}

            <section className="cita-detalle-section">

              <div className="cita-detalle-section-title">
                <FaUser />
                <span>Información del paciente</span>
              </div>

              <div className="cita-detalle-paciente">

                <div className="cita-detalle-avatar">
                  <FaUser />
                </div>

                <div className="cita-detalle-paciente-main">

                  <h5>
                    {nombrePaciente}
                  </h5>

                  <span className="cita-detalle-expediente">
                    <FaIdCard />
                    {paciente.codigo_expediente ||
                      "Sin expediente"}
                  </span>

                </div>

              </div>

              <div className="row g-3 mt-1">

                <div className="col-12 col-md-6">

                  <div className="cita-detalle-contacto">

                    <FaPhone />

                    <div>
                      <span>
                        Teléfono
                      </span>

                      <strong>
                        {paciente.telefono ||
                          "No registrado"}
                      </strong>
                    </div>

                  </div>

                </div>

                <div className="col-12 col-md-6">

                  <div className="cita-detalle-contacto">

                    <FaEnvelope />

                    <div>
                      <span>
                        Correo electrónico
                      </span>

                      <strong>
                        {paciente.correo ||
                          "No registrado"}
                      </strong>
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* ===============================================
                ESPECIALISTA
            =============================================== */}

            <section className="cita-detalle-section">

              <div className="cita-detalle-section-title">
                <FaUserMd />
                <span>Información del especialista</span>
              </div>

              <div className="cita-detalle-especialista">

                <div className="cita-detalle-especialista-icon">
                  <FaUserMd />
                </div>

                <div>

                  <h5>
                    {nombreEspecialista}
                  </h5>

                  <span>
                    {especialidad.nombre ||
                      "Especialidad no disponible"}
                  </span>

                </div>

              </div>

              <div className="row g-3 mt-1">

                <div className="col-12 col-md-6">

                  <div className="cita-detalle-contacto">

                    <FaPhone />

                    <div>
                      <span>
                        Teléfono
                      </span>

                      <strong>
                        {especialista.telefono ||
                          "No registrado"}
                      </strong>
                    </div>

                  </div>

                </div>

                <div className="col-12 col-md-6">

                  <div className="cita-detalle-contacto">

                    <FaEnvelope />

                    <div>
                      <span>
                        Correo electrónico
                      </span>

                      <strong>
                        {especialista.correo ||
                          "No registrado"}
                      </strong>
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* ===============================================
                CONSULTA
            =============================================== */}

            <section className="cita-detalle-section">

              <div className="cita-detalle-section-title">
                <FaStethoscope />
                <span>Información de la consulta</span>
              </div>

              <div className="row g-3">

                <div className="col-12 col-md-6">

                  <div className="cita-detalle-dato">

                    <span>
                      Tipo de consulta
                    </span>

                    <strong>
                      {obtenerTipoConsulta(
                        cita.tipo_consulta
                      )}
                    </strong>

                  </div>

                </div>

                <div className="col-12 col-md-6">

                  <div className="cita-detalle-dato">

                    <span>
                      Estado
                    </span>

                    <strong>
                      {obtenerTextoEstado(
                        cita.estado
                      )}
                    </strong>

                  </div>

                </div>

                <div className="col-12">

                  <div className="cita-detalle-dato">

                    <div className="d-flex align-items-center gap-2 mb-1">
                      <FaFileMedical />
                      <span>
                        Motivo de consulta
                      </span>
                    </div>

                    <p>
                      {cita.motivo ||
                        "Sin motivo registrado"}
                    </p>

                  </div>

                </div>

                <div className="col-12">

                  <div className="cita-detalle-dato">

                    <div className="d-flex align-items-center gap-2 mb-1">
                      <FaNotesMedical />
                      <span>
                        Observaciones
                      </span>
                    </div>

                    <p>
                      {cita.observaciones ||
                        "Sin observaciones registradas"}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* ===============================================
                IDENTIFICADOR
            =============================================== */}

            <div className="cita-detalle-identificador">

              <FaCheckCircle />

              <div>
                <span>
                  Identificador de la cita
                </span>

                <strong>
                  {cita.id_cita}
                </strong>
              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="modal-footer cita-detalle-footer">

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCerrar}
            >
              Cerrar
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CitaDetalle;