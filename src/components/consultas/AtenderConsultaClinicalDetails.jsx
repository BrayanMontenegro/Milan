import React from "react";
import AtenderConsultaVitalSigns from "./AtenderConsultaVitalSigns";
import AtenderConsultaAppointmentInfo from "./AtenderConsultaAppointmentInfo";

const AtenderConsultaClinicalDetails = (props) => (
  <>
    <AtenderConsultaVitalSigns signosVitales={props.signosVitales} />
    <AtenderConsultaAppointmentInfo
      cita={props.cita}
      nombreEspecialista={props.nombreEspecialista}
      especialidad={props.especialidad}
      formatearFecha={props.formatearFecha}
      formatearHora={props.formatearHora}
    />
  </>
);

export default AtenderConsultaClinicalDetails;
