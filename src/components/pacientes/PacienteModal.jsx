import React from "react";
import { FaTimes, FaUserInjured } from "react-icons/fa";

import PacienteForm from "./PacienteForm";

const PacienteModal = ({
  mostrar,
  onCerrar,
  formulario,
  setFormulario,
  onSubmit,
  guardando,
  modoEdicion,
  procedencias
}) => {

  if (!mostrar) {
    return null;
  }

  return (
    <div
      className="paciente-modal-backdrop"
      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget &&
          !guardando
        ) {
          onCerrar();
        }

      }}
    >

      <div
        className="paciente-modal-container"
        role="dialog"
        aria-modal="true"
      >

        {/* Header */}

        <div className="paciente-modal-header">

          <div className="d-flex align-items-center gap-3">

            <div className="paciente-modal-icon">
              <FaUserInjured />
            </div>

            <div>

              <h4>
                {modoEdicion
                  ? "Editar paciente"
                  : "Nuevo paciente"}
              </h4>

              <p>
                {modoEdicion
                  ? "Actualice la información del paciente"
                  : "Registre un nuevo paciente en Clínica Milán"}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="paciente-modal-close"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>

        </div>


        {/* Body */}

        <div className="paciente-modal-body">

          <PacienteForm
            formulario={formulario}
            setFormulario={setFormulario}
            onSubmit={onSubmit}
            onCancelar={onCerrar}
            guardando={guardando}
            modoEdicion={modoEdicion}
            procedencias={procedencias}
          />

        </div>

      </div>

    </div>
  );
};

export default PacienteModal;