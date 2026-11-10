import React, { useState } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
  FaStethoscope,
  FaFileMedical,
  FaSave,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "../../database/supabase";

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  return new Date(`${fecha}T00:00:00`).toLocaleDateString(
    "es-NI",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const CitaModalIdentidades = ({ paciente, especialista }) => {
  const nombrePaciente =
    `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim();
  const nombreEspecialista =
    `${especialista.nombres || ""} ${especialista.apellidos || ""}`.trim();

  return (
    <>
      <div className="cita-modal-paciente">
        <div className="cita-modal-paciente-icon">
          <FaUser />
        </div>
        <div>
          <span>Paciente</span>
          <strong>{nombrePaciente || "Paciente no disponible"}</strong>
          <small>{paciente.codigo_expediente || "Sin expediente"}</small>
        </div>
      </div>
      <div className="cita-modal-especialista">
        <div className="cita-modal-especialista-icon">
          <FaUserMd />
        </div>
        <div>
          <span>Especialista</span>
          <strong>
            {nombreEspecialista || "Especialista no disponible"}
          </strong>
          <small>
            {especialista.especialidades?.nombre || "Sin especialidad"}
          </small>
        </div>
      </div>
    </>
  );
};

const CitaModalCampos = ({
  formulario,
  manejarCambio,
  guardando,
}) => (
  <div className="cita-modal-body">
    <div className="cita-modal-section">
      <div className="cita-modal-section-title">
        <FaClock />
        <span>Fecha y horario</span>
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="fecha_cita" className="form-label">
            Fecha de la cita
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <input
              id="fecha_cita"
              type="date"
              name="fecha_cita"
              className="form-control"
              value={formulario.fecha_cita}
              onChange={manejarCambio}
              disabled={guardando}
            />
          </div>
          {formulario.fecha_cita && (
            <small className="text-muted">
              {formatearFecha(formulario.fecha_cita)}
            </small>
          )}
        </div>
        <div className="col-12 col-md-3">
          <label htmlFor="hora_inicio" className="form-label">
            Hora inicio
          </label>
          <input
            id="hora_inicio"
            type="time"
            name="hora_inicio"
            className="form-control"
            value={formulario.hora_inicio}
            onChange={manejarCambio}
            disabled={guardando}
          />
        </div>
        <div className="col-12 col-md-3">
          <label htmlFor="hora_fin" className="form-label">
            Hora fin
          </label>
          <input
            id="hora_fin"
            type="time"
            name="hora_fin"
            className="form-control"
            value={formulario.hora_fin}
            onChange={manejarCambio}
            disabled={guardando}
          />
        </div>
      </div>
    </div>

    <div className="cita-modal-section">
      <div className="cita-modal-section-title">
        <FaStethoscope />
        <span>Información de la consulta</span>
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="tipo_consulta" className="form-label">
            Tipo de consulta
          </label>
          <select
            id="tipo_consulta"
            name="tipo_consulta"
            className="form-select"
            value={formulario.tipo_consulta}
            onChange={manejarCambio}
            disabled={guardando}
          >
            <option value="PRIMERA_VEZ">Primera vez</option>
            <option value="SEGUIMIENTO">Seguimiento</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="estado" className="form-label">
            Estado de la cita
          </label>
          <select
            id="estado"
            name="estado"
            className="form-select"
            value={formulario.estado}
            onChange={manejarCambio}
            disabled={guardando}
          >
            <option value="PROGRAMADA">Programada</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="ATENDIDA">Atendida</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="NO_ASISTIO">No asistió</option>
          </select>
        </div>
      </div>
    </div>

    <div className="cita-modal-section">
      <div className="cita-modal-section-title">
        <FaFileMedical />
        <span>Motivo de consulta</span>
      </div>
      <label htmlFor="motivo" className="form-label">
        Motivo
      </label>
      <textarea
        id="motivo"
        name="motivo"
        className="form-control"
        rows="3"
        placeholder="Describe el motivo de la consulta..."
        value={formulario.motivo}
        onChange={manejarCambio}
        disabled={guardando}
      />
    </div>

    <div className="cita-modal-section">
      <div className="cita-modal-section-title">
        <FaInfoCircle />
        <span>Observaciones</span>
      </div>
      <label htmlFor="observaciones" className="form-label">
        Observaciones adicionales
      </label>
      <textarea
        id="observaciones"
        name="observaciones"
        className="form-control"
        rows="3"
        placeholder="Agrega observaciones relacionadas con la cita..."
        value={formulario.observaciones}
        onChange={manejarCambio}
        disabled={guardando}
      />
    </div>
  </div>
);

const CitaModalAcciones = ({ onCerrar, guardando }) => (
  <div className="cita-modal-footer">
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={onCerrar}
      disabled={guardando}
    >
      <FaTimes className="me-2" />
      Cancelar
    </button>
    <button
      type="submit"
      className="btn btn-milan-primary"
      disabled={guardando}
    >
      {guardando ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          Guardando...
        </>
      ) : (
        <>
          <FaSave className="me-2" />
          Guardar cambios
        </>
      )}
    </button>
  </div>
);

const crearFormularioInicial = (cita) => ({
  fecha_cita: cita.fecha_cita || "",
  hora_inicio: cita.hora_inicio ? cita.hora_inicio.slice(0, 5) : "",
  hora_fin: cita.hora_fin ? cita.hora_fin.slice(0, 5) : "",
  tipo_consulta: cita.tipo_consulta || "PRIMERA_VEZ",
  estado: cita.estado || "PROGRAMADA",
  motivo: cita.motivo || "",
  observaciones: cita.observaciones || "",
});

const CitaModalFormulario = ({
  cita,
  onCerrar,
  onActualizada,
  formularioInicial,
}) => {
  const [ediciones, setEdiciones] = useState({});
  const [guardando, setGuardando] = useState(false);

  const formulario = {
    ...formularioInicial,
    ...ediciones,
  };

  const paciente = cita.pacientes || {};
  const especialista = cita.especialistas || {};

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setEdiciones((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    if (!formulario.fecha_cita) {
      toast.warning("Debe seleccionar una fecha.");
      return false;
    }
    if (!formulario.hora_inicio) {
      toast.warning("Debe seleccionar la hora de inicio.");
      return false;
    }
    if (formulario.hora_fin && formulario.hora_fin <= formulario.hora_inicio) {
      toast.warning(
        "La hora de finalización debe ser posterior a la hora de inicio."
      );
      return false;
    }
    if (!formulario.estado) {
      toast.warning("Debe seleccionar un estado.");
      return false;
    }
    if (!formulario.tipo_consulta) {
      toast.warning("Debe seleccionar el tipo de consulta.");
      return false;
    }
    return true;
  };

  const guardarCambios = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;

    try {
      setGuardando(true);
      const { data, error } = await supabase
        .from("citas")
        .update({
          fecha_cita: formulario.fecha_cita,
          hora_inicio: formulario.hora_inicio,
          hora_fin: formulario.hora_fin || null,
          tipo_consulta: formulario.tipo_consulta,
          estado: formulario.estado,
          motivo: formulario.motivo.trim() || null,
          observaciones: formulario.observaciones.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id_cita", cita.id_cita)
        .select(`
          id_cita,
          id_paciente,
          id_especialista,
          fecha_cita,
          hora_inicio,
          hora_fin,
          motivo,
          tipo_consulta,
          estado,
          observaciones,
          updated_at
        `)
        .single();

      if (error) {
        console.error("Error actualizando cita:", error);
        toast.error("No se pudo actualizar la cita.");
        return;
      }

      toast.success("Cita actualizada correctamente.");
      onActualizada?.(data);
    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Ocurrió un error al actualizar la cita.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="cita-modal-overlay">
      <button
        type="button"
        className="modal-backdrop-dismiss"
        aria-label="Cerrar edición de cita"
        onClick={onCerrar}
      />
      <div className="cita-modal modal-backdrop-content">
        <div className="cita-modal-header">
          <div className="cita-modal-title">
            <div className="cita-modal-header-icon">
              <FaCalendarAlt />
            </div>
            <div>
              <h4>Editar cita</h4>
              <p>Actualiza la información de la cita médica</p>
            </div>
          </div>
          <button
            type="button"
            className="cita-modal-close"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>
        </div>
        <CitaModalIdentidades
          paciente={paciente}
          especialista={especialista}
        />
        <form onSubmit={guardarCambios}>
          <CitaModalCampos
            formulario={formulario}
            manejarCambio={manejarCambio}
            guardando={guardando}
          />
          <CitaModalAcciones onCerrar={onCerrar} guardando={guardando} />
        </form>
      </div>
    </div>
  );
};

const CitaModal = (props) => {
  const { cita } = props;
  if (!cita) return null;

  const formularioInicial = crearFormularioInicial(cita);
  const key = JSON.stringify([cita.id_cita, formularioInicial]);

  return (
    <CitaModalFormulario
      key={key}
      {...props}
      formularioInicial={formularioInicial}
    />
  );
};

export default CitaModal;
