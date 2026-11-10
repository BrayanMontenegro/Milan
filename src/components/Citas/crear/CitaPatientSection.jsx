import React from "react";
import { FaUser } from "react-icons/fa";
import CitaPacienteSelector from "./CitaPacienteSelector";
import CitaCreationSection from "./CitaCreationSection";

const CitaPatientSection = ({ flow }) => (
  <CitaCreationSection
    icon={<FaUser />}
    iconClass="paciente"
    title="1. Seleccionar paciente"
    description="Busque el paciente que desea agendar"
  >
    <CitaPacienteSelector
      paciente={flow.paciente}
      pacientes={flow.pacientes}
      busqueda={flow.busquedaPaciente}
      setBusqueda={flow.setBusquedaPaciente}
      onSeleccionar={flow.seleccionarPaciente}
      cargando={flow.cargandoPacientes}
    />
  </CitaCreationSection>
);

export default CitaPatientSection;
