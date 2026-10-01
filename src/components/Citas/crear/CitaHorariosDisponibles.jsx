import React from "react";
import {
  FaClock,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

const formatearHora = (hora) => {
  if (!hora) return "";

  const [horas, minutos] =
    hora.slice(0, 5).split(":");

  let h = Number(horas);

  const periodo =
    h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${minutos} ${periodo}`;
};

const CitaHorariosDisponibles = ({
  horarios = [],
  horarioSeleccionado,
  onSeleccionar,
  cargando = false,
}) => {

  if (cargando) {
    return (
      <div className="cita-selector-cargando">
        <div
          className="spinner-border spinner-border-sm"
          role="status"
        />
        <span>
          Calculando horarios disponibles...
        </span>
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div className="cita-selector-vacio">
        <FaClock />

        <strong>
          No hay horarios disponibles
        </strong>

        <span>
          Seleccione otra fecha o revise el
          horario del especialista.
        </span>
      </div>
    );
  }

  return (
    <div className="cita-horarios-grid">

      {horarios.map((horario) => {

        const seleccionado =
          horarioSeleccionado?.hora_inicio ===
            horario.hora_inicio &&
          horarioSeleccionado?.hora_fin ===
            horario.hora_fin;

        return (
          <button
            type="button"
            key={`${horario.hora_inicio}-${horario.hora_fin}`}
            className={`cita-horario-card ${
              seleccionado
                ? "seleccionado"
                : ""
            }`}
            onClick={() =>
              onSeleccionar(horario)
            }
          >

            <FaClock />

            <div>
              <strong>
                {formatearHora(
                  horario.hora_inicio
                )}
              </strong>

              <span>
                {formatearHora(
                  horario.hora_fin
                )}
              </span>
            </div>

            {horario.citas > 0 && (
              <small>
                <FaUsers />
                {horario.citas} cita
                {horario.citas !== 1
                  ? "s"
                  : ""}
              </small>
            )}

            {seleccionado && (
              <FaCheckCircle className="cita-horario-check" />
            )}

          </button>
        );
      })}

    </div>
  );
};

export default CitaHorariosDisponibles;