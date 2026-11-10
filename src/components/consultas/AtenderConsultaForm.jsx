import React from "react";
import { FaNotesMedical, FaSave } from "react-icons/fa";

const CAMPOS_CONSULTA = [
  {
    name: "motivo_consulta",
    label: "Motivo de consulta",
    rows: 3,
    placeholder: "Describa el motivo principal de la consulta...",
    required: true,
  },
  {
    name: "sintomas",
    label: "Síntomas",
    rows: 4,
    placeholder: "Describa los síntomas presentados por el paciente...",
  },
  {
    name: "diagnostico",
    label: "Diagnóstico",
    rows: 4,
    placeholder: "Ingrese el diagnóstico médico...",
  },
  {
    name: "tratamiento",
    label: "Tratamiento",
    rows: 4,
    placeholder: "Ingrese el tratamiento indicado...",
  },
  {
    name: "indicaciones",
    label: "Indicaciones",
    rows: 4,
    placeholder: "Escriba las indicaciones para el paciente...",
  },
  {
    name: "observaciones",
    label: "Observaciones",
    rows: 4,
    placeholder: "Observaciones adicionales de la consulta...",
  },
];

const AtenderConsultaForm = ({
  formulario,
  cambiarCampo,
  onSubmit,
  onCancelar,
  guardando,
}) => (
  <form className="atender-formulario" onSubmit={onSubmit}>
    <section className="atender-seccion">
      <div className="atender-seccion-header">
        <div>
          <span className="atender-seccion-icon">
            <FaNotesMedical />
          </span>
          <div>
            <h3>Atención médica</h3>
            <p>Complete la información clínica de la consulta</p>
          </div>
        </div>
      </div>

      {CAMPOS_CONSULTA.map((campo) => (
        <div className="campo-consulta" key={campo.name}>
          <label           htmlFor={`atender-${campo.name.replace("_", "-")}`}>
            {campo.label}
            {campo.required && <span>*</span>}
          </label>
          <textarea
            id={`atender-${campo.name.replace("_", "-")}`}
            rows={campo.rows}
            value={formulario[campo.name]}
            onChange={(event) =>
              cambiarCampo(campo.name, event.target.value)
            }
            placeholder={campo.placeholder}
            required={campo.required}
          />
        </div>
      ))}
    </section>

    <div className="atender-formulario-footer">
      <button
        type="button"
        className="btn-atender-cancelar"
        onClick={onCancelar}
        disabled={guardando}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="btn-atender-guardar"
        disabled={guardando}
      >
        {guardando ? (
          <>
            <span className="spinner-border spinner-border-sm" />
            Guardando...
          </>
        ) : (
          <>
            <FaSave />
            Finalizar consulta
          </>
        )}
      </button>
    </div>
  </form>
);

export default AtenderConsultaForm;
