import React from "react";
import { FaCalendarCheck, FaCheckCircle } from "react-icons/fa";

const CitaCreationSummary = ({ flow, formatearFecha, formatearHora }) => (
  <aside className="crear-cita-resumen">
    <div className="crear-cita-resumen-header">
      <FaCalendarCheck />
      <div>
        <h3>Resumen de la cita</h3>
        <span>Información seleccionada</span>
      </div>
    </div>

    <div className="crear-cita-resumen-body">
      <div className="crear-cita-resumen-item">
        <span>Paciente</span>
        <strong>
          {flow.paciente
            ? `${flow.paciente.nombres} ${flow.paciente.apellidos}`
            : "Sin seleccionar"}
        </strong>
        {flow.paciente && <small>{flow.paciente.codigo_expediente}</small>}
      </div>
      <div className="crear-cita-resumen-item">
        <span>Especialidad</span>
        <strong>{flow.especialidad?.nombre || "Sin seleccionar"}</strong>
      </div>
      <div className="crear-cita-resumen-item">
        <span>Especialista</span>
        <strong>
          {flow.especialista
            ? `Dr(a). ${flow.especialista.nombres} ${flow.especialista.apellidos}`
            : "Sin seleccionar"}
        </strong>
        {flow.especialista?.codigo_profesional && (
          <small>Código: {flow.especialista.codigo_profesional}</small>
        )}
      </div>
      <div className="crear-cita-resumen-item">
        <span>Fecha</span>
        <strong>
          {flow.fecha ? formatearFecha(flow.fecha) : "Sin seleccionar"}
        </strong>
      </div>
      <div className="crear-cita-resumen-item">
        <span>Horario</span>
        <strong>
          {flow.horario
            ? `${formatearHora(flow.horario.hora_inicio)} - ${formatearHora(
                flow.horario.hora_fin
              )}`
            : "Sin seleccionar"}
        </strong>
      </div>
      <div className="crear-cita-resumen-item">
        <span>Tipo de consulta</span>
        <strong>
          {flow.datosCita.tipo_consulta === "PRIMERA_VEZ"
            ? "Primera vez"
            : "Seguimiento"}
        </strong>
      </div>
    </div>

    <div className="crear-cita-resumen-footer">
      <button
        type="button"
        className="btn btn-light"
        onClick={flow.limpiarSeleccion}
        disabled={flow.guardando}
      >
        Limpiar selección
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={flow.guardarCita}
        disabled={!flow.resumenCompleto || flow.guardando}
      >
        {flow.guardando ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
            Guardando...
          </>
        ) : (
          <>
            <FaCalendarCheck />
            Confirmar cita
          </>
        )}
      </button>
    </div>

    {!flow.resumenCompleto && (
      <div className="crear-cita-resumen-ayuda">
        <FaCheckCircle />
        <span>Complete los datos requeridos para confirmar la cita.</span>
      </div>
    )}
  </aside>
);

export default CitaCreationSummary;
