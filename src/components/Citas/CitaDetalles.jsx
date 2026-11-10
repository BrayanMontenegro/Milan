import React from "react";
import CitaDetalleCompartido from "../citas/CitaDetalleCompartido";

const CitaDetalle = ({ cita, onCerrar }) => (
  <CitaDetalleCompartido cita={cita} onCerrar={onCerrar} />
);

export default CitaDetalle;
