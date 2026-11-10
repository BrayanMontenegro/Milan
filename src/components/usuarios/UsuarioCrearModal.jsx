import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { FiPlus, FiShield, FiUser } from "react-icons/fi";

const UsuarioCrearModal = ({
  mostrar,
  onCerrar,
  formulario,
  cambiarFormulario,
  onSubmit,
  guardando,
  error,
  roles,
  nombreRolMostrar,
}) => (
  <Modal show={mostrar} onHide={onCerrar} centered size="lg">
    <Form onSubmit={onSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FiUser />
          Nuevo usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese los nombres"
                value={formulario.nombres}
                onChange={(event) =>
                  cambiarFormulario("nombres", event.target.value)
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
                placeholder="Ingrese los apellidos"
                value={formulario.apellidos}
                onChange={(event) =>
                  cambiarFormulario("apellidos", event.target.value)
                }
                disabled={guardando}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="usuario@clinicamilan.com"
                value={formulario.email}
                onChange={(event) =>
                  cambiarFormulario("email", event.target.value)
                }
                disabled={guardando}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formulario.password}
                onChange={(event) =>
                  cambiarFormulario("password", event.target.value)
                }
                disabled={guardando}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formulario.id_rol}
                onChange={(event) =>
                  cambiarFormulario("id_rol", event.target.value)
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

        <div className="usuario-form-info">
          <FiShield />
          <span>
            El usuario podrá iniciar sesión utilizando el correo y contraseña
            registrados.
          </span>
        </div>
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
              Creando...
            </>
          ) : (
            <>
              <FiPlus />
              Crear usuario
            </>
          )}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default UsuarioCrearModal;
