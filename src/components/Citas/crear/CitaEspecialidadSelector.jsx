import React from "react";
import {
  FaStethoscope,
  FaCheckCircle,
  FaChevronDown,
} from "react-icons/fa";

const CitaEspecialidadSelector = ({
  especialidad,
  especialidades = [],
  onSeleccionar,
  cargando = false,
}) => {
  return (
    <div className="cita-especialidad-selector">

      {cargando ? (
        <div className="cita-selector-cargando">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
          />
          <span>Cargando especialidades...</span>
        </div>
      ) : (
        <div className="cita-especialidades-grid">

          {especialidades.map((item) => {
            const seleccionada =
              especialidad?.id_especialidad ===
              item.id_especialidad;

            return (
              <button
                type="button"
                key={item.id_especialidad}
                className={`cita-especialidad-card ${
                  seleccionada ? "seleccionada" : ""
                }`}
                onClick={() => onSeleccionar(item)}
              >

                <div className="cita-especialidad-icono">
                  <FaStethoscope />
                </div>

                <div className="cita-especialidad-info">
                  <strong>{item.nombre}</strong>

                  {item.descripcion && (
                    <span>{item.descripcion}</span>
                  )}
                </div>

                {seleccionada && (
                  <FaCheckCircle className="cita-especialidad-check" />
                )}

              </button>
            );
          })}

        </div>
      )}

      {!cargando && especialidades.length === 0 && (
        <div className="cita-selector-vacio">
          <FaStethoscope />
          <strong>No hay especialidades disponibles</strong>
          <span>
            Registre una especialidad antes de crear la cita.
          </span>
        </div>
      )}

    </div>
  );
};

export default CitaEspecialidadSelector;