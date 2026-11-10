
import { FaSearch, FaFilter } from "react-icons/fa";

export default function ExpedienteFiltros({
  busqueda,
  setBusqueda,
  estadoFiltro,
  setEstadoFiltro,
  total,
}) {
  return (
    <section className="expedientes-filtros">
      <div className="expedientes-search">
        <FaSearch />
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por paciente, código, teléfono o procedencia..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar pacientes"
        />
      </div>

      <div className="expedientes-filter-select">
        <FaFilter />
        <select
          className="form-select"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          aria-label="Filtrar por estado de ficha médica"
        >
          <option value="todos">Todos los pacientes</option>
          <option value="con">Con ficha médica</option>
          <option value="sin">Sin ficha médica</option>
        </select>
      </div>

      <span className="expedientes-results">
        {total} {total === 1 ? "paciente" : "pacientes"}
      </span>
    </section>
  );
}
