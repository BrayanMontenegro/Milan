import React from "react";
import CitasHeader from "../CitasHeader";

const CitasDoctorHeader = ({ onNuevaCita }) => (
  <CitasHeader
    onNuevaCita={onNuevaCita}
    descripcion="Gestión de citas médicas y profesionales del Especialista"
  />
);

export default CitasDoctorHeader;
