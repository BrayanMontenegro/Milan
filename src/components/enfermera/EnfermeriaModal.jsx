import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaUser,
  FaUserMd,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaThermometerHalf,
  FaTint,
  FaLungs,
  FaNotesMedical,
  FaSave,
} from "react-icons/fa";

const camposSignos = [
  {
    id: "enfermeria-peso",
    name: "peso",
    label: "Peso",
    Icon: FaWeight,
    type: "number",
    min: "0",
    step: "0.01",
    unit: "kg",
    placeholder: "Ej. 75.5",
  },
  {
    id: "enfermeria-talla",
    name: "talla",
    label: "Talla",
    Icon: FaRulerVertical,
    type: "number",
    min: "0",
    step: "0.01",
    unit: "m",
    placeholder: "Ej. 1.72",
  },
  {
    id: "enfermeria-temperatura",
    name: "temperatura",
    label: "Temperatura",
    Icon: FaThermometerHalf,
    type: "number",
    min: "0",
    step: "0.1",
    unit: "°C",
    placeholder: "Ej. 37.2",
  },
  {
    id: "enfermeria-presion-arterial",
    name: "presion_arterial",
    label: "Presión arterial",
    Icon: FaTint,
    type: "text",
    inputMode: "numeric",
    maxLength: 7,
    placeholder: "Ej. 120/80",
  },
  {
    id: "enfermeria-frecuencia-cardiaca",
    name: "frecuencia_cardiaca",
    label: "Frecuencia cardíaca",
    Icon: FaHeartbeat,
    type: "number",
    min: "1",
    unit: "ppm",
    placeholder: "Ej. 85",
  },
  {
    id: "enfermeria-frecuencia-respiratoria",
    name: "frecuencia_respiratoria",
    label: "Frecuencia respiratoria",
    Icon: FaLungs,
    type: "number",
    min: "1",
    unit: "rpm",
    placeholder: "Ej. 18",
  },
  {
    id: "enfermeria-saturacion-oxigeno",
    name: "saturacion_oxigeno",
    label: "Saturación de oxígeno",
    Icon: FaLungs,
    type: "number",
    min: "0",
    max: "100",
    step: "0.1",
    unit: "%",
    placeholder: "Ej. 98",
  },
];

const EnfermeriaResumenCita = ({
  paciente,
  nombrePaciente,
  nombreEspecialista,
  especialidad,
}) => (
  <div className="enfermeria-cita-resumen">
    <div className="enfermeria-resumen-paciente">
      <div className="enfermeria-resumen-avatar">
        <FaUser />
      </div>
      <div>
        <span>Paciente</span>
        <strong>{nombrePaciente}</strong>
        <small>{paciente.codigo_expediente || "Sin expediente"}</small>
      </div>
    </div>
    <div className="enfermeria-resumen-especialista">
      <FaUserMd />
      <div>
        <span>Especialista</span>
        <strong>{nombreEspecialista || "No disponible"}</strong>
        <small>{especialidad.nombre || "Especialidad no disponible"}</small>
      </div>
    </div>
  </div>
);

const EnfermeriaSignosVitales = ({
  formulario,
  cambiarCampo,
  cambiarPresionArterial,
}) => (
  <div className="enfermeria-seccion">
    <div className="enfermeria-seccion-header">
      <FaHeartbeat />
      <div>
        <h5>Signos vitales</h5>
        <span>Registre los valores obtenidos durante la toma</span>
      </div>
    </div>
    <div className="row g-3">
      {camposSignos.map((campo) => {
        const Icon = campo.Icon;
        const manejarCambio =
          campo.name === "presion_arterial"
            ? cambiarPresionArterial
            : (valor) => cambiarCampo(campo.name, valor);
        const input = (
          <input
            id={campo.id}
            type={campo.type}
            className="form-control"
            min={campo.min}
            max={campo.max}
            step={campo.step}
            inputMode={campo.inputMode}
            maxLength={campo.maxLength}
            value={formulario[campo.name]}
            onChange={(e) => manejarCambio(e.target.value)}
            placeholder={campo.placeholder}
          />
        );

        return (
          <div className="col-12 col-md-6" key={campo.name}>
            <label className="enfermeria-label" htmlFor={campo.id}>
              <Icon />
              {campo.label}
            </label>
            {campo.unit ? (
              <div className="input-group">
                {input}
                <span className="input-group-text">{campo.unit}</span>
              </div>
            ) : input}
          </div>
        );
      })}
    </div>
  </div>
);

const EnfermeriaTextoSection = ({
  id,
  titulo,
  descripcion,
  etiqueta,
  value,
  onChange,
  placeholder,
}) => (
  <div className="enfermeria-seccion">
    <div className="enfermeria-seccion-header">
      <FaNotesMedical />
      <div>
        <h5>{titulo}</h5>
        <span>{descripcion}</span>
      </div>
    </div>
    <label className="enfermeria-label" htmlFor={id}>
      {etiqueta}
    </label>
    <textarea
      id={id}
      className="form-control"
      rows="3"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const EnfermeriaModal = ({
  cita,
  onCerrar,
  onGuardar,
  guardando,
}) => {
  const [formulario, setFormulario] = useState({
    peso: "",
    talla: "",
    temperatura: "",
    presion_arterial: "",
    frecuencia_cardiaca: "",
    frecuencia_respiratoria: "",
    saturacion_oxigeno: "",
    motivo_consulta: "",
    observaciones: "",
  });

  useEffect(() => {
    if (!cita) return;

    setFormulario({
      peso: "",
      talla: "",
      temperatura: "",
      presion_arterial: "",
      frecuencia_cardiaca: "",
      frecuencia_respiratoria: "",
      saturacion_oxigeno: "",
      motivo_consulta: cita.motivo || "",
      observaciones: "",
    });
  }, [cita]);

  if (!cita) return null;

  const paciente = cita.pacientes || {};
  const especialista = cita.especialistas || {};
  const especialidad = especialista.especialidades || {};

  const nombrePaciente =
    `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim();

  const nombreEspecialista =
    `${especialista.nombres || ""} ${especialista.apellidos || ""}`.trim();

  const cambiarCampo = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const cambiarPresionArterial = (valor) => {
    const digitos = valor.replace(/\D/g, "").slice(0, 6);
    const primerasDosCifras = Number(digitos.slice(0, 2));
    const cifrasSistolicas =
      digitos.length >= 3 && primerasDosCifras < 30 ? 3 : 2;
    const presion =
      digitos.length > cifrasSistolicas
        ? `${digitos.slice(0, cifrasSistolicas)}/${digitos.slice(cifrasSistolicas)}`
        : digitos;

    cambiarCampo("presion_arterial", presion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onGuardar(formulario);
  };

  return (
    <div className="enfermeria-modal-overlay">

      <div className="enfermeria-modal">

        {/* HEADER */}
        <div className="enfermeria-modal-header">

          <div className="enfermeria-modal-title">

            <div className="enfermeria-modal-icon">
              <FaHeartbeat />
            </div>

            <div>
              <h4>Registro de signos vitales</h4>
              <p>Preparación del paciente para consulta</p>
            </div>

          </div>

          <button
            type="button"
            className="enfermeria-modal-close"
            aria-label="Cerrar registro de signos vitales"
            onClick={onCerrar}
            disabled={guardando}
          >
            <FaTimes />
          </button>

        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>

          <div className="enfermeria-modal-body">

            {/* INFORMACIÓN DE LA CITA */}
            <EnfermeriaResumenCita
              paciente={paciente}
              nombrePaciente={nombrePaciente}
              nombreEspecialista={nombreEspecialista}
              especialidad={especialidad}
            />

            {/* SIGNOS */}
            <EnfermeriaSignosVitales
              formulario={formulario}
              cambiarCampo={cambiarCampo}
              cambiarPresionArterial={cambiarPresionArterial}
            />

            {/* MOTIVO */}
            <EnfermeriaTextoSection
              id="enfermeria-motivo-consulta"
              titulo="Motivo de consulta"
              descripcion="Información proporcionada por el paciente"
              etiqueta="Motivo de consulta"
              value={formulario.motivo_consulta}
              onChange={(e) =>
                cambiarCampo("motivo_consulta", e.target.value)
              }
              placeholder="Describa el motivo de consulta..."
            />

            {/* OBSERVACIONES */}
            <EnfermeriaTextoSection
              id="enfermeria-observaciones"
              titulo="Observaciones de enfermería"
              descripcion="Información adicional relevante"
              etiqueta="Observaciones de enfermería"
              value={formulario.observaciones}
              onChange={(e) =>
                cambiarCampo("observaciones", e.target.value)
              }
              placeholder="Escriba las observaciones..."
            />

          </div>

          {/* FOOTER */}
          <div className="enfermeria-modal-footer">

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn enfermeria-btn-guardar"
              disabled={guardando}
            >
              <FaSave className="me-2" />

              {guardando
                ? "Guardando..."
                : "Guardar y confirmar cita"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EnfermeriaModal;