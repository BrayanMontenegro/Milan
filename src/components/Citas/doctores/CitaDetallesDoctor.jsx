import React from "react";
import CitaDetalleCompartido from "../../citas/CitaDetalleCompartido";

const CitaDetalleDoctor = ({ cita, onCerrar }) => (
  <CitaDetalleCompartido cita={cita} onCerrar={onCerrar} />
);

export default CitaDetalleDoctor;
