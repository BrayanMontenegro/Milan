import React from "react";
import {
  FaEye,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaMapMarkerAlt,
  FaPhone
} from "react-icons/fa";

const calcularEdad = (fechaNacimiento) => {

  if (!fechaNacimiento) {
    return null;
  }

  const nacimiento =
    new Date(fechaNacimiento);

  const hoy =
    new Date();

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

const obtenerIniciales = (
  nombres = "",
  apellidos = ""
) => {

  return (
    nombres.trim().charAt(0) +
    apellidos.trim().charAt(0)
  ).toUpperCase();
};

const PacienteCard = ({
  paciente,
  onVer,
  onEditar,
  onCambiarEstado
}) => {

  const edad =
    calcularEdad(
      paciente.fecha_nacimiento
    );

  const iniciales =
    obtenerIniciales(
      paciente.nombres,
      paciente.apellidos
    );

  return (
    <div className="paciente-mobile-card">

      <div className="d-flex justify-content-between align-items-start">

        <div className="d-flex align-items-center gap-3">

          <div className="paciente-avatar">
            {iniciales}
          </div>

          <div>

            <div className="paciente-name">
              {paciente.nombres}{" "}
              {paciente.apellidos}
            </div>

            <div className="paciente-expediente">
              {paciente.codigo_expediente || "Sin expediente"}
            </div>

          </div>

        </div>

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

      </div>

      <div className="paciente-mobile-info">

        <div>
          <strong>Edad</strong>
          <span>
            {edad !== null
              ? `${edad} años`
              : "-"}
          </span>
        </div>

        <div>
          <strong>
            <FaMapMarkerAlt className="me-1" />
            Procedencia
          </strong>

          <span>
            {paciente.procedencia || "-"}
          </span>
        </div>

        <div>
          <strong>
            <FaPhone className="me-1" />
            Teléfono
          </strong>

          <span>
            {paciente.telefono || "-"}
          </span>
        </div>

      </div>

      <div className="paciente-mobile-actions">

        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() =>
            onVer?.(paciente)
          }
        >
          <FaEye className="me-1" />
          Ver
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            onEditar?.(paciente)
          }
        >
          <FaEdit className="me-1" />
          Editar
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            onCambiarEstado?.(paciente)
          }
        >
          {paciente.activo ? (
            <>
              <FaToggleOff className="me-1" />
              Desactivar
            </>
          ) : (
            <>
              <FaToggleOn className="me-1" />
              Activar
            </>
          )}
        </button>

      </div>

    </div>
  );
};

export default PacienteCard;