import { FaUserMd } from "react-icons/fa";

const EspecialistasEstadisticas = ({ estadisticas }) => (
  <div className="row g-3 mb-4">
    <div className="col-6 col-xl-3">
      <div className="especialista-stat-card">
        <div className="especialista-stat-icon purple">
          <FaUserMd />
        </div>
        <div>
          <span>Total</span>
          <strong>{estadisticas.total}</strong>
        </div>
      </div>
    </div>

    <div className="col-6 col-xl-3">
      <div className="especialista-stat-card">
        <div className="especialista-stat-icon turquoise">
          <FaUserMd />
        </div>
        <div>
          <span>Activos</span>
          <strong>{estadisticas.activos}</strong>
        </div>
      </div>
    </div>

    <div className="col-6 col-xl-3">
      <div className="especialista-stat-card">
        <div className="especialista-stat-icon yellow">
          <FaUserMd />
        </div>
        <div>
          <span>Inactivos</span>
          <strong>{estadisticas.inactivos}</strong>
        </div>
      </div>
    </div>

    <div className="col-6 col-xl-3">
      <div className="especialista-stat-card">
        <div className="especialista-stat-icon fuchsia">
          <FaUserMd />
        </div>
        <div>
          <span>Especialidades</span>
          <strong>{estadisticas.especialidadesUsadas}</strong>
        </div>
      </div>
    </div>
  </div>
);

export default EspecialistasEstadisticas;
