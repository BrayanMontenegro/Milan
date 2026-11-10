import React from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import ProcedenciaSelector from "./ProcedenciaSelector";

const PacienteContactoSection = ({
  formulario,
  manejarCambio,
  procedencias,
  onSeleccionarProcedencia,
}) => (
  <section className="paciente-form-section">
    <div className="paciente-form-section-title">
      <div className="paciente-form-section-icon turquoise">
        <FaPhone />
      </div>
      <div>
        <h5>Información de contacto</h5>
        <small>Datos para comunicación y ubicación</small>
      </div>
    </div>

    <div className="row g-3">
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="paciente-telefono">
          Teléfono
        </label>
        <input
          id="paciente-telefono"
          type="tel"
          name="telefono"
          className="form-control"
          value={formulario.telefono || ""}
          onChange={manejarCambio}
          placeholder="8888-8888"
          inputMode="numeric"
          maxLength={9}
        />
      </div>

      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="paciente-correo">
          Correo electrónico
        </label>
        <input
          id="paciente-correo"
          type="email"
          name="correo"
          className="form-control"
          value={formulario.correo}
          onChange={manejarCambio}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          className="form-label"
          htmlFor="paciente-procedencia"
          id="paciente-procedencia-label"
        >
          <FaMapMarkerAlt className="me-1" />
          Procedencia<span className="text-danger"> *</span>
        </label>
        <ProcedenciaSelector
          id="paciente-procedencia"
          valor={formulario.procedencia}
          procedencias={procedencias}
          onSeleccionar={onSeleccionarProcedencia}
        />
        <input
          aria-labelledby="paciente-procedencia-label"
          type="text"
          value={formulario.procedencia || ""}
          required
          readOnly
          tabIndex="-1"
          className="position-absolute opacity-0"
          style={{ width: "1px", height: "1px" }}
        />
      </div>

      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="paciente-direccion">
          Dirección
        </label>
        <input
          id="paciente-direccion"
          type="text"
          name="direccion"
          className="form-control"
          value={formulario.direccion}
          onChange={manejarCambio}
          placeholder="Dirección del paciente"
        />
      </div>

      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="paciente-ocupacion">
          Ocupación
        </label>
        <input
          id="paciente-ocupacion"
          type="text"
          name="ocupacion"
          className="form-control"
          value={formulario.ocupacion}
          onChange={manejarCambio}
          placeholder="Ocupación"
        />
      </div>
    </div>
  </section>
);

export default PacienteContactoSection;
