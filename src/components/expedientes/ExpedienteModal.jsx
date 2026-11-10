
import { useEffect } from "react";
import { FaFileMedical, FaTimes } from "react-icons/fa";

const camposTexto = [
  {
    name: "alergias",
    label: "Alergias conocidas",
    placeholder: "Alergias a medicamentos, alimentos u otras sustancias...",
  },
  {
    name: "medicamentos_actuales",
    label: "Medicamentos actuales",
    placeholder: "Medicamentos que utiliza actualmente...",
  },
  {
    name: "enfermedades_cronicas",
    label: "Enfermedades crónicas",
    placeholder: "Enfermedades crónicas diagnosticadas...",
  },
  {
    name: "antecedentes_importantes",
    label: "Antecedentes médicos importantes",
    placeholder: "Información médica relevante para la atención...",
  },
  {
    name: "observaciones",
    label: "Observaciones generales",
    placeholder: "Notas adicionales de la ficha médica...",
  },
];

export default function ExpedienteModal({
  paciente,
  formulario,
  setFormulario,
  guardando,
  onSubmit,
  onCerrar,
  modoEdicion,
}) {
  useEffect(() => {
    const manejarEscape = (event) => {
      if (event.key === "Escape" && !guardando) onCerrar();
    };

    window.addEventListener("keydown", manejarEscape);
    return () => window.removeEventListener("keydown", manejarEscape);
  }, [guardando, onCerrar]);

  const cambiarCampo = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const nombre = `${paciente.nombres || ""} ${
    paciente.apellidos || ""
  }`.trim();

  return (
    <div
      className="expedientes-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !guardando) onCerrar();
      }}
    >
      <section
        className="expedientes-modal modal-backdrop-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expediente-modal-title"
      >
        <header className="expedientes-modal-header">
          <div className="expedientes-modal-heading">
            <span className="expedientes-modal-icon">
              <FaFileMedical />
            </span>
            <div>
              <h2 id="expediente-modal-title">
                {modoEdicion ? "Editar ficha médica" : "Crear ficha médica"}
              </h2>
              <p>{nombre}</p>
            </div>
          </div>

          <button
            type="button"
            className="expedientes-modal-close"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar formulario"
          >
            <FaTimes />
          </button>
        </header>

        <form onSubmit={onSubmit}>
          <div className="expedientes-modal-body">
            <div className="expedientes-patient-summary">
              <div>
                <span>Código de paciente</span>
                <strong>{paciente.codigo_expediente || "Sin código"}</strong>
              </div>
              <div>
                <span>Teléfono</span>
                <strong>{paciente.telefono || "No registrado"}</strong>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="grupo_sanguineo" className="form-label">
                Grupo sanguíneo
              </label>
              <select
                id="grupo_sanguineo"
                name="grupo_sanguineo"
                className="form-select"
                value={formulario.grupo_sanguineo}
                onChange={cambiarCampo}
              >
                <option value="">No registrado</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (grupo) => (
                    <option key={grupo} value={grupo}>
                      {grupo}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="expedientes-form-grid">
              {camposTexto.map((campo) => (
                <div
                  className={`mb-3 ${
                    campo.name === "observaciones" ? "full-width" : ""
                  }`}
                  key={campo.name}
                >
                  <label htmlFor={campo.name} className="form-label">
                    {campo.label}
                  </label>
                  <textarea
                    id={campo.name}
                    name={campo.name}
                    className="form-control"
                    rows={3}
                    value={formulario[campo.name]}
                    onChange={cambiarCampo}
                    placeholder={campo.placeholder}
                  />
                </div>
              ))}
            </div>

            <p className="expedientes-form-note">
              Registra únicamente información confirmada por el personal
              autorizado de la clínica. Los campos que no se conozcan pueden
              dejarse vacíos.
            </p>
          </div>

          <footer className="expedientes-modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary expedientes-save-button"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Guardando...
                </>
              ) : modoEdicion ? (
                "Guardar cambios"
              ) : (
                "Crear ficha médica"
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
