import React from "react";
import { FaUser } from "react-icons/fa";

const PacienteObservacionesSection = ({ formulario, manejarCambio }) => (
  <section className="paciente-form-section">
    <div className="paciente-form-section-title">
      <div className="paciente-form-section-icon purple">
        <FaUser />
      </div>
      <div>
        <h5>Observaciones</h5>
        <small>Información adicional del paciente</small>
      </div>
    </div>
    <label className="form-label" htmlFor="paciente-observaciones">
      Observaciones
    </label>
    <textarea
      id="paciente-observaciones"
      name="observaciones"
      className="form-control"
      rows="4"
      value={formulario.observaciones}
      onChange={manejarCambio}
      placeholder="Escriba cualquier información adicional..."
    />
  </section>
);

export default PacienteObservacionesSection;
