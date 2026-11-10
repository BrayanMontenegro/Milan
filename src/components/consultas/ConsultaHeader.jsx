import React from "react";
import {
  FaStethoscope,
  FaCalendarDay,
} from "react-icons/fa";

const ConsultaHeader = ({
  total,
  confirmadas,
  pendientes,
}) => {
  return (
    <div className="consulta-header">

      <div className="consulta-header-contenido">

        <div className="consulta-header-icono">
          <FaStethoscope />
        </div>

        <div>
          <h2>Consultas de hoy</h2>

          <p>
            Atención de pacientes confirmados después
            del proceso de enfermería.
          </p>
        </div>

      </div>

      <div className="consulta-header-estadisticas">

        <div className="consulta-stat">
          <FaCalendarDay />

          <div>
            <strong>{total}</strong>
            <span>Total</span>
          </div>
        </div>

        <div className="consulta-stat consulta-stat-confirmada">

          <div>
            <strong>{confirmadas}</strong>
            <span>Listos para consulta</span>
          </div>

        </div>

        <div className="consulta-stat consulta-stat-pendiente">

          <div>
            <strong>{pendientes}</strong>
            <span>Pendientes</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ConsultaHeader;