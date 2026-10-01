import React from "react";
import {
  FaUserMd,
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const diasSemana = [
  { valor: 1, nombre: "Lunes" },
  { valor: 2, nombre: "Martes" },
  { valor: 3, nombre: "Miércoles" },
  { valor: 4, nombre: "Jueves" },
  { valor: 5, nombre: "Viernes" },
  { valor: 6, nombre: "Sábado" },
  { valor: 0, nombre: "Domingo" },
];

const ordenDias = [1, 2, 3, 4, 5, 6, 0];

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

const CitaEspecialistasDisponibles = ({
  especialistas = [],
  especialista,
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
          Consultando especialistas...
        </span>

      </div>
    );
  }

  if (especialistas.length === 0) {
    return (
      <div className="cita-selector-vacio">

        <FaUserMd />

        <strong>
          No hay especialistas disponibles
        </strong>

        <span>
          No se encontraron especialistas
          activos para esta especialidad.
        </span>

      </div>
    );
  }

  return (
    <div>

      <div className="mb-3">
        <small className="text-muted">
          {especialistas.length}{" "}
          {especialistas.length === 1
            ? "especialista encontrado"
            : "especialistas encontrados"}
        </small>
      </div>

      <div className="cita-especialistas-grid">

        {especialistas.map((item) => {

          const seleccionado =
            especialista?.id_especialista ===
            item.id_especialista;

          const horarios =
            item.horarios || [];

          const dias = [
            ...new Set(
              horarios.map(
                (horario) =>
                  Number(
                    horario.dia_semana
                  )
              )
            ),
          ].sort(
            (a, b) =>
              ordenDias.indexOf(a) -
              ordenDias.indexOf(b)
          );

          return (
            <button
              type="button"
              key={item.id_especialista}
              className={`cita-especialista-card ${
                seleccionado
                  ? "seleccionado"
                  : ""
              }`}
              onClick={() =>
                onSeleccionar(item)
              }
            >

              <div className="cita-especialista-avatar">
                <FaUserMd />
              </div>

              <div className="cita-especialista-contenido">

                <div className="cita-especialista-nombre">

                  <strong>
                    Dr(a).{" "}
                    {item.nombres}{" "}
                    {item.apellidos}
                  </strong>

                  {seleccionado && (
                    <FaCheckCircle />
                  )}

                </div>

                <span className="cita-especialista-codigo">
                  Código:{" "}
                  {item.codigo_profesional ||
                    "Sin código"}
                </span>

                <div className="cita-especialista-datos">

                  <span>
                    <FaCalendarAlt />

                    {dias.length > 0
                      ? dias
                          .map((dia) => {
                            const encontrado =
                              diasSemana.find(
                                (item) =>
                                  item.valor ===
                                  dia
                              );

                            return encontrado
                              ? encontrado.nombre.slice(
                                  0,
                                  3
                                )
                              : "";
                          })
                          .join(", ")
                      : "Sin horario registrado"}
                  </span>

                  {horarios.length > 0 && (
                    <span>
                      <FaClock />

                      {formatearHora(
                        horarios[0]
                          .hora_inicio
                      )}{" "}
                      -{" "}
                      {formatearHora(
                        horarios[0]
                          .hora_fin
                      )}
                    </span>
                  )}

                </div>

                <div className="cita-especialista-cola">

                  <FaUsers />

                  <span>
                    {item.citas_hoy || 0}{" "}
                    citas en la fecha
                    seleccionada
                  </span>

                </div>

              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
};

export default CitaEspecialistasDisponibles;