import { Button, Form, InputGroup } from "react-bootstrap";
import { FiSearch, FiX } from "react-icons/fi";

const UsuariosFiltros = ({
  busqueda,
  setBusqueda,
  filtroRol,
  setFiltroRol,
  filtroEstado,
  setFiltroEstado,
  roles,
  nombreRolMostrar,
}) => (
  <div className="usuarios-filtros">
    <InputGroup className="usuarios-search">
      <InputGroup.Text><FiSearch /></InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />
      {busqueda && (
        <Button variant="light" onClick={() => setBusqueda("")}>
          <FiX />
        </Button>
      )}
    </InputGroup>

    <Form.Select
      value={filtroRol}
      onChange={(event) => setFiltroRol(event.target.value)}
    >
      <option value="">Todos los roles</option>
      {roles.map((rol) => (
        <option key={rol.id_rol} value={rol.id_rol}>
          {nombreRolMostrar(rol.nombre)}
        </option>
      ))}
    </Form.Select>

    <Form.Select
      value={filtroEstado}
      onChange={(event) => setFiltroEstado(event.target.value)}
    >
      <option value="">Todos los estados</option>
      <option value="ACTIVO">Activos</option>
      <option value="INACTIVO">Inactivos</option>
    </Form.Select>
  </div>
);

export default UsuariosFiltros;
