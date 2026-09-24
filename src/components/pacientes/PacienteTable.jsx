import React from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

const obtenerIniciales = (nombres = "", apellidos = "") => {
  const nombre = nombres.trim().charAt(0);
  const apellido = apellidos.trim().charAt(0);

  return `${nombre}${apellido}`.toUpperCase();
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) {
    return "-";
  }

  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad =
    hoy.getFullYear() -
    nacimiento.getFullYear();

  const mes =
    hoy.getMonth() -
    nacimiento.getMonth();

  if (
    mes < 0 ||
    (
      mes === 0 &&
      hoy.getDate() < nacimiento.getDate()
    )
  ) {
    edad--;
  }

  return edad;
};

const PacienteTabla = ({
  pacientes = [],
  onVer,
  onEditar,
  onCambiarEstado,
  onEliminar
}) => {

  const confirmarEliminacion = (paciente) => {

    const nombrePaciente =
      `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim();

    const confirmar = window.confirm(
      `¿Está seguro de eliminar al paciente "${nombrePaciente}"?\n\n` +
      `Esta acción eliminará permanentemente el registro.`
    );

    if (confirmar) {
      onEliminar?.(paciente);
    }
  };

  return (
    <div className="pacientes-table-wrapper">

      <table className="table pacientes-table align-middle mb-0">

        <thead>
          <tr>

            <th>
              Expediente
            </th>

            <th>
              Paciente
            </th>

            <th>
              Edad
            </th>

            <th>
              Procedencia
            </th>

            <th>
              Teléfono
            </th>

            <th>
              Estado
            </th>

            <th className="text-center">
              Acciones
            </th>

          </tr>
        </thead>

        <tbody>

          {pacientes.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                className="text-center py-5"
              >
                <div className="pacientes-empty">

                  <div className="pacientes-empty-icon">
                    <FaEye />
                  </div>

                  <h5>
                    No se encontraron pacientes
                  </h5>

                  <p>
                    No hay pacientes que coincidan
                    con los filtros seleccionados.
                  </p>

                </div>
              </td>

            </tr>

          ) : (

            pacientes.map((paciente) => {

              const iniciales =
                obtenerIniciales(
                  paciente.nombres,
                  paciente.apellidos
                );

              const edad =
                calcularEdad(
                  paciente.fecha_nacimiento
                );

              return (
                <tr
                  key={paciente.id_paciente}
                >

                  {/* Expediente */}
                  <td>

                    <span className="paciente-expediente">
                      {paciente.codigo_expediente || "N/A"}
                    </span>

                  </td>

                  {/* Paciente */}
                  <td>

                    <div className="d-flex align-items-center gap-3">

                      <div className="paciente-avatar">
                        {iniciales}
                      </div>

                      <div>

                        <div className="paciente-name">
                          {paciente.nombres}{" "}
                          {paciente.apellidos}
                        </div>

                        <small className="paciente-id">
                          ID: {paciente.id_paciente}
                        </small>

                      </div>

                    </div>

                  </td>

                  {/* Edad */}
                  <td>

                    <span className="paciente-age">
                      {edad !== "-"
                        ? `${edad} años`
                        : "-"}
                    </span>

                  </td>

                  {/* Procedencia */}
                  <td>
                    {paciente.procedencia || "-"}
                  </td>

                  {/* Teléfono */}
                  <td>
                    {paciente.telefono || "-"}
                  </td>

                  {/* Estado */}
                  <td>

                    <span
                      className={
                        paciente.activo
                          ? "paciente-status activo"
                          : "paciente-status inactivo"
                      }
                    >
                      {paciente.activo
                        ? "Activo"
                        : "Inactivo"}
                    </span>

                  </td>

                  {/* Acciones */}
                  <td>

                    <div className="d-flex justify-content-center gap-1">

                      {/* Ver */}
                      <button
                        type="button"
                        className="paciente-action-btn"
                        title="Ver paciente"
                        onClick={() =>
                          onVer?.(paciente)
                        }
                      >
                        <FaEye />
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        className="paciente-action-btn"
                        title="Editar paciente"
                        onClick={() =>
                          onEditar?.(paciente)
                        }
                      >
                        <FaEdit />
                      </button>

                      {/* Activar / Desactivar */}
                      <button
                        type="button"
                        className="paciente-action-btn"
                        title={
                          paciente.activo
                            ? "Desactivar paciente"
                            : "Activar paciente"
                        }
                        onClick={() =>
                          onCambiarEstado?.(paciente)
                        }
                      >
                        {paciente.activo ? (
                          <FaToggleOn />
                        ) : (
                          <FaToggleOff />
                        )}
                      </button>

                      {/* Eliminar */}
                      <button
                        type="button"
                        className="paciente-action-btn"
                        title="Eliminar paciente"
                        onClick={() =>
                          confirmarEliminacion(paciente)
                        }
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })

          )}

        </tbody>

      </table>

    </div>
  );
};

export default PacienteTabla;