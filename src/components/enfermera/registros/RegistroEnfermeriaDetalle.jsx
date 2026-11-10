import React from "react";
import {
  FaTimes,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaThermometerHalf,
  FaTint,
  FaHeartbeat,
  FaLungs,
  FaNotesMedical,
} from "react-icons/fa";

const RegistroPacienteResumen = ({ paciente, nombrePaciente }) => (
  <div className="registro-detalle-paciente">
    <div className="registro-detalle-paciente-avatar">
      <FaUser />
    </div>
    <div>
      <span>Paciente</span>
      <strong>{nombrePaciente || "Paciente no disponible"}</strong>
      <small>{paciente.codigo_expediente || "Sin expediente"}</small>
    </div>
  </div>
);

const RegistroMeta = ({ registro, nombreUsuario, formatearFecha, formatearHora }) => (
  <div className="registro-detalle-meta">
    <div>
      <FaCalendarAlt />
      <div>
        <span>Fecha</span>
        <strong>{formatearFecha(registro.fecha_registro)}</strong>
      </div>
    </div>
    <div>
      <FaHeartbeat />
      <div>
        <span>Hora</span>
        <strong>{formatearHora(registro.fecha_registro)}</strong>
      </div>
    </div>
    <div>
      <FaUserMd />
      <div>
        <span>Registrado por</span>
        <strong>{nombreUsuario || "Usuario no disponible"}</strong>
      </div>
    </div>
  </div>
);

const RegistroSignosVitales = ({ registro, mostrarValor }) => (
  <div className="registro-detalle-seccion">
    <div className="registro-detalle-seccion-header">
      <FaHeartbeat />
      <div>
        <h5>Signos vitales</h5>
        <span>Valores registrados durante la atención</span>
      </div>
    </div>
    <div className="registro-signos-grid">
      <div className="registro-signo-item">
        <FaWeight />
        <span>Peso</span>
        <strong>{mostrarValor(registro.peso, "kg")}</strong>
      </div>
      <div className="registro-signo-item">
        <FaRulerVertical />
        <span>Talla</span>
        <strong>{mostrarValor(registro.talla, "m")}</strong>
      </div>
      <div className="registro-signo-item">
        <FaThermometerHalf />
        <span>Temperatura</span>
        <strong>{mostrarValor(registro.temperatura, "°C")}</strong>
      </div>
      <div className="registro-signo-item">
        <FaTint />
        <span>Presión arterial</span>
        <strong>{mostrarValor(registro.presion_arterial)}</strong>
      </div>
      <div className="registro-signo-item">
        <FaHeartbeat />
        <span>Frecuencia cardíaca</span>
        <strong>{mostrarValor(registro.frecuencia_cardiaca, "ppm")}</strong>
      </div>
      <div className="registro-signo-item">
        <FaLungs />
        <span>Frecuencia respiratoria</span>
        <strong>{mostrarValor(registro.frecuencia_respiratoria, "rpm")}</strong>
      </div>
      <div className="registro-signo-item">
        <FaLungs />
        <span>Saturación O₂</span>
        <strong>{mostrarValor(registro.saturacion_oxigeno, "%")}</strong>
      </div>
    </div>
  </div>
);

const RegistroTextoSection = ({ titulo, texto }) => (
  <div className="registro-detalle-seccion">
    <div className="registro-detalle-seccion-header">
      <FaNotesMedical />
      <div>
        <h5>{titulo}</h5>
      </div>
    </div>
    <div className="registro-texto">{texto}</div>
  </div>
);

const RegistroEnfermeriaDetalle = ({
  registro,
  onCerrar,
}) => {

  if (!registro) {
    return null;
  }

  const paciente = registro.pacientes || {};
  const usuario = registro.usuarios || {};

  const nombrePaciente =
    `${paciente.nombres || ""} ${
      paciente.apellidos || ""
    }`.trim();

  const nombreUsuario =
    `${usuario.nombres || ""} ${
      usuario.apellidos || ""
    }`.trim();

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-NI", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "--:--";

    return new Date(fecha).toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const mostrarValor = (valor, unidad = "") => {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "No registrado";
    }

    return `${valor}${unidad ? ` ${unidad}` : ""}`;
  };

  return (
    <div className="registro-detalle-overlay">

      <div className="registro-detalle-modal">

        {/* HEADER */}
        <div className="registro-detalle-header">

          <div className="registro-detalle-header-content">

            <div className="registro-detalle-header-icon">
              <FaNotesMedical />
            </div>

            <div>
              <h4>Registro de enfermería</h4>

              <p>
                Detalle de la toma de signos vitales
              </p>
            </div>

          </div>

          <button
            type="button"
            className="registro-detalle-close"
            onClick={onCerrar}
            aria-label="Cerrar detalle de registro de enfermería"
          >
            <FaTimes />
          </button>

        </div>

        {/* BODY */}
        <div className="registro-detalle-body">

          <RegistroPacienteResumen
            paciente={paciente}
            nombrePaciente={nombrePaciente}
          />
          <RegistroMeta
            registro={registro}
            nombreUsuario={nombreUsuario}
            formatearFecha={formatearFecha}
            formatearHora={formatearHora}
          />
          <RegistroSignosVitales
            registro={registro}
            mostrarValor={mostrarValor}
          />
          <RegistroTextoSection
            titulo="Motivo de consulta"
            texto={
              registro.motivo_consulta ||
              "No se registró un motivo de consulta."
            }
          />
          <RegistroTextoSection
            titulo="Observaciones"
            texto={
              registro.observaciones ||
              "No se registraron observaciones."
            }
          />

        </div>

        {/* FOOTER */}
        <div className="registro-detalle-footer">

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
  );
};

export default RegistroEnfermeriaDetalle;