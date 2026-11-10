import React, { useEffect, useRef } from "react";
import {
  FaUserMd,
  FaStethoscope,
  FaIdBadge,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "../../styles/Especialistas.css";

const EspecialistaPerfil = ({ especialista, nombreCompleto, especialidad }) => (
  <div className="especialista-detalle-profile">
    <div className="especialista-detalle-profile-avatar">
      <FaUserMd />
    </div>
    <div className="especialista-detalle-profile-info">
      <h4>{nombreCompleto || "Especialista sin nombre"}</h4>
      <span className="especialista-detalle-specialty">
        <FaStethoscope />
        {especialidad}
      </span>
    </div>
    <div className="ms-auto">
      {especialista.activo ? (
        <span className="estado-badge activo">
          <FaCheckCircle className="me-1" />
          Activo
        </span>
      ) : (
        <span className="estado-badge inactivo">
          <FaTimesCircle className="me-1" />
          Inactivo
        </span>
      )}
    </div>
  </div>
);

const EspecialistaInformacionProfesional = ({
  especialista,
  especialidad,
  descripcionEspecialidad,
}) => (
  <div className="especialista-detalle-section">
    <div className="especialista-detalle-section-title">
      <FaStethoscope />
      <span>Información profesional</span>
    </div>
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="especialista-detalle-item">
          <div className="especialista-detalle-icon">
            <FaIdBadge />
          </div>
          <div>
            <small>Código profesional</small>
            <strong>{especialista.codigo_profesional || "Sin código"}</strong>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="especialista-detalle-item">
          <div className="especialista-detalle-icon">
            <FaStethoscope />
          </div>
          <div>
            <small>Especialidad</small>
            <strong>{especialidad}</strong>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="especialista-detalle-description">
          <small>Descripción de la especialidad</small>
          <p className="mb-0">{descripcionEspecialidad}</p>
        </div>
      </div>
    </div>
  </div>
);

const EspecialistaContacto = ({ especialista }) => (
  <div className="especialista-detalle-section">
    <div className="especialista-detalle-section-title">
      <FaPhone />
      <span>Información de contacto</span>
    </div>
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="especialista-detalle-item">
          <div className="especialista-detalle-icon">
            <FaPhone />
          </div>
          <div>
            <small>Teléfono</small>
            <strong>
              {especialista.telefono || "Sin teléfono registrado"}
            </strong>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="especialista-detalle-item">
          <div className="especialista-detalle-icon">
            <FaEnvelope />
          </div>
          <div>
            <small>Correo electrónico</small>
            <strong className="text-break">
              {especialista.correo || "Sin correo registrado"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EspecialistaRegistro = ({
  especialista,
  formatearFecha,
  formatearFechaHora,
}) => (
  <div className="especialista-detalle-section">
    <div className="especialista-detalle-section-title">
      <FaCalendarAlt />
      <span>Información de registro</span>
    </div>
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="especialista-detalle-item">
          <div className="especialista-detalle-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <small>Fecha de registro</small>
            <strong>{formatearFecha(especialista.created_at)}</strong>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="especialista-detalle-item">
          <div className="especialista-detalle-icon">
            <FaClock />
          </div>
          <div>
            <small>Última actualización</small>
            <strong>{formatearFechaHora(especialista.updated_at)}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EspecialistaDetalle = ({
  mostrar,
  especialista,
  onCerrar,
}) => {
  const dialogRef = useRef(null);
  const tieneEspecialista = Boolean(especialista);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mostrar || !tieneEspecialista || !dialog) return undefined;

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [mostrar, tieneEspecialista]);

  if (!especialista) return null;

  const nombreCompleto =
    `${especialista.nombres || ""} ${especialista.apellidos || ""}`.trim();

  const especialidad =
    especialista.especialidades?.nombre || "Sin especialidad";

  const descripcionEspecialidad =
    especialista.especialidades?.descripcion ||
    "No hay una descripción registrada para esta especialidad.";

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";

    try {
      return new Date(fecha).toLocaleDateString("es-NI", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "No disponible";
    }
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return "No disponible";

    try {
      return new Date(fecha).toLocaleString("es-NI", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "No disponible";
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`modal fade ${mostrar ? "show d-block" : ""} especialista-detalle-modal native-modal-root`}
      aria-labelledby="especialista-detalle-titulo"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onCancel={(event) => {
        event.preventDefault();
        onCerrar();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content especialista-detalle-content">

          {/* HEADER */}
          <div className="modal-header especialistas-detalle-header">

            <div className="d-flex align-items-center gap-3">

              <div className="especialista-detalle-avatar">
                <FaUserMd />
              </div>

              <div>
                <h5 className="modal-title mb-1" id="especialista-detalle-titulo">
                  Información del especialista
                </h5>

                <small>
                  Detalle de la información profesional registrada
                </small>
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
          <div className="modal-body especialista-detalle-body">

            <EspecialistaPerfil
              especialista={especialista}
              nombreCompleto={nombreCompleto}
              especialidad={especialidad}
            />
            <EspecialistaInformacionProfesional
              especialista={especialista}
              especialidad={especialidad}
              descripcionEspecialidad={descripcionEspecialidad}
            />
            <EspecialistaContacto especialista={especialista} />
            <EspecialistaRegistro
              especialista={especialista}
              formatearFecha={formatearFecha}
              formatearFechaHora={formatearFechaHora}
            />

          </div>

          {/* FOOTER */}
          <div className="modal-footer">

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

export default EspecialistaDetalle;