import React from "react";
import CitaFiltros from "../CitaFiltros";

const CitaFiltrosDoctor = (props) => (
  <CitaFiltros {...props} mostrarEspecialista={false} />
);

export default CitaFiltrosDoctor;
