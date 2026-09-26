import React from "react";
import { FaUserMd, FaPlus } from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialistaHeader = ({ onNuevoEspecialista }) => {
  return (
    <div className="especialistas-header">
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          <div>
            <div className="d-flex align-items-center gap-3">
              <div className="especialistas-header-icon">
                <FaUserMd />
              </div>

              <div>
                <h2 className="mb-1">Especialistas</h2>

                <p className="mb-0">
                  Gestión de médicos y profesionales de la clínica
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-milan-primary"
            onClick={onNuevoEspecialista}
          >
            <FaPlus className="me-2" />
            Nuevo especialista
          </button>

        </div>
      </div>
    </div>
  );
};

export default EspecialistaHeader;