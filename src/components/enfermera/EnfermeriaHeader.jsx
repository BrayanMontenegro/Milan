import React from "react";
import { FaHeartbeat } from "react-icons/fa";

const EnfermeriaHeader = () => {
  return (
    <div className="enfermeria-header">
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          <div className="d-flex align-items-center gap-3">
            <div className="enfermeria-header-icon">
              <FaHeartbeat />
            </div>

            <div>
              <h2 className="mb-1">Enfermería</h2>
              <p className="mb-0">
                Control y toma de signos vitales de pacientes
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnfermeriaHeader;