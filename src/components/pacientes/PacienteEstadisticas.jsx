import { FaUserInjured } from "react-icons/fa";

const PacienteEstadisticas = ({
  total,
  activos,
  menores,
  inactivos,
}) => (
  <div className="row g-3 mb-4">
    <div className="col-6 col-lg-3">
      <div className="paciente-stat-card">
        <div className="paciente-stat-icon purple">
          <FaUserInjured />
        </div>
        <div>
          <small>Total pacientes</small>
          <h3>{total}</h3>
        </div>
      </div>
    </div>

    <div className="col-6 col-lg-3">
      <div className="paciente-stat-card">
        <div className="paciente-stat-icon turquoise">
          <span>✓</span>
        </div>
        <div>
          <small>Pacientes activos</small>
          <h3>{activos}</h3>
        </div>
      </div>
    </div>

    <div className="col-6 col-lg-3">
      <div className="paciente-stat-card">
        <div className="paciente-stat-icon yellow">
          <span>18</span>
        </div>
        <div>
          <small>Menores de edad</small>
          <h3>{menores}</h3>
        </div>
      </div>
    </div>

    <div className="col-6 col-lg-3">
      <div className="paciente-stat-card">
        <div className="paciente-stat-icon fuchsia">
          <span>!</span>
        </div>
        <div>
          <small>Inactivos</small>
          <h3>{inactivos}</h3>
        </div>
      </div>
    </div>
  </div>
);

export default PacienteEstadisticas;
