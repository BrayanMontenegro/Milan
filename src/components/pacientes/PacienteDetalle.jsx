import React from "react";
import {
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaBriefcase,
  FaHeart
} from "react-icons/fa";

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "-";

  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad =
    hoy.getFullYear() -
    nacimiento.getFullYear();

  const mes =
    hoy.getMonth() -
    nacimiento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }

  return edad;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "-";

  return new Date(fecha).toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const PacienteDetalle = ({
  paciente,
  mostrar,
  onCerrar
}) => {

  if (!mostrar || !paciente) {
    return null;
  }

  const edad = calcularEdad(
    paciente.fecha_nacimiento
  );

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.55)"
      }}
    >

      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

        <div className="modal-content border-0 shadow">

          {/* HEADER */}
          <div className="modal-header paciente-modal-header">

            <div className="d-flex align-items-center gap-3">

              <div className="paciente-modal-avatar">
                {paciente.nombres?.charAt(0)}
                {paciente.apellidos?.charAt(0)}
              </div>

              <div>
                <h5 className="modal-title mb-1">
                  {paciente.nombres}{" "}
                  {paciente.apellidos}
                </h5>

                <span className="paciente-modal-expediente">
                  Expediente:{" "}
                  {paciente.codigo_expediente || "N/A"}
                </span>
              </div>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onCerrar}
              aria-label="Cerrar"
            />

          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* Estado */}
            <div className="d-flex justify-content-end mb-4">

              <span
                className={
                  paciente.activo
                    ? "paciente-status activo"
                    : "paciente-status inactivo"
                }
              >
                {paciente.activo
                  ? "Paciente activo"
                  : "Paciente inactivo"}
              </span>

            </div>

            {/* Información personal */}
            <div className="paciente-info-section">

              <h6 className="paciente-section-title">
                <FaUser />
                Información personal
              </h6>

              <div className="row g-3">

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Nombre completo</span>
                    <strong>
                      {paciente.nombres}{" "}
                      {paciente.apellidos}
                    </strong>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="paciente-info-item">
                    <span>Edad</span>
                    <strong>
                      {edad !== "-"
                        ? `${edad} años`
                        : "-"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="paciente-info-item">
                    <span>Sexo</span>
                    <strong>
                      {paciente.sexo || "-"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Fecha de nacimiento</span>
                    <strong>
                      <FaCalendarAlt />
                      {formatearFecha(
                        paciente.fecha_nacimiento
                      )}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Estado civil</span>
                    <strong>
                      <FaHeart />
                      {paciente.estado_civil || "-"}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

            <hr />

            {/* Información de contacto */}
            <div className="paciente-info-section">

              <h6 className="paciente-section-title">
                <FaPhone />
                Información de contacto
              </h6>

              <div className="row g-3">

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Teléfono</span>
                    <strong>
                      <FaPhone />
                      {paciente.telefono || "-"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Correo electrónico</span>
                    <strong>
                      <FaEnvelope />
                      {paciente.correo || "-"}
                    </strong>
                  </div>
                </div>

                <div className="col-12">
                  <div className="paciente-info-item">
                    <span>Dirección</span>
                    <strong>
                      <FaMapMarkerAlt />
                      {paciente.direccion || "-"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Procedencia</span>
                    <strong>
                      {paciente.procedencia || "-"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="paciente-info-item">
                    <span>Ocupación</span>
                    <strong>
                      <FaBriefcase />
                      {paciente.ocupacion || "-"}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

            {/* Tutor */}
            {paciente.es_menor_edad && (
              <>
                <hr />

                <div className="paciente-info-section">

                  <h6 className="paciente-section-title">
                    <FaUser />
                    Información del tutor
                  </h6>

                  <div className="row g-3">

                    <div className="col-md-6">
                      <div className="paciente-info-item">
                        <span>Nombre del tutor</span>
                        <strong>
                          {paciente.nombre_tutor || "-"}
                        </strong>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="paciente-info-item">
                        <span>Parentesco</span>
                        <strong>
                          {paciente.parentesco_tutor || "-"}
                        </strong>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="paciente-info-item">
                        <span>Teléfono</span>
                        <strong>
                          {paciente.telefono_tutor || "-"}
                        </strong>
                      </div>
                    </div>

                  </div>

                </div>
              </>
            )}

            {/* Observaciones */}
            <hr />

            <div className="paciente-info-section">

              <h6 className="paciente-section-title">
                <FaIdCard />
                Observaciones
              </h6>

              <div className="paciente-observaciones">
                {paciente.observaciones ||
                  "No hay observaciones registradas."}
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="modal-footer">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCerrar}
            >
              <FaTimes className="me-2" />
              Cerrar
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PacienteDetalle;