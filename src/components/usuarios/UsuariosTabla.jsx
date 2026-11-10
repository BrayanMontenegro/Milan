import { Badge, Button, Table } from "react-bootstrap";
import {
  FiEdit,
  FiEye,
  FiUser,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

const UsuariosTabla = ({
  usuariosFiltrados,
  usuarios,
  obtenerNombreRol,
  nombreRolMostrar,
  onVerDetalles,
  onEditar,
  onCambiarEstado,
}) => (
  <>
    <div className="table-responsive usuarios-table-wrapper">
      <Table hover className="usuarios-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="5" className="usuarios-empty">
                <FiUser />
                <strong>No se encontraron usuarios</strong>
                <span>Intenta modificar los filtros de búsqueda.</span>
              </td>
            </tr>
          ) : (
            usuariosFiltrados.map((usuarioActual) => {
              const nombreRol = obtenerNombreRol(usuarioActual);
              const iniciales = `${
                usuarioActual.nombres?.charAt(0) || ""
              }${usuarioActual.apellidos?.charAt(0) || ""}`.toUpperCase();

              return (
                <tr key={usuarioActual.id_usuario}>
                  <td>
                    <div className="usuario-cell">
                      <div className="usuario-table-avatar">{iniciales}</div>
                      <div>
                        <strong>
                          {usuarioActual.nombres} {usuarioActual.apellidos}
                        </strong>
                        <small>Usuario del sistema</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="rol-badge">
                      {nombreRolMostrar(nombreRol)}
                    </span>
                  </td>
                  <td>
                    {usuarioActual.activo ? (
                      <Badge bg="success" className="estado-badge">
                        Activo
                      </Badge>
                    ) : (
                      <Badge bg="secondary" className="estado-badge">
                        Inactivo
                      </Badge>
                    )}
                  </td>
                  <td>
                    {usuarioActual.created_at
                      ? new Date(usuarioActual.created_at).toLocaleDateString(
                          "es-NI",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </td>
                  <td>
                    <div className="usuarios-actions">
                      <Button
                        variant="light"
                        className="action-btn"
                        title="Ver detalles"
                        onClick={() => onVerDetalles(usuarioActual)}
                      >
                        <FiEye />
                      </Button>
                      <Button
                        variant="light"
                        className="action-btn"
                        title="Editar"
                        onClick={() => onEditar(usuarioActual)}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        variant="light"
                        className={
                          usuarioActual.activo
                            ? "action-btn danger"
                            : "action-btn success"
                        }
                        title={usuarioActual.activo ? "Desactivar" : "Activar"}
                        onClick={() => onCambiarEstado(usuarioActual)}
                      >
                        {usuarioActual.activo ? <FiUserX /> : <FiUserCheck />}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>

    <div className="usuarios-footer">
      Mostrando <strong>{usuariosFiltrados.length}</strong> de{" "}
      <strong>{usuarios.length}</strong> usuarios
    </div>
  </>
);

export default UsuariosTabla;
