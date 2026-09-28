import React from "react";
import {
  FaUserMd,
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
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
  errores = {},
  setErrores,
  mostrarValidacion = false,
}) => {
  const [mostrarPassword, setMostrarPassword] = React.useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = React.useState(false);

  if (!mostrar) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
      if (soloNumeros.length <= 4) {
        nuevoValor = soloNumeros;
      } else {
        nuevoValor = `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
      }
    }

    if (
      name === "nombres" ||
      name === "apellidos"
    ) {
      nuevoValor = value.replace(/[0-9]/g, "");
    }

    setFormulario((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));

    if (setErrores && errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getFieldClass = (fieldName) => {
    const value = formulario[fieldName] ?? "";
    const error = errores[fieldName];
    const tieneError = mostrarValidacion && !!error;
    const tieneValor = String(value).trim().length > 0;

    return `form-control ${tieneError ? "is-invalid" : ""} ${
      !tieneError && tieneValor ? "is-valid" : ""
    }`;
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
            noValidate
            onSubmit={onSubmit}
            className={`especialista-modal-form ${
              mostrarValidacion ? "was-validated" : ""
            }`}
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
                      className={getFieldClass("nombres")}
                      name="nombres"
                      value={formulario.nombres || ""}
                      onChange={handleChange}
                      placeholder="Ingrese los nombres"
                      disabled={guardando}
                      aria-invalid={
                        mostrarValidacion && !!errores.nombres
                      }
                      required
                    />
                    {mostrarValidacion && errores.nombres && (
                      <div className="invalid-feedback d-block">
                        {errores.nombres}
                      </div>
                    )}
                  </div>

                  {/* APELLIDOS */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Apellidos *
                    </label>

                    <input
                      type="text"
                      className={getFieldClass("apellidos")}
                      name="apellidos"
                      value={formulario.apellidos || ""}
                      onChange={handleChange}
                      placeholder="Ingrese los apellidos"
                      disabled={guardando}
                      aria-invalid={
                        mostrarValidacion && !!errores.apellidos
                      }
                      required
                    />
                    {mostrarValidacion && errores.apellidos && (
                      <div className="invalid-feedback d-block">
                        {errores.apellidos}
                      </div>
                    )}
                  </div>

                  {/* ESPECIALIDAD */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Especialidad *
                    </label>

                    <div
                      className={
                        mostrarValidacion && errores.id_especialidad
                          ? "border border-danger rounded-2 p-1"
                          : ""
                      }
                    >
                      <EspecialidadSelector
                        especialidades={especialidades}
                        value={formulario.id_especialidad}
                        onChange={(id_especialidad) => {
                          setFormulario((prev) => ({
                            ...prev,
                            id_especialidad,
                          }));

                          if (setErrores && errores.id_especialidad) {
                            setErrores((prev) => ({
                              ...prev,
                              id_especialidad: "",
                            }));
                          }
                        }}
                        onAgregarEspecialidad={onAgregarEspecialidad}
                        disabled={guardando}
                      />
                    </div>
                    {mostrarValidacion && errores.id_especialidad && (
                      <div className="invalid-feedback d-block">
                        {errores.id_especialidad}
                      </div>
                    )}
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
                        className={getFieldClass("codigo_profesional")}
                        name="codigo_profesional"
                        value={formulario.codigo_profesional || ""}
                        onChange={handleChange}
                        placeholder="Ingrese el código profesional"
                        disabled={guardando}
                        maxLength={50}
                      />

                    </div>
                  </div>

                  {/* TELÉFONO */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Teléfono
                    </label>

                    <input
                      type="tel"
                      className={getFieldClass("telefono")}
                      name="telefono"
                      value={formulario.telefono || ""}
                      onChange={handleChange}
                      placeholder="8888-8888"
                      disabled={guardando}
                      inputMode="numeric"
                      maxLength={9}
                      pattern="\d{4}-\d{4}"
                      aria-invalid={
                        mostrarValidacion && !!errores.telefono
                      }
                    />
                    {mostrarValidacion && errores.telefono && (
                      <div className="invalid-feedback d-block">
                        {errores.telefono}
                      </div>
                    )}
                  </div>

                  {/* CORREO */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Correo *
                    </label>

                    <input
                      type="email"
                      className={getFieldClass("correo")}
                      name="correo"
                      value={formulario.correo || ""}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      disabled={guardando}
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      aria-invalid={
                        mostrarValidacion && !!errores.correo
                      }
                      required
                    />
                    {mostrarValidacion && errores.correo && (
                      <div className="invalid-feedback d-block">
                        {errores.correo}
                      </div>
                    )}
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

                      <div className="input-group">
                        <input
                          type={mostrarPassword ? "text" : "password"}
                          className={getFieldClass("password")}
                          name="password"
                          value={formulario.password || ""}
                          onChange={handleChange}
                          placeholder="8+ caracteres, mayúscula, número y #"
                          disabled={guardando}
                          minLength={8}
                          pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
                          aria-invalid={
                            mostrarValidacion && !!errores.password
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setMostrarPassword((prev) => !prev)}
                          aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          tabIndex={-1}
                        >
                          {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {mostrarValidacion && errores.password && (
                        <div className="invalid-feedback d-block">
                          {errores.password}
                        </div>
                      )}

                    </div>

                    {/* CONFIRMAR CONTRASEÑA */}
                    <div className="col-12 col-md-6">

                      <label className="form-label">
                        Confirmar contraseña *
                      </label>

                      <div className="input-group">
                        <input
                          type={mostrarConfirmPassword ? "text" : "password"}
                          className={getFieldClass("confirmar_password")}
                          name="confirmar_password"
                          value={formulario.confirmar_password || ""}
                          onChange={handleChange}
                          placeholder="Repita la contraseña"
                          disabled={guardando}
                          minLength={6}
                          aria-invalid={
                            mostrarValidacion && !!errores.confirmar_password
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setMostrarConfirmPassword((prev) => !prev)}
                          aria-label={mostrarConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                          tabIndex={-1}
                        >
                          {mostrarConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {mostrarValidacion && errores.confirmar_password && (
                        <div className="invalid-feedback d-block">
                          {errores.confirmar_password}
                        </div>
                      )}

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
