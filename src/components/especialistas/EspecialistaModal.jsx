import React from "react";
import {
  FaUserMd,
  FaLock,
  FaKey,
} from "react-icons/fa";
import "../../styles/Especialistas.css";
import EspecialidadSelector from "./EspecialidadSelector";

const EspecialistaModal = ({
  mostrar,
  onCerrar,
  formulario,
  setFormulario,
  onSubmit,
  guardando,
  modoEdicion,
  especialidades,
  onAgregarEspecialidad,
}) => {
  if (!mostrar) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="modal fade show d-block especialista-modal"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0,0,0,.5)",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered especialista-modal-dialog">

        <div className="modal-content especialista-modal-content">

          {/* HEADER */}
          <div className="modal-header especialistas-modal-header">

            <div className="d-flex align-items-center gap-3">

              <div className="especialistas-modal-icon">
                <FaUserMd />
              </div>

              <div>
                <h5 className="modal-title mb-1">
                  {modoEdicion
                    ? "Editar especialista"
                    : "Nuevo especialista"}
                </h5>

                <small>
                  {modoEdicion
                    ? "Actualice la información profesional"
                    : "Registre el especialista y su acceso al sistema"}
                </small>
              </div>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onCerrar}
              disabled={guardando}
            />

          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={onSubmit}
            className="especialista-modal-form"
          >

            {/* CUERPO CON SCROLL */}
            <div className="modal-body especialista-modal-body">

              {/* =========================
                  DATOS DEL ESPECIALISTA
              ========================== */}
              <div className="especialista-form-section">

                <div className="especialista-form-title">
                  <FaUserMd />
                  <span>Datos del especialista</span>
                </div>

                <div className="row g-3">

                  {/* NOMBRES */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Nombres *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="nombres"
                      value={formulario.nombres || ""}
                      onChange={handleChange}
                      placeholder="Ingrese los nombres"
                      disabled={guardando}
                      required
                    />
                  </div>

                  {/* APELLIDOS */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Apellidos *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={formulario.apellidos || ""}
                      onChange={handleChange}
                      placeholder="Ingrese los apellidos"
                      disabled={guardando}
                      required
                    />
                  </div>

                  {/* ESPECIALIDAD */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Especialidad *
                    </label>

                    <EspecialidadSelector
                      especialidades={especialidades}
                      value={formulario.id_especialidad}
                      onChange={(id_especialidad) =>
                        setFormulario((prev) => ({
                          ...prev,
                          id_especialidad,
                        }))
                      }
                      onAgregarEspecialidad={onAgregarEspecialidad}
                      disabled={guardando}
                    />
                  </div>

                  {/* CÓDIGO PROFESIONAL */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Código profesional
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <FaKey />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          modoEdicion
                            ? formulario.codigo_profesional || ""
                            : "Se generará automáticamente"
                        }
                        disabled
                        readOnly
                      />

                    </div>

                    {!modoEdicion && (
                      <small className="text-muted">
                        El sistema asignará el código automáticamente.
                      </small>
                    )}
                  </div>

                  {/* TELÉFONO */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Teléfono
                    </label>

                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={formulario.telefono || ""}
                      onChange={handleChange}
                      placeholder="8888-8888"
                      disabled={guardando}
                    />
                  </div>

                  {/* CORREO */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Correo *
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="correo"
                      value={formulario.correo || ""}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      disabled={guardando}
                      required
                    />
                  </div>

                </div>
              </div>

              {/* =========================
                  ACCESO AL SISTEMA
              ========================== */}
              {!modoEdicion && (
                <div className="especialista-form-section mt-4">

                  <div className="especialista-form-title">
                    <FaLock />
                    <span>Acceso al sistema</span>
                  </div>

                  <div className="alert alert-info">
                    <small>
                      El especialista tendrá una cuenta para
                      ingresar al sistema. El correo registrado
                      será utilizado como usuario de acceso.
                    </small>
                  </div>

                  <div className="row g-3">

                    {/* CORREO DE ACCESO */}
                    <div className="col-12">

                      <label className="form-label">
                        Correo de acceso
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={formulario.correo || ""}
                        readOnly
                        disabled
                      />

                      <small className="text-muted">
                        Se utilizará el correo registrado arriba.
                      </small>

                    </div>

                    {/* CONTRASEÑA */}
                    <div className="col-12 col-md-6">

                      <label className="form-label">
                        Contraseña *
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formulario.password || ""}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        disabled={guardando}
                        minLength={6}
                        required
                      />

                    </div>

                    {/* CONFIRMAR CONTRASEÑA */}
                    <div className="col-12 col-md-6">

                      <label className="form-label">
                        Confirmar contraseña *
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        name="confirmar_password"
                        value={formulario.confirmar_password || ""}
                        onChange={handleChange}
                        placeholder="Repita la contraseña"
                        disabled={guardando}
                        minLength={6}
                        required
                      />

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* =========================
                FOOTER
            ========================== */}
            <div className="modal-footer">

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
                className="btn btn-milan-primary"
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
                    <FaUserMd className="me-2" />
                    {modoEdicion
                      ? "Guardar cambios"
                      : "Registrar especialista"}
                  </>
                )}

              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default EspecialistaModal;
