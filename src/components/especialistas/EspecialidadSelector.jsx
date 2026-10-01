import React, { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaPlus,
  FaStethoscope,
  FaTimes,
} from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialidadSelector = ({
  especialidades = [],
  value,
  onChange,
  onAgregarEspecialidad,
  disabled = false,
}) => {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    nombre: "",
    descripcion: "",
  });

  const contenedorRef = useRef(null);

  const especialidadSeleccionada = especialidades.find(
    (especialidad) =>
      especialidad.id_especialidad === value
  );

  const especialidadesFiltradas = especialidades.filter((especialidad) =>
    especialidad.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    const cerrarAlHacerClickFuera = (event) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target)
      ) {
        setAbierto(false);
      }
    };

    document.addEventListener(
      "mousedown",
      cerrarAlHacerClickFuera
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        cerrarAlHacerClickFuera
      );
    };
  }, []);

  const seleccionarEspecialidad = (especialidad) => {
    onChange(especialidad.id_especialidad);
    setBusqueda("");
    setAbierto(false);
  };

  const limpiarSeleccion = (event) => {
    event.stopPropagation();

    onChange("");
    setBusqueda("");
  };

  const abrirNuevaEspecialidad = () => {
    setMostrarNueva(true);
    setAbierto(false);
  };

  const cancelarNuevaEspecialidad = () => {
    setMostrarNueva(false);

    setNuevaEspecialidad({
      nombre: "",
      descripcion: "",
    });
  };

  const handleNuevaChange = (event) => {
    const { name, value } = event.target;

    setNuevaEspecialidad((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarNuevaEspecialidad = async (event) => {
    event.preventDefault();

    const nombre = nuevaEspecialidad.nombre.trim();
    const descripcion =
      nuevaEspecialidad.descripcion.trim();

    if (!nombre) {
      return;
    }

    const resultado = await onAgregarEspecialidad({
      nombre,
      descripcion,
    });

    if (resultado?.id_especialidad) {
      onChange(resultado.id_especialidad);

      cancelarNuevaEspecialidad();
    }
  };

  return (
    <>
      <div
        className="especialidad-selector"
        ref={contenedorRef}
      >
        <button
          type="button"
          className={`especialidad-selector-button ${
            abierto ? "activo" : ""
          }`}
          onClick={() =>
            !disabled && setAbierto(!abierto)
          }
          disabled={disabled}
        >
          <div className="especialidad-selector-value">
            <FaStethoscope className="especialidad-selector-icon" />

            <span
              className={
                especialidadSeleccionada
                  ? ""
                  : "text-muted"
              }
            >
              {especialidadSeleccionada
                ? especialidadSeleccionada.nombre
                : "Seleccione una especialidad"}
            </span>
          </div>

          <div className="especialidad-selector-actions">
            {especialidadSeleccionada && !disabled && (
              <span
                className="especialidad-selector-clear"
                onClick={limpiarSeleccion}
                title="Quitar selección"
              >
                <FaTimes />
              </span>
            )}

            <FaChevronDown
              className={`especialidad-selector-arrow ${
                abierto ? "rotado" : ""
              }`}
            />
          </div>
        </button>

        {abierto && !disabled && (
          <div className="especialidad-selector-dropdown">
            <div className="especialidad-selector-search">
              <FaSearch />

              <input
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar especialidad..."
                autoFocus
              />
            </div>

            <div className="especialidad-selector-list">
              {especialidadesFiltradas.length > 0 ? (
                especialidadesFiltradas.map(
                  (especialidad) => (
                    <button
                      type="button"
                      key={
                        especialidad.id_especialidad
                      }
                      className={`especialidad-selector-option ${
                        value ===
                        especialidad.id_especialidad
                          ? "seleccionada"
                          : ""
                      }`}
                      onClick={() =>
                        seleccionarEspecialidad(
                          especialidad
                        )
                      }
                    >
                      <div>
                        <strong>
                          {especialidad.nombre}
                        </strong>

                        {especialidad.descripcion && (
                          <small>
                            {especialidad.descripcion}
                          </small>
                        )}
                      </div>
                    </button>
                  )
                )
              ) : (
                <div className="especialidad-selector-empty">
                  No se encontraron especialidades.
                </div>
              )}
            </div>

            <div className="especialidad-selector-footer">
              <button
                type="button"
                className="especialidad-selector-add"
                onClick={abrirNuevaEspecialidad}
              >
                <FaPlus />
                Agregar nueva especialidad
              </button>
            </div>
          </div>
        )}
      </div>

      {mostrarNueva && (
        <div className="especialidad-nueva-container">
          <div className="especialidad-nueva-header">
            <div>
              <strong>Agregar especialidad</strong>
              <small>
                Registre una nueva especialidad
              </small>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={cancelarNuevaEspecialidad}
            >
              <FaTimes />
            </button>
          </div>

          <div
            className="especialidad-nueva-form"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                event.target.tagName !== "TEXTAREA"
              ) {
                event.preventDefault();
                guardarNuevaEspecialidad(event);
              }
            }}
          >
            <div className="mb-3">
              <label className="form-label">
                Nombre de la especialidad *
              </label>

              <input
                type="text"
                className="form-control"
                name="nombre"
                value={nuevaEspecialidad.nombre}
                onChange={handleNuevaChange}
                placeholder="Ej. Cardiología"
                required
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Descripción
              </label>

              <textarea
                className="form-control"
                name="descripcion"
                value={
                  nuevaEspecialidad.descripcion
                }
                onChange={handleNuevaChange}
                placeholder="Descripción de la especialidad"
                rows="3"
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={cancelarNuevaEspecialidad}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-milan-primary"
                onClick={guardarNuevaEspecialidad}
              >
                <FaPlus className="me-2" />
                Agregar especialidad
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EspecialidadSelector;