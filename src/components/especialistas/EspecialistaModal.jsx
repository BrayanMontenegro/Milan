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
import useNativeDialog from "../../hooks/useNativeDialog";

const getFieldClass = (formulario, errores, mostrarValidacion, fieldName) => {
  const value = formulario[fieldName] ?? "";
  const tieneError = mostrarValidacion && !!errores[fieldName];
  const tieneValor = String(value).trim().length > 0;

  return `form-control ${tieneError ? "is-invalid" : ""} ${
    !tieneError && tieneValor ? "is-valid" : ""
  }`;
};

const ErrorValidacion = ({ mostrar, error }) => {
  if (!mostrar || !error) return null;
  return <div className="invalid-feedback d-block">{error}</div>;
};

const EspecialistaModalDatos = ({
  formulario,
  setFormulario,
  handleChange,
  guardando,
  especialidades,
  onAgregarEspecialidad,
  errores,
  setErrores,
  mostrarValidacion,
}) => (
  <div className="especialista-form-section">
    <div className="especialista-form-title">
      <FaUserMd />
      <span>Datos del especialista</span>
    </div>
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-nombres">Nombres *</label>
        <input
          id="especialista-nombres"
          type="text"
          className={getFieldClass(formulario, errores, mostrarValidacion, "nombres")}
          name="nombres"
          value={formulario.nombres || ""}
          onChange={handleChange}
          placeholder="Ingrese los nombres"
          disabled={guardando}
          aria-invalid={mostrarValidacion && !!errores.nombres}
          required
        />
        <ErrorValidacion mostrar={mostrarValidacion} error={errores.nombres} />
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-apellidos">Apellidos *</label>
        <input
          id="especialista-apellidos"
          type="text"
          className={getFieldClass(formulario, errores, mostrarValidacion, "apellidos")}
          name="apellidos"
          value={formulario.apellidos || ""}
          onChange={handleChange}
          placeholder="Ingrese los apellidos"
          disabled={guardando}
          aria-invalid={mostrarValidacion && !!errores.apellidos}
          required
        />
        <ErrorValidacion
          mostrar={mostrarValidacion}
          error={errores.apellidos}
        />
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-especialidad">Especialidad *</label>
        <div
          className={
            mostrarValidacion && errores.id_especialidad
              ? "border border-danger rounded-2 p-1"
              : ""
          }
        >
          <EspecialidadSelector
            id="especialista-especialidad"
            especialidades={especialidades}
            value={formulario.id_especialidad}
            onChange={(id_especialidad) => {
              setFormulario((prev) => ({ ...prev, id_especialidad }));
              if (setErrores && errores.id_especialidad) {
                setErrores((prev) => ({ ...prev, id_especialidad: "" }));
              }
            }}
            onAgregarEspecialidad={onAgregarEspecialidad}
            disabled={guardando}
          />
        </div>
        <ErrorValidacion
          mostrar={mostrarValidacion}
          error={errores.id_especialidad}
        />
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-codigo-profesional">Código profesional</label>
        <div className="input-group">
          <span className="input-group-text">
            <FaKey />
          </span>
          <input
            id="especialista-codigo-profesional"
            type="text"
            className={getFieldClass(
              formulario,
              errores,
              mostrarValidacion,
              "codigo_profesional"
            )}
            name="codigo_profesional"
            value={formulario.codigo_profesional || ""}
            onChange={handleChange}
            placeholder="Ingrese el código profesional"
            disabled={guardando}
            maxLength={50}
          />
        </div>
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-telefono">Teléfono</label>
        <input
          id="especialista-telefono"
          type="tel"
          className={getFieldClass(formulario, errores, mostrarValidacion, "telefono")}
          name="telefono"
          value={formulario.telefono || ""}
          onChange={handleChange}
          placeholder="8888-8888"
          disabled={guardando}
          inputMode="numeric"
          maxLength={9}
          pattern="\d{4}-\d{4}"
          aria-invalid={mostrarValidacion && !!errores.telefono}
        />
        <ErrorValidacion
          mostrar={mostrarValidacion}
          error={errores.telefono}
        />
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-correo">Correo *</label>
        <input
          id="especialista-correo"
          type="email"
          className={getFieldClass(formulario, errores, mostrarValidacion, "correo")}
          name="correo"
          value={formulario.correo || ""}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          disabled={guardando}
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          aria-invalid={mostrarValidacion && !!errores.correo}
          required
        />
        <ErrorValidacion mostrar={mostrarValidacion} error={errores.correo} />
      </div>
    </div>
  </div>
);

const EspecialistaModalAcceso = ({
  formulario,
  handleChange,
  guardando,
  errores,
  mostrarValidacion,
  mostrarPassword,
  setMostrarPassword,
  mostrarConfirmPassword,
  setMostrarConfirmPassword,
}) => (
  <div className="especialista-form-section mt-4">
    <div className="especialista-form-title">
      <FaLock />
      <span>Acceso al sistema</span>
    </div>
    <div className="alert alert-info">
      <small>
        El especialista tendrá una cuenta para ingresar al sistema. El correo
        registrado será utilizado como usuario de acceso.
      </small>
    </div>
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label" htmlFor="especialista-correo-acceso">Correo de acceso</label>
        <input
          id="especialista-correo-acceso"
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
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-password">Contraseña *</label>
        <div className="input-group">
          <input
            id="especialista-password"
            type={mostrarPassword ? "text" : "password"}
            className={getFieldClass(
              formulario,
              errores,
              mostrarValidacion,
              "password"
            )}
            name="password"
            value={formulario.password || ""}
            onChange={handleChange}
            placeholder="8+ caracteres, mayúscula, número y #"
            disabled={guardando}
            minLength={8}
            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
            aria-invalid={mostrarValidacion && !!errores.password}
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
        <ErrorValidacion
          mostrar={mostrarValidacion}
          error={errores.password}
        />
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="especialista-confirmar-password">Confirmar contraseña *</label>
        <div className="input-group">
          <input
            id="especialista-confirmar-password"
            type={mostrarConfirmPassword ? "text" : "password"}
            className={getFieldClass(
              formulario,
              errores,
              mostrarValidacion,
              "confirmar_password"
            )}
            name="confirmar_password"
            value={formulario.confirmar_password || ""}
            onChange={handleChange}
            placeholder="Repita la contraseña"
            disabled={guardando}
            minLength={6}
            aria-invalid={mostrarValidacion && !!errores.confirmar_password}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setMostrarConfirmPassword((prev) => !prev)}
            aria-label={
              mostrarConfirmPassword
                ? "Ocultar confirmación"
                : "Mostrar confirmación"
            }
            tabIndex={-1}
          >
            {mostrarConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <ErrorValidacion
          mostrar={mostrarValidacion}
          error={errores.confirmar_password}
        />
      </div>
    </div>
  </div>
);

const EspecialistaModalAcciones = ({
  onCerrar,
  guardando,
  modoEdicion,
}) => (
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
          <span className="spinner-border spinner-border-sm me-2" />
          Guardando...
        </>
      ) : (
        <>
          <FaUserMd className="me-2" />
          {modoEdicion ? "Guardar cambios" : "Registrar especialista"}
        </>
      )}
    </button>
  </div>
);

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
  const dialogRef = useNativeDialog(mostrar, onCerrar);
  const [mostrarPassword, setMostrarPassword] = React.useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] =
    React.useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nuevoValor = value;

    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
      nuevoValor =
        soloNumeros.length <= 4
          ? soloNumeros
          : `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
    }
    if (name === "nombres" || name === "apellidos") {
      nuevoValor = value.replace(/[0-9]/g, "");
    }

    setFormulario((prev) => ({ ...prev, [name]: nuevoValor }));
    if (setErrores && errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!mostrar) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal fade show d-block especialista-modal native-modal-root"
      aria-labelledby="especialista-modal-titulo"
      style={{ backgroundColor: "rgba(0,0,0,.5)" }}
    >
      <button
        type="button"
        className="modal-backdrop-dismiss"
        aria-label="Cerrar formulario de especialista"
        onClick={() => dialogRef.current?.close()}
      />
      <div className="modal-dialog modal-lg modal-dialog-centered especialista-modal-dialog modal-backdrop-content">
        <div className="modal-content especialista-modal-content">
          <div className="modal-header especialistas-modal-header">
            <div className="d-flex align-items-center gap-3">
              <div className="especialistas-modal-icon">
                <FaUserMd />
              </div>
              <div>
                <h5 className="modal-title mb-1" id="especialista-modal-titulo">
                  {modoEdicion ? "Editar especialista" : "Nuevo especialista"}
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
              aria-label="Cerrar formulario de especialista"
            />
          </div>
          <form
            noValidate
            onSubmit={onSubmit}
            className={`especialista-modal-form ${
              mostrarValidacion ? "was-validated" : ""
            }`}
          >
            <div className="modal-body especialista-modal-body">
              <EspecialistaModalDatos
                formulario={formulario}
                setFormulario={setFormulario}
                handleChange={handleChange}
                guardando={guardando}
                especialidades={especialidades}
                onAgregarEspecialidad={onAgregarEspecialidad}
                errores={errores}
                setErrores={setErrores}
                mostrarValidacion={mostrarValidacion}
              />
              {!modoEdicion && (
                <EspecialistaModalAcceso
                  formulario={formulario}
                  handleChange={handleChange}
                  guardando={guardando}
                  errores={errores}
                  mostrarValidacion={mostrarValidacion}
                  mostrarPassword={mostrarPassword}
                  setMostrarPassword={setMostrarPassword}
                  mostrarConfirmPassword={mostrarConfirmPassword}
                  setMostrarConfirmPassword={setMostrarConfirmPassword}
                />
              )}
            </div>
            <EspecialistaModalAcciones
              onCerrar={onCerrar}
              guardando={guardando}
              modoEdicion={modoEdicion}
            />
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EspecialistaModal;
