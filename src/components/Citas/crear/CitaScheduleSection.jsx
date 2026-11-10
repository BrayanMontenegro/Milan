import React from "react";
import { FaClock, FaUserMd } from "react-icons/fa";
import CitaCalendario from "./CitaCalendario";
import CitaHorariosDisponibles from "./CitaHorariosDisponibles";
import CitaCreationSection from "./CitaCreationSection";

const CitaScheduleSection = ({ flow }) => (
  <CitaCreationSection
    icon={<FaClock />}
    iconClass="horario"
    title="4. Fecha y horario"
    description="Seleccione un día y una hora disponible"
  >
    {!flow.especialista ? (
      <div className="crear-cita-bloqueo">
        <FaUserMd />
        <strong>Seleccione primero un especialista</strong>
        <span>Aquí aparecerá su disponibilidad.</span>
      </div>
    ) : (
      <>
        <div className="crear-cita-calendario-wrapper">
          <CitaCalendario
            fecha={flow.fecha}
            setFecha={flow.setFecha}
            horarios={flow.horariosEspecialista}
          />
        </div>
        {flow.fecha && (
          <div className="crear-cita-horarios-wrapper">
            <div className="crear-cita-subtitulo">
              <FaClock />
              <div>
                <strong>Horarios disponibles</strong>
                <span>Seleccione una hora para la cita</span>
              </div>
            </div>
            <CitaHorariosDisponibles
              horarios={flow.horariosDisponibles}
              horarioSeleccionado={flow.horario}
              onSeleccionar={flow.seleccionarHorario}
              cargando={flow.cargandoDisponibilidad}
            />
          </div>
        )}
      </>
    )}
  </CitaCreationSection>
);

export default CitaScheduleSection;
