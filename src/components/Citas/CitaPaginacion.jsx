import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const CitaPaginacion = ({
  paginaActual,
  totalPaginas,
  onPaginaAnterior,
  onPaginaSiguiente,
}) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="cita-paginacion">

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onPaginaAnterior}
        disabled={paginaActual <= 1}
      >
        <FaChevronLeft className="me-2" />
        Anterior
      </button>

      <div className="cita-paginacion-info">
        <span>
          Página
        </span>

        <strong>
          {paginaActual}
        </strong>

        <span>
          de
        </span>

        <strong>
          {totalPaginas}
        </strong>
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onPaginaSiguiente}
        disabled={paginaActual >= totalPaginas}
      >
        Siguiente
        <FaChevronRight className="ms-2" />
      </button>

    </div>
  );
};

export default CitaPaginacion;