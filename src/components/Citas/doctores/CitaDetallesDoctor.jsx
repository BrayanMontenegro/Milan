import React from "react";
import CitaDetalleCompartido from "../CitaDetalleCompartido";

const CitaDetalleDoctor = ({ cita, onCerrar }) => (
  <CitaDetalleCompartido cita={cita} onCerrar={onCerrar} />
);

export default CitaDetalleDoctor;
