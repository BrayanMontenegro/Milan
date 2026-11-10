import React from "react";
import CitaDetalleCompartido from "./CitaDetalleCompartido";

const CitaDetalle = ({ cita, onCerrar }) => (
  <CitaDetalleCompartido cita={cita} onCerrar={onCerrar} />
);

export default CitaDetalle;
