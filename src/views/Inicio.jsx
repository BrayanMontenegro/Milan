import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Inicio.css";

const Inicio = () => {
  const { usuario, perfil } = useAuth();
  const navigate = useNavigate();

const nombreUsuario =
  perfil?.nombres || "Usuario";

const rol =
  perfil?.roles?.nombre || "Usuario";

  return (
    <Container fluid className="inicio-container">

      {/* Encabezado */}

      <div className="inicio-header mb-4">

        <div>
          <h2>
            Bienvenido, {nombreUsuario}
          </h2>

          <p>
            Panel principal de Clínica Milán
          </p>
        </div>

        <div className="usuario-rol">
          <i className="bi bi-person-circle me-2"></i>
          {rol}
        </div>

      </div>

      {/* Estadísticas */}

      <Row className="g-4 mb-4">

        <Col md={6} xl={3}>
          <Card className="dashboard-card">
            <Card.Body>

              <div className="dashboard-icon">
                <i className="bi bi-people-fill"></i>
              </div>

              <div>
                <span>Pacientes</span>
                <h3>0</h3>
              </div>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="dashboard-card">
            <Card.Body>

              <div className="dashboard-icon">
                <i className="bi bi-calendar-event-fill"></i>
              </div>

              <div>
                <span>Citas</span>
                <h3>0</h3>
              </div>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="dashboard-card">
            <Card.Body>

              <div className="dashboard-icon">
                <i className="bi bi-clipboard2-pulse-fill"></i>
              </div>

              <div>
                <span>Consultas</span>
                <h3>0</h3>
              </div>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="dashboard-card">
            <Card.Body>

              <div className="dashboard-icon">
                <i className="bi bi-person-badge-fill"></i>
              </div>

              <div>
                <span>Especialistas</span>
                <h3>0</h3>
              </div>

            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Accesos rápidos */}

      <div className="section-title">
        <h4>Accesos rápidos</h4>
        <p>Funciones principales del sistema</p>
      </div>

      <Row className="g-4">

        <Col md={6} lg={3}>
          <Card
            className="quick-card"
            onClick={() => navigate("/pacientes")}
          >
            <Card.Body>

              <i className="bi bi-person-plus-fill"></i>

              <h5>Pacientes</h5>

              <p>
                Registrar y consultar pacientes.
              </p>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="quick-card"
            onClick={() => navigate("/citas")}
          >
            <Card.Body>

              <i className="bi bi-calendar-plus-fill"></i>

              <h5>Citas</h5>

              <p>
                Gestionar las citas médicas.
              </p>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="quick-card"
            onClick={() => navigate("/enfermeria")}
          >
            <Card.Body>

              <i className="bi bi-heart-pulse-fill"></i>

              <h5>Enfermería</h5>

              <p>
                Registrar atención de enfermería.
              </p>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="quick-card"
            onClick={() => navigate("/consultas")}
          >
            <Card.Body>

              <i className="bi bi-clipboard2-pulse-fill"></i>

              <h5>Consultas</h5>

              <p>
                Gestionar consultas médicas.
              </p>

            </Card.Body>
          </Card>
        </Col>

      </Row>

    </Container>
  );
};

export default Inicio;