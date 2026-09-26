import React from "react";
import {
  FaEye,
  FaEdit,
  FaPowerOff,
  FaUserMd,
} from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialistaTabla = ({
  especialistas,
  onVer,
  onEditar,
  onCambiarEstado,
}) => {
  if (!especialistas.length) {
    return null;
  }

  return (
    <div className="table-responsive">
      <table className="table especialistas-table align-middle mb-0">

        <thead>
          <tr>
            <th>Especialista</th>
            <th>Especialidad</th>
            <th>Código profesional</th>
            <th>Contacto</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {especialistas.map((especialista) => {

            const nombreCompleto =
              `${especialista.nombres} ${especialista.apellidos}`;

            return (
              <tr key={especialista.id_especialista}>

                {/* ESPECIALISTA */}
                <td>
                  <div className="d-flex align-items-center gap-3">

                    <div className="especialista-avatar">
                      <FaUserMd />
                    </div>

                    <div>
                      <div className="fw-semibold">
                        {nombreCompleto}
                      </div>

                      <small className="text-muted">
                        {especialista.correo || "Sin correo"}
                      </small>
                    </div>

                  </div>
                </td>

                {/* ESPECIALIDAD */}
                <td>
                  <span className="especialidad-badge">
                    {especialista.especialidades?.nombre ||
                      "Sin especialidad"}
                  </span>
                </td>

                {/* CÓDIGO */}
                <td>
                  <span className="codigo-profesional">
                    {especialista.codigo_profesional ||
                      "Sin código"}
                  </span>
                </td>

                {/* CONTACTO */}
                <td>
                  {especialista.telefono || (
                    <span className="text-muted">
                      Sin teléfono
                    </span>
                  )}
                </td>

                {/* ESTADO */}
                <td>
                  {especialista.activo ? (
                    <span className="estado-badge activo">
                      Activo
                    </span>
                  ) : (
                    <span className="estado-badge inactivo">
                      Inactivo
                    </span>
                  )}
                </td>

                {/* ACCIONES */}
                <td>
                  <div className="d-flex justify-content-end gap-2">

                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      title="Ver especialista"
                      onClick={() => onVer(especialista)}
                    >
                      <FaEye />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      title="Editar especialista"
                      onClick={() => onEditar(especialista)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      className={`btn btn-sm ${
                        especialista.activo
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                      title={
                        especialista.activo
                          ? "Desactivar"
                          : "Activar"
                      }
                      onClick={() =>
                        onCambiarEstado(especialista)
                      }
                    >
                      <FaPowerOff />
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default EspecialistaTabla;