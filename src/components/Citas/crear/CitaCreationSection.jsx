import React from "react";

const CitaCreationSection = ({ icon, iconClass, title, description, children }) => (
  <section className="crear-cita-seccion">
    <div className="crear-cita-seccion-header">
      <div className={`crear-cita-seccion-icono ${iconClass}`}>{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
    {children}
  </section>
);

export default CitaCreationSection;
