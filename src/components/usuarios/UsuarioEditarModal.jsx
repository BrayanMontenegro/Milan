import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";

const UsuarioEditarModal = ({
  mostrar,
  onCerrar,
  formulario,
  setFormulario,
  onSubmit,
  guardando,
  error,
  roles,
  nombreRolMostrar,
}) => (
  <Modal show={mostrar} onHide={onCerrar} centered>
    <Form onSubmit={onSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FiEdit />
          Editar usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                value={formulario.nombres}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    nombres: event.target.value,
                  })
                }
                disabled={guardando}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                value={formulario.apellidos}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    apellidos: event.target.value,
                  })
                }
                disabled={guardando}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formulario.id_rol}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    id_rol: event.target.value,
                  })
                }
                disabled={guardando}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {nombreRolMostrar(rol.nombre)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onCerrar} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-primary-custom"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <Spinner size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            <>
              <FiEdit />
              Guardar cambios
            </>
          )}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default UsuarioEditarModal;
