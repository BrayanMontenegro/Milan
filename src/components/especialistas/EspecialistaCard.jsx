import React from "react";
import {
  FaEye,
  FaEdit,
  FaPowerOff,
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialistaCard = ({
  especialista,
  onVer,
  onEditar,
  onCambiarEstado,
}) => {
  const nombreCompleto =
    `${especialista.nombres} ${especialista.apellidos}`;

  return (
    <div className="especialista-mobile-card">

      <div className="d-flex justify-content-between align-items-start gap-3">

        <div className="d-flex align-items-center gap-3">

          <div className="especialista-avatar">
            <FaUserMd />
          </div>

          <div>
            <h6 className="mb-1">
              {nombreCompleto}
            </h6>

            <span className="especialidad-badge">
              {especialista.especialidades?.nombre ||
                "Sin especialidad"}
            </span>
          </div>

        </div>

        {especialista.activo ? (
          <span className="estado-badge activo">
            Activo
          </span>
        ) : (
          <span className="estado-badge inactivo">
            Inactivo
          </span>
        )}

      </div>

      <hr />

      <div className="especialista-card-info">

        <div>
          <FaIdCard />
          <span>
            {especialista.codigo_profesional ||
              "Sin código"}
          </span>
        </div>

        <div>
          <FaPhone />
          <span>
            {especialista.telefono ||
              "Sin teléfono"}
          </span>
        </div>

        <div>
          <FaEnvelope />
          <span>
            {especialista.correo ||
              "Sin correo"}
          </span>
        </div>

      </div>

      <div className="d-flex gap-2 mt-3">

        <button
          type="button"
          className="btn btn-outline-primary flex-fill"
          onClick={() => onVer(especialista)}
        >
          <FaEye className="me-2" />
          Ver
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary flex-fill"
          onClick={() => onEditar(especialista)}
        >
          <FaEdit className="me-2" />
          Editar
        </button>

        <button
          type="button"
          className={`btn ${
            especialista.activo
              ? "btn-outline-danger"
              : "btn-outline-success"
          }`}
          onClick={() =>
            onCambiarEstado(especialista)
          }
        >
          <FaPowerOff />
        </button>

      </div>

    </div>
  );
};

export default EspecialistaCard;