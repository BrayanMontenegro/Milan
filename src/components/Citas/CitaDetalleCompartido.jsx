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
import useNativeDialog from "../../hooks/useNativeDialog";

const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha no disponible";

  return new Date(`${fecha}T00:00:00`).toLocaleDateString(
    "es-NI",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

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

const obtenerTextoEstado = (estado) =>
  estado ? estado.replaceAll("_", " ") : "SIN ESTADO";

const obtenerTipoConsulta = (tipo) => {
  if (tipo === "PRIMERA_VEZ") return "Primera vez";
  if (tipo === "SEGUIMIENTO") return "Seguimiento";
  return tipo ? tipo.replaceAll("_", " ") : "No especificado";
};

const CitaDetalleEncabezado = ({ onCerrar }) => (
  <div className="modal-header cita-detalle-header">
    <div className="d-flex align-items-center gap-3">
      <div className="cita-detalle-header-icon">
        <FaCalendarAlt />
      </div>
      <div>
        <h5 className="modal-title mb-1" id="cita-detalle-titulo">Detalle de la cita</h5>
        <small>Información completa de la cita médica</small>
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
);

const CitaDetalleResumen = ({ cita }) => (
  <div className="cita-detalle-resumen">
    <div className="cita-detalle-fecha">
      <div className="cita-detalle-icon">
        <FaCalendarAlt />
      </div>
      <div>
        <span className="cita-detalle-label">Fecha de la cita</span>
        <strong className="text-capitalize">
          {formatearFecha(cita.fecha_cita)}
        </strong>
      </div>
    </div>
    <div className="cita-detalle-hora">
      <div className="cita-detalle-icon">
        <FaClock />
      </div>
      <div>
        <span className="cita-detalle-label">Horario</span>
        <strong>
          {formatearHora(cita.hora_inicio)}
          {cita.hora_fin && ` - ${formatearHora(cita.hora_fin)}`}
        </strong>
      </div>
    </div>
    <span
      className={`cita-detalle-estado ${obtenerClaseEstado(cita.estado)}`}
    >
      {obtenerTextoEstado(cita.estado)}
    </span>
  </div>
);

const CitaDetalleContacto = ({ icono, etiqueta, valor }) => (
  <div className="col-12 col-md-6">
    <div className="cita-detalle-contacto">
      {icono}
      <div>
        <span>{etiqueta}</span>
        <strong>{valor || "No registrado"}</strong>
      </div>
    </div>
  </div>
);

const CitaDetallePaciente = ({ paciente }) => {
  const nombre =
    `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim() ||
    "Paciente no disponible";

  return (
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
          <h5>{nombre}</h5>
          <span className="cita-detalle-expediente">
            <FaIdCard />
            {paciente.codigo_expediente || "Sin expediente"}
          </span>
        </div>
      </div>
      <div className="row g-3 mt-1">
        <CitaDetalleContacto
          icono={<FaPhone />}
          etiqueta="Teléfono"
          valor={paciente.telefono}
        />
        <CitaDetalleContacto
          icono={<FaEnvelope />}
          etiqueta="Correo electrónico"
          valor={paciente.correo}
        />
      </div>
    </section>
  );
};

const CitaDetalleEspecialista = ({ especialista }) => {
  const nombre =
    `${especialista.nombres || ""} ${especialista.apellidos || ""}`.trim() ||
    "Especialista no disponible";

  return (
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
          <h5>{nombre}</h5>
          <span>
            {especialista.especialidades?.nombre ||
              "Especialidad no disponible"}
          </span>
        </div>
      </div>
      <div className="row g-3 mt-1">
        <CitaDetalleContacto
          icono={<FaPhone />}
          etiqueta="Teléfono"
          valor={especialista.telefono}
        />
        <CitaDetalleContacto
          icono={<FaEnvelope />}
          etiqueta="Correo electrónico"
          valor={especialista.correo}
        />
      </div>
    </section>
  );
};

const CitaDetalleConsulta = ({ cita }) => (
  <section className="cita-detalle-section">
    <div className="cita-detalle-section-title">
      <FaStethoscope />
      <span>Información de la consulta</span>
    </div>
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="cita-detalle-dato">
          <span>Tipo de consulta</span>
          <strong>{obtenerTipoConsulta(cita.tipo_consulta)}</strong>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="cita-detalle-dato">
          <span>Estado</span>
          <strong>{obtenerTextoEstado(cita.estado)}</strong>
        </div>
      </div>
      <div className="col-12">
        <div className="cita-detalle-dato">
          <div className="d-flex align-items-center gap-2 mb-1">
            <FaFileMedical />
            <span>Motivo de consulta</span>
          </div>
          <p>{cita.motivo || "Sin motivo registrado"}</p>
        </div>
      </div>
      <div className="col-12">
        <div className="cita-detalle-dato">
          <div className="d-flex align-items-center gap-2 mb-1">
            <FaNotesMedical />
            <span>Observaciones</span>
          </div>
          <p>{cita.observaciones || "Sin observaciones registradas"}</p>
        </div>
      </div>
    </div>
  </section>
);

const CitaDetalleIdentificador = ({ idCita }) => (
  <div className="cita-detalle-identificador">
    <FaCheckCircle />
    <div>
      <span>Identificador de la cita</span>
      <strong>{idCita}</strong>
    </div>
  </div>
);

const CitaDetalleCompartido = ({ cita, onCerrar }) => {
  const dialogRef = useNativeDialog(Boolean(cita), onCerrar);
  if (!cita) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal fade show d-block cita-detalle-overlay native-modal-root"
      aria-labelledby="cita-detalle-titulo"
    >
      <button
        type="button"
        className="modal-backdrop-dismiss"
        aria-label="Cerrar detalle de cita"
        onClick={() => dialogRef.current?.close()}
      />
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-backdrop-content"
        role="document"
      >
        <div className="modal-content cita-detalle-modal">
          <CitaDetalleEncabezado onCerrar={onCerrar} />
          <div className="modal-body">
            <CitaDetalleResumen cita={cita} />
            <CitaDetallePaciente paciente={cita.pacientes || {}} />
            <CitaDetalleEspecialista especialista={cita.especialistas || {}} />
            <CitaDetalleConsulta cita={cita} />
            <CitaDetalleIdentificador idCita={cita.id_cita} />
          </div>
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
    </dialog>
  );
};

export default CitaDetalleCompartido;
