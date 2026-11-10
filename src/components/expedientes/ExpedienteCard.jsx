
import {
  FaEye,
  FaFileMedical,
  FaPen,
  FaPlus,
  FaUser,
} from "react-icons/fa";

export default function ExpedienteCard({
  paciente,
  onVer,
  onCrear,
  onEditar,
}) {
  const tieneExpediente = Boolean(paciente.expediente);
  const nombre = `${paciente.nombres || ""} ${
    paciente.apellidos || ""
  }`.trim();

  return (
    <article className="expedientes-mobile-card">
      <div className="expedientes-mobile-card-header">
        <span className="expedientes-avatar">
          <FaUser />
        </span>

        <div className="expedientes-mobile-paciente">
          <h3>{nombre || "Sin nombre"}</h3>
          <span>{paciente.codigo_expediente || "Sin código"}</span>
        </div>

        <span
          className={`expedientes-status ${
            tieneExpediente ? "con-expediente" : "sin-expediente"
          }`}
        >
          {tieneExpediente ? "Registrada" : "Pendiente"}
        </span>
      </div>

      <div className="expedientes-mobile-info">
        <div>
          <span>Teléfono</span>
          <strong>{paciente.telefono || "No registrado"}</strong>
        </div>
        <div>
          <span>Procedencia</span>
          <strong>{paciente.procedencia || "No registrada"}</strong>
        </div>
      </div>

      <div className="expedientes-mobile-actions">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => onVer(paciente)}
        >
          <FaEye /> Ver detalle
        </button>

        {tieneExpediente ? (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => onEditar(paciente)}
          >
            <FaPen /> Editar ficha
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onCrear(paciente)}
          >
            <FaPlus /> Crear ficha
          </button>
        )}
      </div>
    </article>
  );
}
