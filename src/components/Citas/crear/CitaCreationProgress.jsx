import React from "react";
import {
  FaClock,
  FaStethoscope,
  FaUser,
  FaUserMd,
} from "react-icons/fa";

const STEPS = [
  { title: "Paciente", Icon: FaUser },
  { title: "Especialidad", Icon: FaStethoscope },
  { title: "Especialista", Icon: FaUserMd },
  { title: "Fecha y hora", Icon: FaClock },
];

const CitaCreationProgress = ({ paciente, especialidad, especialista, fecha, horario }) => {
  const completed = [paciente, especialidad, especialista, fecha && horario];

  return (
    <div className="crear-cita-pasos">
      {STEPS.map(({ title, Icon }, index) => (
        <React.Fragment key={title}>
          {index > 0 && <div className="crear-cita-paso-linea" />}
          <div
            className={`crear-cita-paso ${completed[index] ? "completado" : ""}`}
          >
            <div className="crear-cita-paso-icono">
              <Icon />
            </div>
            <div className="crear-cita-paso-info">
              <span>Paso {index + 1}</span>
              <strong>{title}</strong>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default CitaCreationProgress;
