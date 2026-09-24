import React from "react";
import ProcedenciaSelector from "./ProcedenciaSelector";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaUsers
} from "react-icons/fa";

const calcularEdad = (fechaNacimiento) => {

  if (!fechaNacimiento) {
    return null;
  }

  const nacimiento =
    new Date(fechaNacimiento);

  const hoy =
    new Date();

  let edad =
    hoy.getFullYear() -
    nacimiento.getFullYear();

  const mes =
    hoy.getMonth() -
    nacimiento.getMonth();

  if (
    mes < 0 ||
    (
      mes === 0 &&
      hoy.getDate() < nacimiento.getDate()
    )
  ) {
    edad--;
  }

  return edad;
};

const limpiarTextoNombre = (valor) => {
  return valor
    .replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s'-]/g, "")
    .replace(/\s{2,}/g, " ");
};

const formatearTelefono = (valor) => {
  const numeros = valor.replace(/\D/g, "");
  const limitado = numeros.slice(0, 8);
  if (limitado.length > 4) {
    return (
      limitado.slice(0, 4) +
      "-" +
      limitado.slice(4)
    );
  }

  return limitado;
};

const telefonoValido = (telefono) => {
  return /^\d{4}-\d{4}$/.test(
    telefono
  );
};

const limpiarCorreo = (valor) => {
  return valor
    .replace(/\s/g, "")
    .slice(0, 100);
};

const correoValido = (correo) => {
  if (!correo) {
    return true;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo
  );
};

const PacienteForm = ({
  formulario,
  setFormulario,
  onSubmit,
  onCancelar,
  guardando = false,
  modoEdicion = false,
  procedencias = []
}) => {

  const edad =
    calcularEdad(
      formulario.fecha_nacimiento
    );

  const esMenor =
    edad !== null &&
    edad < 18;

  const manejarCambio = (e) => {

    const {
      name,
      value
    } = e.target;

    let valorProcesado = value;

    if (
      name === "nombres" ||
      name === "apellidos" ||
      name === "nombre_tutor"
    ) {
      valorProcesado = limpiarTextoNombre(value);
    }

    if (
      name === "telefono" ||
      name === "telefono_tutor"
    ) {
      valorProcesado = formatearTelefono(value);
    }

    if (name === "ocupacion") {
      valorProcesado = value.replace(/[0-9]/g, "");
    }

    setFormulario((actual) => ({
      ...actual,
      [name]: valorProcesado
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="paciente-form"
    >

      <div className="paciente-form-section">

        <div className="paciente-form-section-title">

          <div className="paciente-form-section-icon">
            <FaUser />
          </div>

          <div>
            <h5>
              Información personal
            </h5>

            <small>
              Datos básicos del paciente
            </small>
          </div>

        </div>

        <div className="row g-3">

          {/* Nombres */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              Nombres
              <span className="text-danger"> *</span>
            </label>

            <input
              type="text"
              name="nombres"
              className="form-control"
              value={formulario.nombres}
              onChange={manejarCambio}
              placeholder="Ingrese los nombres"
              required
            />

          </div>

          {/* Apellidos */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              Apellidos
              <span className="text-danger"> *</span>
            </label>

            <input
              type="text"
              name="apellidos"
              className="form-control"
              value={formulario.apellidos}
              onChange={manejarCambio}
              placeholder="Ingrese los apellidos"
              required
            />

          </div>

          {/* Fecha nacimiento */}
          <div className="col-12 col-md-4">

            <label className="form-label">
              <FaBirthdayCake className="me-1" />
              Fecha de nacimiento
              <span className="text-danger"> *</span>
            </label>

            <input
              type="date"
              name="fecha_nacimiento"
              className="form-control"
              value={formulario.fecha_nacimiento}
              onChange={manejarCambio}
              required
            />

            {edad !== null && (
              <small className="text-muted">
                Edad: {edad} años
              </small>
            )}

          </div>

          {/* Sexo */}
          <div className="col-12 col-md-4">

            <label className="form-label">
              Sexo
              <span className="text-danger"> *</span>
            </label>

            <select
              name="sexo"
              className="form-select"
              value={formulario.sexo}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccione
              </option>

              <option value="MASCULINO">
                Masculino
              </option>

              <option value="FEMENINO">
                Femenino
            </option>

              <option value="OTRO">
                Otro
              </option>

            </select>

          </div>

          {/* Estado civil */}
          <div className="col-12 col-md-4">

            <label className="form-label">
              Estado civil
            </label>

            <select
              name="estado_civil"
              className="form-select"
              value={formulario.estado_civil}
              onChange={manejarCambio}
            >
              <option value="">
                Seleccione
              </option>

              <option value="SOLTERO">
                Soltero/a
              </option>

              <option value="CASADO">
                Casado/a
              </option>

              <option value="UNION_LIBRE">
                Unión libre
              </option>

              <option value="DIVORCIADO">
                Divorciado/a
              </option>

              <option value="VIUDO">
                Viudo/a
              </option>

            </select>

          </div>

        </div>

      </div>

      <div className="paciente-form-section">

        <div className="paciente-form-section-title">

          <div className="paciente-form-section-icon turquoise">
            <FaPhone />
          </div>

          <div>
            <h5>
              Información de contacto
            </h5>

            <small>
              Datos para comunicación y ubicación
            </small>
          </div>

        </div>

        <div className="row g-3">

          {/* Teléfono */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              className="form-control"
              value={formulario.telefono || ""}
              onChange={manejarCambio}
              placeholder="8888-8888"
              inputMode="numeric"
              maxLength={9}
            />

          </div>

          {/* Correo */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              Correo electrónico
            </label>

            <input
              type="email"
              name="correo"
              className="form-control"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="correo@ejemplo.com"
            />

          </div>

          {/* Procedencia */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              <FaMapMarkerAlt className="me-1" />
              Procedencia
              <span className="text-danger"> *</span>
            </label>

              <ProcedenciaSelector
                valor={formulario.procedencia}
                procedencias={procedencias}
                onSeleccionar={(procedencia) =>
                  setFormulario((actual) => ({
                    ...actual,
                    procedencia
                  }))
                }
              />

            <input
              type="text"
              value={formulario.procedencia || ""}
              required
              readOnly
              tabIndex="-1"
              className="position-absolute opacity-0"
              style={{
                width: "1px",
                height: "1px"
              }}
            />

          </div>

          {/* Dirección */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              Dirección
            </label>

            <input
              type="text"
              name="direccion"
              className="form-control"
              value={formulario.direccion}
              onChange={manejarCambio}
              placeholder="Dirección del paciente"
            />

          </div>

          {/* Ocupación */}
          <div className="col-12 col-md-6">

            <label className="form-label">
              Ocupación
            </label>

            <input
              type="text"
              name="ocupacion"
              className="form-control"
              value={formulario.ocupacion}
              onChange={manejarCambio}
              placeholder="Ocupación"
            />

          </div>

        </div>

      </div>

        {edad !== null && edad < 18 && (
          <div className="paciente-form-section paciente-tutor-section">

            <div className="paciente-form-section-title">

              <div className="paciente-form-section-icon yellow">
                <FaUsers />
              </div>

              <div>
                <h5>Información del tutor</h5>
                <small>
                  Los datos del tutor son obligatorios para pacientes menores de edad.
                </small>
              </div>

            </div>

            <div className="row g-3">

              {/* Nombre del tutor */}
              <div className="col-md-6">

                <label className="form-label">
                  Nombre completo del tutor
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="text"
                  name="nombre_tutor"
                  className="form-control"
                  value={formulario.nombre_tutor || ""}
                  onChange={manejarCambio}
                  placeholder="Ingrese el nombre del tutor"
                  required
                />

              </div>


              {/* Parentesco */}
              <div className="col-md-3">

                <label className="form-label">
                  Parentesco
                  <span className="text-danger ms-1">*</span>
                </label>

                <select
                  name="parentesco_tutor"
                  className="form-select"
                  value={formulario.parentesco_tutor || ""}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">
                    Seleccione
                  </option>

                  <option value="Padre">
                    Padre
                  </option>

                  <option value="Madre">
                    Madre
                  </option>

                  <option value="Tutor">
                    Tutor
                  </option>

                  <option value="Abuelo">
                    Abuelo
                  </option>

                  <option value="Abuela">
                    Abuela
                  </option>

                  <option value="Otro">
                    Otro
                  </option>

                </select>

              </div>


              {/* Teléfono */}
              <div className="col-md-3">

                <label className="form-label">
                  Teléfono del tutor
                  <span className="text-danger ms-1">*</span>
                </label>

                  <input
                    type="tel"
                    name="telefono_tutor"
                    className="form-control"
                    value={formulario.telefono_tutor || ""}
                    onChange={manejarCambio}
                    placeholder="8888-8888"
                    inputMode="numeric"
                    maxLength={9}
                    required
                  />
              </div>
            </div>
          </div>
        )}

      <div className="paciente-form-section">

        <div className="paciente-form-section-title">

          <div className="paciente-form-section-icon purple">
            <FaUser />
          </div>

          <div>
            <h5>
              Observaciones
            </h5>

            <small>
              Información adicional del paciente
            </small>
          </div>

        </div>

        <textarea
          name="observaciones"
          className="form-control"
          rows="4"
          value={formulario.observaciones}
          onChange={manejarCambio}
          placeholder="Escriba cualquier información adicional..."
        />

      </div>

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
          ) : (
            modoEdicion
              ? "Actualizar paciente"
              : "Registrar paciente"
          )}

        </button>

      </div>

    </form>
  );
};

export default PacienteForm;