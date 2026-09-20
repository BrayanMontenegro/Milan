import React from "react";
import { FaUserInjured, FaPlus } from "react-icons/fa";

const PacienteHeader = ({ onNuevoPaciente }) => {
  return (
    <div className="pacientes-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

      <div className="d-flex align-items-center gap-3">

        <div className="pacientes-header-icon">
          <FaUserInjured />
        </div>

        <div>
          <h1 className="pacientes-title mb-1">
            Pacientes
          </h1>

          <p className="pacientes-subtitle mb-0">
            Gestión y registro de pacientes de Clínica Milán
          </p>
        </div>

      </div>

      <button
        type="button"
        className="btn btn-milan-primary"
        onClick={onNuevoPaciente}
      >
        <FaPlus className="me-2" />
        Nuevo paciente
      </button>

    </div>
  );
};

export default PacienteHeader;