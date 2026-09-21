import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave
} from "react-icons/fa";

const ProcedenciaSelector = ({
  valor,
  procedencias = [],
  onSeleccionar
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [nuevaProcedencia, setNuevaProcedencia] = useState("");

  const procedenciasFiltradas = procedencias.filter((procedencia) =>
    procedencia.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModal = () => {
    setMostrarModal(true);
    setBusqueda("");
    setMostrarAgregar(false);
    setNuevaProcedencia("");
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setBusqueda("");
    setMostrarAgregar(false);
    setNuevaProcedencia("");
  };

  const seleccionarProcedencia = (procedencia) => {
    onSeleccionar(procedencia);
    cerrarModal();
  };

  const abrirAgregar = () => {
    setMostrarAgregar(true);

    // Si el usuario había escrito algo en el buscador,
    // lo aprovechamos como nombre de la nueva procedencia.
    setNuevaProcedencia(busqueda);

    setBusqueda("");
  };

  const cancelarAgregar = () => {
    setMostrarAgregar(false);
    setNuevaProcedencia("");
  };

  const guardarNuevaProcedencia = () => {
    const nombre = nuevaProcedencia.trim();

    if (!nombre) {
      return;
    }

    // Si ya existe, simplemente la seleccionamos.
    const existente = procedencias.find(
      (procedencia) =>
        procedencia.toLowerCase() === nombre.toLowerCase()
    );

    if (existente) {
      onSeleccionar(existente);
      cerrarModal();
      return;
    }

    // No necesitamos guardar nada en Supabase.
    // La procedencia se guarda directamente
    // en formulario.procedencia cuando se registra el paciente.
    onSeleccionar(nombre);

    cerrarModal();
  };

  return (
    <>
      <div className="procedencia-selector">

        <div className="d-flex gap-2">

          <div className="flex-grow-1">

            <div className="input-group">

              <span className="input-group-text">
                <FaMapMarkerAlt />
              </span>

              <input
                type="text"
                className="form-control"
                value={valor || ""}
                placeholder="Seleccione una procedencia"
                readOnly
              />

            </div>

          </div>

          <button
            type="button"
            className="btn btn-procedencia-selector"
            onClick={abrirModal}
          >
            <FaMapMarkerAlt className="me-2" />
            Seleccionar
          </button>

        </div>

      </div>

      {mostrarModal && (

        <div
          className="procedencia-modal-backdrop"
          onClick={cerrarModal}
        >

          <div
            className="procedencia-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div className="procedencia-modal-header">

              <div>

                <h5>
                  {mostrarAgregar
                    ? "Agregar procedencia"
                    : "Seleccionar procedencia"}
                </h5>

                <small>
                  {mostrarAgregar
                    ? "Escriba la localidad o comarca"
                    : "Busque y seleccione la localidad o comarca"}
                </small>

              </div>

              <button
                type="button"
                className="procedencia-close"
                onClick={cerrarModal}
              >
                <FaTimes />
              </button>

            </div>

            {mostrarAgregar ? (

              <div className="procedencia-agregar-container">

                <div className="procedencia-agregar-icon">
                  <FaMapMarkerAlt />
                </div>

                <label className="form-label">
                  Nueva procedencia o comarca
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={nuevaProcedencia}
                  onChange={(e) =>
                    setNuevaProcedencia(e.target.value)
                  }
                  placeholder="Ej. Nueva Guinea o comarca"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      guardarNuevaProcedencia();
                    }
                  }}
                />

                <div className="d-flex justify-content-end gap-2 mt-3">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelarAgregar}
                  >
                    <FaTimes className="me-1" />
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="btn btn-procedencia-agregar"
                    onClick={guardarNuevaProcedencia}
                    disabled={!nuevaProcedencia.trim()}
                  >
                    <FaSave className="me-1" />
                    Seleccionar
                  </button>

                </div>

              </div>

            ) : (

              <>
                {/* BUSCADOR */}

                <div className="procedencia-search">

                  <FaSearch />

                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) =>
                      setBusqueda(e.target.value)
                    }
                    placeholder="Buscar procedencia..."
                    autoFocus
                  />

                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda("")}
                    >
                      <FaTimes />
                    </button>
                  )}

                </div>


                {/* LISTA */}

                <div className="procedencia-list">

                  {procedenciasFiltradas.length === 0 ? (

                    <div className="procedencia-empty">

                      <FaMapMarkerAlt />

                      <p>
                        No se encontraron procedencias.
                      </p>

                      <button
                        type="button"
                        className="btn btn-sm btn-procedencia-agregar"
                        onClick={abrirAgregar}
                      >
                        <FaPlus className="me-1" />
                        Escribir nueva procedencia
                      </button>

                    </div>

                  ) : (

                    procedenciasFiltradas.map(
                      (procedencia, index) => (

                        <button
                          type="button"
                          key={`${procedencia}-${index}`}
                          className={
                            `procedencia-option ${
                              valor === procedencia
                                ? "seleccionada"
                                : ""
                            }`
                          }
                          onClick={() =>
                            seleccionarProcedencia(procedencia)
                          }
                        >

                          <div className="procedencia-option-icon">
                            <FaMapMarkerAlt />
                          </div>

                          <span>
                            {procedencia}
                          </span>

                          {valor === procedencia && (
                            <FaCheck className="procedencia-check" />
                          )}

                        </button>

                      )
                    )

                  )}

                </div>


                {/* FOOTER */}

                <div className="procedencia-modal-footer">

                  <span>
                    {procedenciasFiltradas.length} procedencia
                    {procedenciasFiltradas.length !== 1
                      ? "s"
                      : ""}
                  </span>

                  <button
                    type="button"
                    className="btn btn-procedencia-agregar"
                    onClick={abrirAgregar}
                  >
                    <FaPlus className="me-2" />
                    Agregar procedencia
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </>
  );
};

export default ProcedenciaSelector;