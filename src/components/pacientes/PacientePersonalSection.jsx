import React from "react";
import { FaBirthdayCake, FaUser } from "react-icons/fa";

const PacientePersonalSection = ({ formulario, manejarCambio, edad }) => (
  <section className="paciente-form-section">
    <div className="paciente-form-section-title">
      <div className="paciente-form-section-icon">
        <FaUser />
      </div>
      <div>
        <h5>Información personal</h5>
        <small>Datos básicos del paciente</small>
      </div>
    </div>

    <div className="row g-3">
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="paciente-nombres">
          Nombres<span className="text-danger"> *</span>
        </label>
        <input
          id="paciente-nombres"
          type="text"
          name="nombres"
          className="form-control"
          value={formulario.nombres}
          onChange={manejarCambio}
          placeholder="Ingrese los nombres"
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="paciente-apellidos">
          Apellidos<span className="text-danger"> *</span>
        </label>
        <input
          id="paciente-apellidos"
          type="text"
          name="apellidos"
          className="form-control"
          value={formulario.apellidos}
          onChange={manejarCambio}
          placeholder="Ingrese los apellidos"
          required
        />
      </div>

      <div className="col-12 col-md-4">
        <label className="form-label" htmlFor="paciente-fecha-nacimiento">
          <FaBirthdayCake className="me-1" />
          Fecha de nacimiento<span className="text-danger"> *</span>
        </label>
        <input
          id="paciente-fecha-nacimiento"
          type="date"
          name="fecha_nacimiento"
          className="form-control"
          value={formulario.fecha_nacimiento}
          onChange={manejarCambio}
          required
        />
        {edad !== null && (
          <small className="text-muted">Edad: {edad} años</small>
        )}
      </div>

      <div className="col-12 col-md-4">
        <label className="form-label" htmlFor="paciente-sexo">
          Sexo<span className="text-danger"> *</span>
        </label>
        <select
          id="paciente-sexo"
          name="sexo"
          className="form-select"
          value={formulario.sexo}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
          <option value="OTRO">Otro</option>
        </select>
      </div>

      <div className="col-12 col-md-4">
        <label className="form-label" htmlFor="paciente-estado-civil">
          Estado civil
        </label>
        <select
          id="paciente-estado-civil"
          name="estado_civil"
          className="form-select"
          value={formulario.estado_civil}
          onChange={manejarCambio}
        >
          <option value="">Seleccione</option>
          <option value="SOLTERO">Soltero/a</option>
          <option value="CASADO">Casado/a</option>
          <option value="UNION_LIBRE">Unión libre</option>
          <option value="DIVORCIADO">Divorciado/a</option>
          <option value="VIUDO">Viudo/a</option>
        </select>
      </div>
    </div>
  </section>
);

export default PacientePersonalSection;
