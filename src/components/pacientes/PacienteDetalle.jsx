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
  FaHeart,
} from "react-icons/fa";
import useNativeDialog from "../../hooks/useNativeDialog";

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "-";
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad -= 1;
  }

  return edad;
};

const formatearFecha = (fecha) =>
  fecha
    ? new Date(fecha).toLocaleDateString("es-NI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

const DatoPaciente = ({ etiqueta, valor, icono }) => (
  <div className="paciente-info-item">
    <span>{etiqueta}</span>
    <strong>
      {icono}
      {valor || "-"}
    </strong>
  </div>
);

const PacienteDetalleHeader = ({ paciente, onCerrar }) => (
  <div className="modal-header paciente-modal-header">
    <div className="d-flex align-items-center gap-3">
      <div className="paciente-modal-avatar">
        {paciente.nombres?.charAt(0)}
        {paciente.apellidos?.charAt(0)}
      </div>
      <div>
        <h5 className="modal-title mb-1" id="paciente-detalle-titulo">
          {paciente.nombres} {paciente.apellidos}
        </h5>
        <span className="paciente-modal-expediente">
          Expediente: {paciente.codigo_expediente || "N/A"}
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
);

const PacienteDetalleInformacion = ({ paciente, edad }) => (
  <div className="paciente-info-section">
    <h6 className="paciente-section-title">
      <FaUser />
      Información personal
    </h6>
    <div className="row g-3">
      <div className="col-md-6">
        <DatoPaciente
          etiqueta="Nombre completo"
          valor={`${paciente.nombres || ""} ${paciente.apellidos || ""}`}
        />
      </div>
      <div className="col-md-3">
        <DatoPaciente
          etiqueta="Edad"
          valor={edad !== "-" ? `${edad} años` : "-"}
        />
      </div>
      <div className="col-md-3">
        <DatoPaciente etiqueta="Sexo" valor={paciente.sexo} />
      </div>
      <div className="col-md-6">
        <DatoPaciente
          etiqueta="Fecha de nacimiento"
          valor={formatearFecha(paciente.fecha_nacimiento)}
          icono={<FaCalendarAlt />}
        />
      </div>
      <div className="col-md-6">
        <DatoPaciente
          etiqueta="Estado civil"
          valor={paciente.estado_civil}
          icono={<FaHeart />}
        />
      </div>
    </div>
  </div>
);

const PacienteDetalleContacto = ({ paciente }) => (
  <div className="paciente-info-section">
    <h6 className="paciente-section-title">
      <FaPhone />
      Información de contacto
    </h6>
    <div className="row g-3">
      <div className="col-md-6">
        <DatoPaciente
          etiqueta="Teléfono"
          valor={paciente.telefono}
          icono={<FaPhone />}
        />
      </div>
      <div className="col-md-6">
        <DatoPaciente
          etiqueta="Correo electrónico"
          valor={paciente.correo}
          icono={<FaEnvelope />}
        />
      </div>
      <div className="col-12">
        <DatoPaciente
          etiqueta="Dirección"
          valor={paciente.direccion}
          icono={<FaMapMarkerAlt />}
        />
      </div>
      <div className="col-md-6">
        <DatoPaciente etiqueta="Procedencia" valor={paciente.procedencia} />
      </div>
      <div className="col-md-6">
        <DatoPaciente
          etiqueta="Ocupación"
          valor={paciente.ocupacion}
          icono={<FaBriefcase />}
        />
      </div>
    </div>
  </div>
);

const PacienteDetalleTutor = ({ paciente }) => {
  if (!paciente.es_menor_edad) return null;

  return (
    <>
      <hr />
      <div className="paciente-info-section">
        <h6 className="paciente-section-title">
          <FaUser />
          Información del tutor
        </h6>
        <div className="row g-3">
          <div className="col-md-6">
            <DatoPaciente etiqueta="Nombre del tutor" valor={paciente.nombre_tutor} />
          </div>
          <div className="col-md-3">
            <DatoPaciente
              etiqueta="Parentesco"
              valor={paciente.parentesco_tutor}
            />
          </div>
          <div className="col-md-3">
            <DatoPaciente etiqueta="Teléfono" valor={paciente.telefono_tutor} />
          </div>
        </div>
      </div>
    </>
  );
};

const PacienteDetalleContenido = ({ paciente, edad }) => (
  <div className="modal-body">
    <div className="d-flex justify-content-end mb-4">
      <span
        className={
          paciente.activo
            ? "paciente-status activo"
            : "paciente-status inactivo"
        }
      >
        {paciente.activo ? "Paciente activo" : "Paciente inactivo"}
      </span>
    </div>
    <PacienteDetalleInformacion paciente={paciente} edad={edad} />
    <hr />
    <PacienteDetalleContacto paciente={paciente} />
    <PacienteDetalleTutor paciente={paciente} />
    <hr />
    <div className="paciente-info-section">
      <h6 className="paciente-section-title">
        <FaIdCard />
        Observaciones
      </h6>
      <div className="paciente-observaciones">
        {paciente.observaciones || "No hay observaciones registradas."}
      </div>
    </div>
  </div>
);

const PacienteDetalle = ({ paciente, mostrar, onCerrar }) => {
  const dialogRef = useNativeDialog(Boolean(mostrar && paciente), onCerrar);
  if (!mostrar || !paciente) return null;
  const edad = calcularEdad(paciente.fecha_nacimiento);

  return (
    <dialog
      ref={dialogRef}
      className="modal fade show d-block native-modal-root"
      aria-labelledby="paciente-detalle-titulo"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
    >
      <button
        type="button"
        className="modal-backdrop-dismiss"
        aria-label="Cerrar detalle del paciente"
        onClick={() => dialogRef.current?.close()}
      />
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-backdrop-content">
        <div className="modal-content border-0 shadow">
          <PacienteDetalleHeader paciente={paciente} onCerrar={onCerrar} />
          <PacienteDetalleContenido paciente={paciente} edad={edad} />
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
    </dialog>
  );
};

export default PacienteDetalle;
