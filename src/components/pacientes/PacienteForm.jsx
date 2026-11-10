import React from "react";
import PacientePersonalSection from "./PacientePersonalSection";
import PacienteContactoSection from "./PacienteContactoSection";
import PacienteTutorSection from "./PacienteTutorSection";
import PacienteObservacionesSection from "./PacienteObservacionesSection";

const PROCEDENCIAS_VACIAS = [];

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;

  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }

  return edad;
};

const limpiarTextoNombre = (valor) =>
  valor
    .replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s'-]/g, "")
    .replace(/\s{2,}/g, " ");

const formatearTelefono = (valor) => {
  const limitado = valor.replace(/\D/g, "").slice(0, 8);

  if (limitado.length > 4) {
    return `${limitado.slice(0, 4)}-${limitado.slice(4)}`;
  }

  return limitado;
};

const PacienteForm = ({
  formulario,
  setFormulario,
  onSubmit,
  onCancelar,
  guardando = false,
  modoEdicion = false,
  procedencias = PROCEDENCIAS_VACIAS,
}) => {
  const edad = calcularEdad(formulario.fecha_nacimiento);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let valorProcesado = value;

    if (
      name === "nombres" ||
      name === "apellidos" ||
      name === "nombre_tutor"
    ) {
      valorProcesado = limpiarTextoNombre(value);
    }

    if (name === "telefono" || name === "telefono_tutor") {
      valorProcesado = formatearTelefono(value);
    }

    if (name === "ocupacion") {
      valorProcesado = value.replace(/[0-9]/g, "");
    }

    setFormulario((actual) => ({
      ...actual,
      [name]: valorProcesado,
    }));
  };

  const cambiarProcedencia = (procedencia) => {
    setFormulario((actual) => ({ ...actual, procedencia }));
  };

  return (
    <form onSubmit={onSubmit} className="paciente-form">
      <PacientePersonalSection
        formulario={formulario}
        manejarCambio={manejarCambio}
        edad={edad}
      />
      <PacienteContactoSection
        formulario={formulario}
        manejarCambio={manejarCambio}
        procedencias={procedencias}
        onSeleccionarProcedencia={cambiarProcedencia}
      />
      {edad !== null && edad < 18 && (
        <PacienteTutorSection
          formulario={formulario}
          manejarCambio={manejarCambio}
        />
      )}
      <PacienteObservacionesSection
        formulario={formulario}
        manejarCambio={manejarCambio}
      />

      <div className="paciente-form-actions">
        <button
          type="button"
          className="btn btn-paciente-cancelar"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-paciente-guardar"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Guardando...
            </>
          ) : modoEdicion ? (
            "Actualizar paciente"
          ) : (
            "Registrar paciente"
          )}
        </button>
      </div>
    </form>
  );
};

export default PacienteForm;
