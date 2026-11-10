import React from "react";
import { FaStethoscope, FaUserMd } from "react-icons/fa";
import CitaEspecialistasDisponibles from "./CitaEspecialistasDisponibles";
import CitaCreationSection from "./CitaCreationSection";

const CitaSpecialistSection = ({ flow }) => (
  <CitaCreationSection
    icon={<FaUserMd />}
    iconClass="especialista"
    title="3. Especialista disponible"
    description="Seleccione el especialista que atenderá al paciente"
  >
    {!flow.especialidad ? (
      <div className="crear-cita-bloqueo">
        <FaStethoscope />
        <strong>Seleccione primero una especialidad</strong>
        <span>Aquí aparecerán los especialistas disponibles.</span>
      </div>
    ) : (
      <CitaEspecialistasDisponibles
        especialistas={flow.especialistas}
        especialista={flow.especialista}
        onSeleccionar={flow.seleccionarEspecialista}
        cargando={flow.cargandoEspecialistas}
      />
    )}
  </CitaCreationSection>
);

export default CitaSpecialistSection;
