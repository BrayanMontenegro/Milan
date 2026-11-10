import React from "react";
import {
  FaHeartbeat,
  FaLungs,
  FaThermometerHalf,
  FaTint,
  FaWeight,
} from "react-icons/fa";

const AtenderConsultaVitalSigns = ({ signosVitales }) => {
  if (!signosVitales) {
    return (
      <section className="atender-seccion">
        <div className="atender-seccion-header">
          <div>
            <span className="atender-seccion-icon">
              <FaHeartbeat />
            </span>
            <div>
              <h3>Signos vitales</h3>
              <p>Registrados previamente por enfermería</p>
            </div>
          </div>
          <span className="solo-lectura">Solo lectura</span>
        </div>
        <div className="sin-signos">
          <FaHeartbeat />
          <p>No se encontraron signos vitales registrados para este paciente.</p>
        </div>
      </section>
    );
  }

  const mediciones = [
    { label: "Peso", value: signosVitales.peso, unit: " kg", Icon: FaWeight },
    { label: "Talla", value: signosVitales.talla, unit: " cm", Icon: FaWeight },
    {
      label: "Temperatura",
      value: signosVitales.temperatura,
      unit: " °C",
      Icon: FaThermometerHalf,
    },
    {
      label: "Presión arterial",
      value: signosVitales.presion_arterial || "-",
      Icon: FaTint,
    },
    {
      label: "Frecuencia cardíaca",
      value: signosVitales.frecuencia_cardiaca,
      unit: " lpm",
      Icon: FaHeartbeat,
    },
    {
      label: "Frecuencia respiratoria",
      value: signosVitales.frecuencia_respiratoria,
      unit: " rpm",
      Icon: FaLungs,
    },
    {
      label: "Saturación O₂",
      value: signosVitales.saturacion_oxigeno,
      unit: " %",
      Icon: FaLungs,
    },
  ];

  return (
    <section className="atender-seccion">
      <div className="atender-seccion-header">
        <div>
          <span className="atender-seccion-icon">
            <FaHeartbeat />
          </span>
          <div>
            <h3>Signos vitales</h3>
            <p>Registrados previamente por enfermería</p>
          </div>
        </div>
        <span className="solo-lectura">Solo lectura</span>
      </div>
      <div className="signos-grid">
        {mediciones.map(({ label, value, unit, Icon }) => (
          <div className="signo-card" key={label}>
            <Icon />
            <span>{label}</span>
            <strong>
              {value ?? "-"}
              {value && unit}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AtenderConsultaVitalSigns;
