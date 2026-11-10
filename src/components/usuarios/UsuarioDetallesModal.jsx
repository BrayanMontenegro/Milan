import { Button, Modal } from "react-bootstrap";
import { FiEye } from "react-icons/fi";

const UsuarioDetallesModal = ({
  mostrar,
  onCerrar,
  usuario,
  obtenerNombreRol,
  nombreRolMostrar,
}) => (
  <Modal show={mostrar} onHide={onCerrar} centered>
    <Modal.Header closeButton>
      <Modal.Title>
        <FiEye />
        Detalles del usuario
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {usuario && (
        <div className="usuario-detalles">
          <div className="usuario-detalle-avatar">
            {`${usuario.nombres?.charAt(0) || ""}${
              usuario.apellidos?.charAt(0) || ""
            }`.toUpperCase()}
          </div>
          <h4>
            {usuario.nombres} {usuario.apellidos}
          </h4>
          <span className="rol-badge">
            {nombreRolMostrar(obtenerNombreRol(usuario))}
          </span>

          <div className="usuario-detalle-list">
            <div>
              <span>ID de usuario:</span>
              <strong>{usuario.id_usuario}</strong>
            </div>
            <div>
              <span>Teléfono:</span>
              <strong>{usuario.telefono || "No registrado"}</strong>
            </div>
            <div>
              <span>Estado:</span>
              <strong>{usuario.activo ? "Activo" : "Inactivo"}</strong>
            </div>
            <div>
              <span>Fecha de registro:</span>
              <strong>
                {usuario.created_at
                  ? new Date(usuario.created_at).toLocaleString("es-NI")
                  : "No disponible"}
              </strong>
            </div>
            <div>
              <span>Última actualización:</span>
              <strong>
                {usuario.updated_at
                  ? new Date(usuario.updated_at).toLocaleString("es-NI")
                  : "No disponible"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </Modal.Body>

    <Modal.Footer>
      <Button variant="light" onClick={onCerrar}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);

export default UsuarioDetallesModal;
