import React, { useEffect, useState } from "react";
import { FaClock, FaCalendarAlt, FaTimes, FaSave } from "react-icons/fa";
import "../../../styles/EspecialistaHorario.css";

const diasSemana = [
  { valor: 1, nombre: "Lunes" },
  { valor: 2, nombre: "Martes" },
  { valor: 3, nombre: "Miércoles" },
  { valor: 4, nombre: "Jueves" },
  { valor: 5, nombre: "Viernes" },    
  { valor: 6, nombre: "Sábado" },
  { valor: 0, nombre: "Domingo" },
];

const HorarioModal = ({
  mostrar,
  horarioEditar = null,
  horarios = [],
  onCerrar,
  onGuardar,
}) => {
  const [diaSemana, setDiaSemana] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     CARGAR DATOS AL EDITAR
  ========================================================= */

  useEffect(() => {
    if (!mostrar) return;

    setError("");

    if (horarioEditar) {
      setDiaSemana(String(horarioEditar.dia_semana));
      setHoraInicio(horarioEditar.hora_inicio?.slice(0, 5) || "");
      setHoraFin(horarioEditar.hora_fin?.slice(0, 5) || "");
    } else {
      setDiaSemana("");
      setHoraInicio("");
      setHoraFin("");
    }
  }, [mostrar, horarioEditar]);

  /* =========================================================
     CERRAR
  ========================================================= */

  const cerrarModal = () => {
    if (guardando) return;

    setError("");
    onCerrar();
  };

  /* =========================================================
     VALIDAR HORARIO
  ========================================================= */

  const validarHorario = () => {
    if (diaSemana === "") {
      return "Seleccione un día de la semana.";
    }

    if (!horaInicio) {
      return "Seleccione la hora de inicio.";
    }

    if (!horaFin) {
      return "Seleccione la hora de finalización.";
    }

    if (horaFin <= horaInicio) {
      return "La hora de finalización debe ser posterior a la hora de inicio.";
    }

    /*
      Comprobar horarios superpuestos.

      Ejemplo:

      Existente:
      08:00 - 12:00

      No permitir:
      09:00 - 10:00
      11:00 - 13:00
      08:00 - 12:00

      Sí permitir:
      12:00 - 14:00
      06:00 - 08:00
    */

    const horarioSolapado = horarios.some((horario) => {
      // Si estamos editando, ignoramos el propio registro
      if (
        horarioEditar &&
        horario.id_horario === horarioEditar.id_horario
      ) {
        return false;
      }

      if (Number(horario.dia_semana) !== Number(diaSemana)) {
        return false;
      }

      const existenteInicio =
        horario.hora_inicio?.slice(0, 5);

      const existenteFin =
        horario.hora_fin?.slice(0, 5);

      return (
        horaInicio < existenteFin &&
        horaFin > existenteInicio
      );
    });

    if (horarioSolapado) {
      return "El horario se superpone con otro horario existente para ese día.";
    }

    return "";
  };

  /* =========================================================
     GUARDAR
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mensajeError = validarHorario();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await onGuardar({
        id_horario: horarioEditar?.id_horario || null,
        dia_semana: Number(diaSemana),
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      });

    } catch (error) {
      console.error(
        "Error guardando horario:",
        error
      );

      setError(
        error?.message ||
        "No se pudo guardar el horario."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!mostrar) {
    return null;
  }

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
      >
        <div className="modal-content horario-modal">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="modal-header horario-modal-header">

            <div className="horario-modal-titulo">

              <div className="horario-modal-icono">
                <FaClock />
              </div>

              <div>
                <h5 className="modal-title">
                  {horarioEditar
                    ? "Editar horario"
                    : "Agregar horario"}
                </h5>

                <span>
                  Configure su horario de atención
                </span>
              </div>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={cerrarModal}
              disabled={guardando}
              aria-label="Cerrar"
            >
            </button>

          </div>

          {/* =================================================
              BODY
          ================================================== */}

          <form onSubmit={handleSubmit}>

            <div className="modal-body">

              {error && (
                <div
                  className="alert alert-danger horario-modal-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* DÍA */}

              <div className="mb-3">

                <label
                  htmlFor="diaSemana"
                  className="form-label"
                >
                  <FaCalendarAlt />
                  Día de la semana
                </label>

                <select
                  id="diaSemana"
                  className="form-select"
                  value={diaSemana}
                  onChange={(e) =>
                    setDiaSemana(e.target.value)
                  }
                  disabled={guardando}
                >
                  <option value="">
                    Seleccione un día
                  </option>

                  {diasSemana.map((dia) => (
                    <option
                      key={dia.valor}
                      value={dia.valor}
                    >
                      {dia.nombre}
                    </option>
                  ))}
                </select>

              </div>

              {/* HORAS */}

              <div className="row g-3">

                <div className="col-12 col-sm-6">

                  <label
                    htmlFor="horaInicio"
                    className="form-label"
                  >
                    <FaClock />
                    Hora de inicio
                  </label>

                  <input
                    type="time"
                    id="horaInicio"
                    className="form-control"
                    value={horaInicio}
                    onChange={(e) =>
                      setHoraInicio(e.target.value)
                    }
                    disabled={guardando}
                  />

                </div>

                <div className="col-12 col-sm-6">

                  <label
                    htmlFor="horaFin"
                    className="form-label"
                  >
                    <FaClock />
                    Hora de finalización
                  </label>

                  <input
                    type="time"
                    id="horaFin"
                    className="form-control"
                    value={horaFin}
                    onChange={(e) =>
                      setHoraFin(e.target.value)
                    }
                    disabled={guardando}
                  />

                </div>

              </div>

              {/* INFORMACIÓN */}

              <div className="horario-modal-info mt-4">

                <FaClock />

                <div>
                  <strong>
                    Horario de atención
                  </strong>

                  <p>
                    Este horario será utilizado para
                    determinar las horas disponibles
                    al momento de crear una cita.
                  </p>
                </div>

              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="modal-footer horario-modal-footer">

              <button
                type="button"
                className="btn btn-light"
                onClick={cerrarModal}
                disabled={guardando}
              >
                <FaTimes />
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary horario-btn-guardar"
                disabled={guardando}
              >

                {guardando ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    {horarioEditar
                      ? "Guardar cambios"
                      : "Agregar horario"}
                  </>
                )}

              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default HorarioModal;
