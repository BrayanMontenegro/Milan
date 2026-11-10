
import {
  FaEye,
  FaFileMedical,
  FaPen,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import TablaEncabezado from "../TablaEncabezado";

const COLUMNAS_EXPEDIENTES = [
  { etiqueta: "Paciente" },
  { etiqueta: "Código de paciente" },
  { etiqueta: "Contacto" },
  { etiqueta: "Procedencia" },
  { etiqueta: "Ficha médica" },
  { etiqueta: "Acciones", className: "text-center" },
];

export default function ExpedienteTabla({
  pacientes,
  onVer,
  onCrear,
  onEditar,
}) {
  return (
    <div className="table-responsive expedientes-table-wrapper">
      <table className="table expedientes-table align-middle">
        <TablaEncabezado columnas={COLUMNAS_EXPEDIENTES} />

        <tbody>
          {pacientes.map((paciente) => {
            const tieneExpediente = Boolean(paciente.expediente);
            const nombre = `${paciente.nombres || ""} ${
              paciente.apellidos || ""
            }`.trim();

            return (
              <tr key={paciente.id_paciente}>
                <td>
                  <div className="expedientes-paciente-cell">
                    <span className="expedientes-avatar">
                      <FaUser />
                    </span>
                    <div>
                      <strong>{nombre || "Sin nombre"}</strong>
                      <small>
                        {paciente.sexo || "Sexo no registrado"}
                        {paciente.fecha_nacimiento
                          ? ` · ${calcularEdad(paciente.fecha_nacimiento)} años`
                          : ""}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="expedientes-code">
                    {paciente.codigo_expediente || "Sin código"}
                  </span>
                </td>

                <td>{paciente.telefono || "No registrado"}</td>
                <td>{paciente.procedencia || "No registrada"}</td>

                <td>
                  <span
                    className={`expedientes-status ${
                      tieneExpediente ? "con-expediente" : "sin-expediente"
                    }`}
                  >
                    {tieneExpediente ? "Registrada" : "Pendiente"}
                  </span>
                </td>

                <td>
                  <div className="expedientes-actions">
                    <button
                      type="button"
                      className="btn expedientes-action-view"
                      onClick={() => onVer(paciente)}
                      title="Ver información e historial"
                      aria-label={`Ver expediente de ${nombre}`}
                    >
                      <FaEye />
                    </button>

                    {tieneExpediente ? (
                      <button
                        type="button"
                        className="btn expedientes-action-edit"
                        onClick={() => onEditar(paciente)}
                        title="Editar ficha médica"
                        aria-label={`Editar ficha de ${nombre}`}
                      >
                        <FaPen />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn expedientes-action-create"
                        onClick={() => onCrear(paciente)}
                        title="Crear ficha médica"
                        aria-label={`Crear ficha de ${nombre}`}
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "";

  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return "";

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const faltaCumplir =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() < nacimiento.getDate());

  if (faltaCumplir) edad -= 1;

  return edad >= 0 ? edad : "";
}
