import React from "react";
import CitaDetalle from "./CitaDetalles";
import CitaModal from "./CitaModal";

const CitasDialogs = ({
  citaSeleccionada,
  mostrarDetalle,
  mostrarModal,
  onCloseDetalle,
  onCloseModal,
  onActualizada,
}) => (
  <>
    {mostrarDetalle && (
      <CitaDetalle cita={citaSeleccionada} onCerrar={onCloseDetalle} />
    )}
    {mostrarModal && (
      <CitaModal
        cita={citaSeleccionada}
        onCerrar={onCloseModal}
        onActualizada={onActualizada}
      />
    )}
  </>
);

export default CitasDialogs;
