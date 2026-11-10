import React from "react";
import { FaUsers } from "react-icons/fa";

const PacienteTutorSection = ({ formulario, manejarCambio }) => (
  <section className="paciente-form-section paciente-tutor-section">
    <div className="paciente-form-section-title">
      <div className="paciente-form-section-icon yellow">
        <FaUsers />
      </div>
      <div>
        <h5>Información del tutor</h5>
        <small>
          Los datos del tutor son obligatorios para pacientes menores de edad.
        </small>
      </div>
    </div>

    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label" htmlFor="paciente-tutor-nombre">
          Nombre completo del tutor<span className="text-danger ms-1">*</span>
        </label>
        <input
          id="paciente-tutor-nombre"
          type="text"
          name="nombre_tutor"
          className="form-control"
          value={formulario.nombre_tutor || ""}
          onChange={manejarCambio}
          placeholder="Ingrese el nombre del tutor"
          required
        />
      </div>

      <div className="col-md-3">
        <label className="form-label" htmlFor="paciente-tutor-parentesco">
          Parentesco<span className="text-danger ms-1">*</span>
        </label>
        <select
          id="paciente-tutor-parentesco"
          name="parentesco_tutor"
          className="form-select"
          value={formulario.parentesco_tutor || ""}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Tutor">Tutor</option>
          <option value="Abuelo">Abuelo</option>
          <option value="Abuela">Abuela</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label" htmlFor="paciente-tutor-telefono">
          Teléfono del tutor<span className="text-danger ms-1">*</span>
        </label>
        <input
          id="paciente-tutor-telefono"
          type="tel"
          name="telefono_tutor"
          className="form-control"
          value={formulario.telefono_tutor || ""}
          onChange={manejarCambio}
          placeholder="8888-8888"
          inputMode="numeric"
          maxLength={9}
          required
        />
      </div>
    </div>
  </section>
);

export default PacienteTutorSection;
