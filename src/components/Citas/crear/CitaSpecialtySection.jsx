import React from "react";
import { FaStethoscope } from "react-icons/fa";
import CitaEspecialidadSelector from "./CitaEspecialidadSelector";
import CitaCreationSection from "./CitaCreationSection";

const CitaSpecialtySection = ({ flow }) => (
  <CitaCreationSection
    icon={<FaStethoscope />}
    iconClass="especialidad"
    title="2. Seleccionar especialidad"
    description="Seleccione la especialidad médica requerida"
  >
    <CitaEspecialidadSelector
      especialidad={flow.especialidad}
      especialidades={flow.especialidades}
      onSeleccionar={flow.seleccionarEspecialidad}
      cargando={flow.cargandoEspecialidades}
    />
  </CitaCreationSection>
);

export default CitaSpecialtySection;
