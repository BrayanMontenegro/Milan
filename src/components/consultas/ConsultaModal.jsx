import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaUserMd,
  FaNotesMedical,
  FaStethoscope,
  FaSave,
} from "react-icons/fa";

const ConsultaMotivoSection = ({ formulario, cambiarCampo }) => (
  <div className="consulta-form-seccion">
    <div className="consulta-form-seccion-title">
      <FaNotesMedical />
      <span>Motivo y síntomas</span>
    </div>
    <div className="mb-3">
      <label htmlFor="consulta-motivo">
        Motivo de consulta
        <span>*</span>
      </label>
      <textarea
        id="consulta-motivo"
        rows="3"
        value={formulario.motivo_consulta}
        onChange={(e) =>
          cambiarCampo("motivo_consulta", e.target.value)
        }
        placeholder="Describa el motivo principal de la consulta..."
        required
      />
    </div>
    <div className="mb-3">
      <label htmlFor="consulta-sintomas">Síntomas</label>
      <textarea
        id="consulta-sintomas"
        rows="4"
        value={formulario.sintomas}
        onChange={(e) =>
          cambiarCampo("sintomas", e.target.value)
        }
        placeholder="Describa los síntomas manifestados por el paciente..."
      />
    </div>
  </div>
);

const ConsultaDiagnosticoSection = ({ formulario, cambiarCampo }) => (
  <div className="consulta-form-seccion">
    <div className="consulta-form-seccion-title">
      <FaStethoscope />
      <span>Evaluación médica</span>
    </div>
    <div className="mb-3">
      <label htmlFor="consulta-diagnostico">Diagnóstico</label>
      <textarea
        id="consulta-diagnostico"
        rows="4"
        value={formulario.diagnostico}
        onChange={(e) =>
          cambiarCampo("diagnostico", e.target.value)
        }
        placeholder="Ingrese el diagnóstico..."
      />
    </div>
  </div>
);

const ConsultaTratamientoSection = ({ formulario, cambiarCampo }) => (
  <div className="consulta-form-seccion">
    <div className="consulta-form-seccion-title">
      <FaNotesMedical />
      <span>Tratamiento e indicaciones</span>
    </div>
    <div className="mb-3">
      <label htmlFor="consulta-tratamiento">Tratamiento</label>
      <textarea
        id="consulta-tratamiento"
        rows="4"
        value={formulario.tratamiento}
        onChange={(e) =>
          cambiarCampo("tratamiento", e.target.value)
        }
        placeholder="Ingrese el tratamiento indicado..."
      />
    </div>
    <div className="mb-3">
      <label htmlFor="consulta-indicaciones">Indicaciones</label>
      <textarea
        id="consulta-indicaciones"
        rows="4"
        value={formulario.indicaciones}
        onChange={(e) =>
          cambiarCampo("indicaciones", e.target.value)
        }
        placeholder="Ingrese las indicaciones para el paciente..."
      />
    </div>
  </div>
);

const ConsultaObservacionesSection = ({ formulario, cambiarCampo }) => (
  <div className="consulta-form-seccion">
    <div className="consulta-form-seccion-title">
      <FaNotesMedical />
      <span>Observaciones</span>
    </div>
    <label htmlFor="consulta-observaciones">Observaciones</label>
    <textarea
      id="consulta-observaciones"
      rows="4"
      value={formulario.observaciones}
      onChange={(e) =>
        cambiarCampo("observaciones", e.target.value)
      }
      placeholder="Observaciones adicionales..."
    />
  </div>
);

const ConsultaModal = ({
  cita,
  onCerrar,
  onGuardar,
  guardando,
}) => {

  const paciente = cita?.pacientes || {};
  const especialista = cita?.especialistas || {};

  const [formulario, setFormulario] = useState({
    motivo_consulta: cita?.motivo || "",
    sintomas: "",
    diagnostico: "",
    tratamiento: "",
    indicaciones: "",
    observaciones: "",
  });


  const cambiarCampo = (campo, valor) => {

    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

  };


  const enviarFormulario = (e) => {

    e.preventDefault();

    onGuardar?.(formulario);

  };


  if (!cita) {
    return null;
  }


  return (
    <div className="consulta-modal-overlay">

      <div className="consulta-modal">

        {/* HEADER */}

        <div className="consulta-modal-header">

          <div className="consulta-modal-titulo">

            <div className="consulta-modal-icon">
              <FaStethoscope />
            </div>

            <div>
              <h4>Atención médica</h4>

              <p>
                Registro de consulta del paciente
              </p>
            </div>

          </div>

          <button
            type="button"
            className="consulta-modal-close"
            aria-label="Cerrar atención médica"
            onClick={onCerrar}
          >
            <FaTimes />
          </button>

        </div>


        {/* PACIENTE */}

        <div className="consulta-modal-paciente">

          <div className="consulta-modal-paciente-icon">
            <FaUser />
          </div>

          <div>

            <span>Paciente</span>

            <strong>
              {paciente.nombres}{" "}
              {paciente.apellidos}
            </strong>

            <small>
              {paciente.codigo_expediente}
            </small>

          </div>

        </div>


        {/* ESPECIALISTA */}

        <div className="consulta-modal-especialista">

          <FaUserMd />

          <div>
            <span>Especialista</span>

            <strong>
              {especialista.nombres}{" "}
              {especialista.apellidos}
            </strong>
          </div>

          <div>
            <span>Especialidad</span>

            <strong>
              {especialista.especialidades?.nombre ||
                "Sin especialidad"}
            </strong>
          </div>

        </div>


        {/* FORMULARIO */}

        <form
          onSubmit={enviarFormulario}
          className="consulta-modal-form"
        >

          <div className="consulta-form-body">
            <ConsultaMotivoSection
              formulario={formulario}
              cambiarCampo={cambiarCampo}
            />
            <ConsultaDiagnosticoSection
              formulario={formulario}
              cambiarCampo={cambiarCampo}
            />
            <ConsultaTratamientoSection
              formulario={formulario}
              cambiarCampo={cambiarCampo}
            />
            <ConsultaObservacionesSection
              formulario={formulario}
              cambiarCampo={cambiarCampo}
            />
          </div>


          {/* FOOTER */}

          <div className="consulta-modal-footer">

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
              className="consulta-btn-guardar"
              disabled={guardando}
            >

              {guardando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave />
                  Guardar consulta
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ConsultaModal;