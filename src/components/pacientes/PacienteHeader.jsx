import React from "react";
import { FaUserInjured, FaPlus } from "react-icons/fa";
import "../../styles/pacientes.css";

const PacienteHeader = ({ onNuevoPaciente }) => {
  return (
    <div className="pacientes-header">
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          <div>
            <div className="d-flex align-items-center gap-3">

              <div className="pacientes-header-icon">
                <FaUserInjured />
              </div>

              <div>
                <h2 className="mb-1">Pacientes</h2>

                <p className="mb-0">
                  Gestión y administración de pacientes de la clínica
                </p>
              </div>

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
      </div>
    </div>
  );
};

export default PacienteHeader;
