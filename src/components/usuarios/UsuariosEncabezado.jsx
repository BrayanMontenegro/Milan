import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import {
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

const UsuariosEncabezado = ({
  error,
  mensaje,
  onDismissError,
  onDismissMessage,
  onRefresh,
  onCreate,
  cargando,
  total,
  activos,
  inactivos,
  especialistas,
}) => (
  <>
    <div className="usuarios-header">
      <div className="usuarios-header-content">
        <div className="usuarios-header-title">
          <div className="usuarios-header-icon">
            <FiShield />
          </div>
          <div>
            <h2>Usuarios</h2>
            <p>Administración de usuarios y permisos del sistema</p>
          </div>
        </div>

        <div className="usuarios-header-actions">
          <Button
            variant="light"
            className="btn-refresh"
            onClick={onRefresh}
            disabled={cargando}
          >
            <FiRefreshCw />
            Actualizar
          </Button>
          <Button className="btn-primary-custom" onClick={onCreate}>
            <FiPlus />
            Nuevo usuario
          </Button>
        </div>
      </div>
    </div>

    {error && (
      <Alert variant="danger" dismissible onClose={onDismissError}>
        {error}
      </Alert>
    )}

    {mensaje && (
      <Alert variant="success" dismissible onClose={onDismissMessage}>
        {mensaje}
      </Alert>
    )}

    <Row className="g-3 mb-4">
      <Col xs={12} sm={6} xl={3}>
        <Card className="usuario-stat-card">
          <Card.Body>
            <div className="stat-icon"><FiUser /></div>
            <div className="usuario-stat-content">
              <span>Total usuarios:</span>
              <strong>{total}</strong>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <Card className="usuario-stat-card">
          <Card.Body>
            <div className="stat-icon success"><FiUserCheck /></div>
            <div className="usuario-stat-content">
              <span>Usuarios activos:</span>
              <strong>{activos}</strong>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <Card className="usuario-stat-card">
          <Card.Body>
            <div className="stat-icon danger"><FiUserX /></div>
            <div className="usuario-stat-content">
              <span>Usuarios inactivos:</span>
              <strong>{inactivos}</strong>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <Card className="usuario-stat-card">
          <Card.Body>
            <div className="stat-icon specialist"><FiShield /></div>
            <div className="usuario-stat-content">
              <span>Especialistas:</span>
              <strong>{especialistas}</strong>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </>
);

export default UsuariosEncabezado;
