import React from "react";
import { FaClipboardList } from "react-icons/fa";
import CitaForm from "./CitaForm";
import CitaCreationSection from "./CitaCreationSection";

const CitaExtraInfoSection = ({ flow }) => (
  <CitaCreationSection
    icon={<FaClipboardList />}
    iconClass="formulario"
    title="5. Información de la cita"
    description="Complete la información adicional"
  >
    <CitaForm datos={flow.datosCita} setDatos={flow.setDatosCita} />
  </CitaCreationSection>
);

export default CitaExtraInfoSection;
