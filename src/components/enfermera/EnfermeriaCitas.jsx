import { FaCalendarCheck, FaExclamationCircle } from "react-icons/fa";

import EnfermeriaFiltros from "./EnfermeriaFiltros";
import EnfermeriaCard from "./EnfermeriaCard";
import EnfermeriaPaginacion from "./EnfermeriaPaginacion";

const EnfermeriaCitas = ({
  busqueda,
  cambiarBusqueda,
  citasFiltradas,
  citasPagina,
  cargando,
  paginaVisible,
  totalPaginas,
  abrirModalSignos,
  irPaginaAnterior,
  irPaginaSiguiente,
}) => (
  <main className="container-fluid px-3 px-md-4 py-4">
    <EnfermeriaFiltros
      busqueda={busqueda}
      setBusqueda={cambiarBusqueda}
      totalResultados={citasFiltradas.length}
    />

    {cargando && (
      <div className="enfermeria-estado-vacio">
        <div className="spinner-border" role="status" />
        <p>Cargando citas programadas...</p>
      </div>
    )}

    {!cargando && citasFiltradas.length === 0 && (
      <div className="enfermeria-estado-vacio">
        <div className="enfermeria-vacio-icon">
          {busqueda ? <FaExclamationCircle /> : <FaCalendarCheck />}
        </div>
        <h4>
          {busqueda
            ? "No se encontraron citas"
            : "No hay citas programadas para hoy"}
        </h4>
        <p>
          {busqueda
            ? "Intente realizar una búsqueda diferente."
            : "Las citas programadas para hoy aparecerán aquí para realizar la toma de signos vitales."}
        </p>
      </div>
    )}

    {!cargando && citasPagina.length > 0 && (
      <>
        <div className="row g-4">
          {citasPagina.map((cita) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={cita.id_cita}
            >
              <EnfermeriaCard
                cita={cita}
                onTomarSignos={abrirModalSignos}
              />
            </div>
          ))}
        </div>

        <EnfermeriaPaginacion
          paginaActual={paginaVisible}
          totalPaginas={totalPaginas}
          onPaginaAnterior={irPaginaAnterior}
          onPaginaSiguiente={irPaginaSiguiente}
        />
      </>
    )}
  </main>
);

export default EnfermeriaCitas;
