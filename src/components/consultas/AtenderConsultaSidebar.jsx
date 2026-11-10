import React from "react";
import { FaFileMedical, FaHistory, FaUser } from "react-icons/fa";

const AtenderConsultaSidebar = ({
  paciente,
  expediente,
  antecedentes,
  formatearFecha,
}) => (
  <aside className="atender-columna-lateral">
    <section className="atender-lateral-card">
      <div className="lateral-card-header">
        <FaUser />
        <span>Datos del paciente</span>
      </div>
      <div className="lateral-datos">
        <div>
          <span>Teléfono</span>
          <strong>{paciente.telefono || "No registrado"}</strong>
        </div>
        <div>
          <span>Correo</span>
          <strong>{paciente.correo || "No registrado"}</strong>
        </div>
        <div>
          <span>Procedencia</span>
          <strong>{paciente.procedencia || "No registrada"}</strong>
        </div>
        <div>
          <span>Ocupación</span>
          <strong>{paciente.ocupacion || "No registrada"}</strong>
        </div>
      </div>
    </section>

    <section className="atender-lateral-card">
      <div className="lateral-card-header">
        <FaFileMedical />
        <span>Expediente clínico</span>
      </div>
      {expediente ? (
        <div className="expediente-resumen">
          <div>
            <span>Grupo sanguíneo</span>
            <strong>{expediente.grupo_sanguineo || "No registrado"}</strong>
          </div>
          <div>
            <span>Alergias</span>
            <p>{expediente.alergias || "No registradas"}</p>
          </div>
          <div>
            <span>Enfermedades crónicas</span>
            <p>{expediente.enfermedades_cronicas || "No registradas"}</p>
          </div>
          <div>
            <span>Medicamentos actuales</span>
            <p>{expediente.medicamentos_actuales || "No registrados"}</p>
          </div>
          <div>
            <span>Antecedentes importantes</span>
            <p>{expediente.antecedentes_importantes || "No registrados"}</p>
          </div>
        </div>
      ) : (
        <div className="sin-expediente">
          <FaFileMedical />
          <p>Este paciente todavía no tiene expediente clínico registrado.</p>
        </div>
      )}
    </section>

    <section className="atender-lateral-card">
      <div className="lateral-card-header">
        <FaHistory />
        <span>Antecedentes</span>
      </div>
      {antecedentes.length > 0 ? (
        <div className="antecedentes-lista">
          {antecedentes.map((antecedente) => (
            <div
              className="antecedente-item"
              key={antecedente.id_antecedente}
            >
              <strong>{antecedente.tipo_antecedente}</strong>
              <p>{antecedente.descripcion}</p>
              <small>{formatearFecha(antecedente.fecha_registro)}</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="sin-antecedentes">
          No hay antecedentes registrados.
        </div>
      )}
    </section>
  </aside>
);

export default AtenderConsultaSidebar;
