import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ConsultaPaginacion = ({
  paginaActual,
  totalPaginas,
  onAnterior,
  onSiguiente,
}) => {

  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="consulta-paginacion">

      <button
        type="button"
        onClick={onAnterior}
        disabled={paginaActual === 1}
      >
        <FaChevronLeft />
        Anterior
      </button>

      <span>
        Página{" "}
        <strong>{paginaActual}</strong>
        {" "}de{" "}
        <strong>{totalPaginas}</strong>
      </span>

      <button
        type="button"
        onClick={onSiguiente}
        disabled={
          paginaActual === totalPaginas
        }
      >
        Siguiente
        <FaChevronRight />
      </button>

    </div>
  );
};

export default ConsultaPaginacion;