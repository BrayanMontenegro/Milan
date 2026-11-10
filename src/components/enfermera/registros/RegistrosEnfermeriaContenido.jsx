import { FaNotesMedical } from "react-icons/fa";

import RegistroEnfermeriaFiltros from "./RegistroEnfermeriaFiltros";
import RegistroEnfermeriaTabla from "./RegistroEnfermeriaTabla";
import RegistroEnfermeriaPaginacion from "./RegistroEnfermeriaPaginacion";

const RegistrosEnfermeriaContenido = ({
  busqueda,
  cambiarFiltro,
  setBusqueda,
  fecha,
  setFecha,
  totalResultados,
  cargando,
  registrosPagina,
  onVerRegistro,
  paginaVisible,
  totalPaginas,
  paginaAnterior,
  paginaSiguiente,
}) => (
  <main className="container-fluid px-3 px-md-4 py-4">
    <RegistroEnfermeriaFiltros
      busqueda={busqueda}
      setBusqueda={(valor) => cambiarFiltro(setBusqueda, valor)}
      fecha={fecha}
      setFecha={(valor) => cambiarFiltro(setFecha, valor)}
      totalResultados={totalResultados}
    />

    {cargando && (
      <div className="registros-enfermeria-estado">
        <div className="spinner-border" role="status" />
        <p>Cargando registros...</p>
      </div>
    )}

    {!cargando && totalResultados === 0 && (
      <div className="registros-enfermeria-estado">
        <div className="registros-enfermeria-vacio-icon">
          <FaNotesMedical />
        </div>
        <h4>No hay registros</h4>
        <p>
          No se encontraron registros de enfermería con los filtros
          seleccionados.
        </p>
      </div>
    )}

    {!cargando && registrosPagina.length > 0 && (
      <>
        <RegistroEnfermeriaTabla
          registros={registrosPagina}
          onVer={onVerRegistro}
        />
        <RegistroEnfermeriaPaginacion
          paginaActual={paginaVisible}
          totalPaginas={totalPaginas}
          onPaginaAnterior={paginaAnterior}
          onPaginaSiguiente={paginaSiguiente}
        />
      </>
    )}
  </main>
);

export default RegistrosEnfermeriaContenido;
