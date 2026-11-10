import React from "react";
import CitaDetalleDoctor from "./CitaDetallesDoctor";
import CitaModal from "../CitaModal";

const CitasDoctorDialogs = ({
  citaSeleccionada,
  mostrarDetalle,
  mostrarEditar,
  onCloseDetalle,
  onCloseEditar,
  onActualizada,
}) => (
  <>
    {mostrarDetalle && citaSeleccionada && (
      <CitaDetalleDoctor
        cita={citaSeleccionada}
        onCerrar={onCloseDetalle}
      />
    )}
    {mostrarEditar && citaSeleccionada && (
      <CitaModal
        cita={citaSeleccionada}
        onCerrar={onCloseEditar}
        onActualizada={onActualizada}
      />
    )}
  </>
);

export default CitasDoctorDialogs;
