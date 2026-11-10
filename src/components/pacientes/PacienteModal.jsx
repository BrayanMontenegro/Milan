import React from "react";
import { FaTimes, FaUserInjured } from "react-icons/fa";

import PacienteForm from "./PacienteForm";
import useNativeDialog from "../../hooks/useNativeDialog";

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
  const dialogRef = useNativeDialog(mostrar, onCerrar);

  if (!mostrar) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="paciente-modal-backdrop native-modal-root"
      aria-labelledby="paciente-modal-title"
      onCancel={(event) => {
        if (guardando) event.preventDefault();
      }}
    >
      <button
        type="button"
        className="modal-backdrop-dismiss"
        aria-label="Cerrar formulario de paciente"
        disabled={guardando}
        onClick={() => dialogRef.current?.close()}
      />
      <div
        className="paciente-modal-container modal-backdrop-content"
      >

        {/* Header */}

        <div className="paciente-modal-header">

          <div className="d-flex align-items-center gap-3">

            <div className="paciente-modal-icon">
              <FaUserInjured />
            </div>

            <div>

              <h4 id="paciente-modal-title">
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

    </dialog>
  );
};

export default PacienteModal;