import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const EspecialistaHorarioPanel = ({
  especialista,
  diasSemana,
  obtenerHorariosDia,
  formatearHora,
  abrirNuevoHorario,
  abrirEditarHorario,
  eliminarHorario,
}) => (
  <>
    <div className="especialista-horario-header">
      <div className="especialista-horario-titulo">
        <span className="especialista-horario-label">
          <FaCalendarAlt />
          Mi horario de atención
        </span>
        <h2>
          {especialista.nombres} {especialista.apellidos}
        </h2>
        <p>
          {especialista.especialidades?.nombre ||
            "Especialidad no asignada"}
        </p>
      </div>

      <div className="especialista-horario-info">
        <span>Código profesional</span>
        <strong>
          {especialista.codigo_profesional || "No asignado"}
        </strong>
      </div>
    </div>

    <div className="especialista-horario-toolbar">
      <div>
        <h4>Horarios de atención</h4>
        <p>
          Configure los días y horas en los que estará disponible para atender.
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={abrirNuevoHorario}
      >
        <FaPlus />
        Agregar horario
      </button>
    </div>

    <div className="especialista-horario-grid">
      {diasSemana.map((dia) => {
        const horariosDia = obtenerHorariosDia(dia.valor);

        return (
          <div
            className="especialista-horario-dia"
            key={dia.valor}
          >
            <div className="especialista-horario-dia-header">
              <h5>{dia.nombre}</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={abrirNuevoHorario}
                title={`Agregar horario para ${dia.nombre}`}
              >
                <FaPlus />
              </button>
            </div>

            <div className="especialista-horario-dia-body">
              {horariosDia.length === 0 ? (
                <div className="horario-sin-registro">
                  <FaClock />
                  <span>No hay horario configurado</span>
                </div>
              ) : (
                horariosDia.map((horario) => (
                  <div
                    className="horario-bloque"
                    key={horario.id_horario}
                  >
                    <div className="horario-bloque-horas">
                      <FaClock />
                      <span>
                        {formatearHora(horario.hora_inicio)}
                        {" - "}
                        {formatearHora(horario.hora_fin)}
                      </span>
                    </div>

                    <div className="horario-bloque-acciones">
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        title="Editar horario"
                        onClick={() => abrirEditarHorario(horario)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light text-danger"
                        title="Eliminar horario"
                        onClick={() => eliminarHorario(horario)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  </>
);

export default EspecialistaHorarioPanel;
