import React, { useId, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import ProcedenciaDialog from "./ProcedenciaDialog";

const ProcedenciaSelector = ({ valor, procedencias = [], onSeleccionar, id }) => {
  const generatedId = useId();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [nuevaProcedencia, setNuevaProcedencia] = useState("");

  const resetearDialogo = () => {
    setMostrarModal(false);
    setBusqueda("");
    setMostrarAgregar(false);
    setNuevaProcedencia("");
  };

  const abrirModal = () => {
    setMostrarModal(true);
    setBusqueda("");
    setMostrarAgregar(false);
    setNuevaProcedencia("");
  };

  const seleccionarProcedencia = (procedencia) => {
    onSeleccionar(procedencia);
    resetearDialogo();
  };

  const abrirAgregar = () => {
    setMostrarAgregar(true);
    setNuevaProcedencia(busqueda);
    setBusqueda("");
  };

  const guardarNuevaProcedencia = () => {
    const nombre = nuevaProcedencia.trim();
    if (!nombre) return;

    const existente = procedencias.find(
      (procedencia) =>
        procedencia.toLowerCase() === nombre.toLowerCase()
    );

    seleccionarProcedencia(existente || nombre);
  };

  const procedenciasFiltradas = procedencias.filter((procedencia) =>
    procedencia.toLowerCase().includes(busqueda.toLowerCase())
  );

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
                id={id}
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
        <ProcedenciaDialog
          titleId={`procedencia-modal-titulo-${generatedId}`}
          searchId={`procedencia-busqueda-${generatedId}`}
          newNameId={`procedencia-nueva-${generatedId}`}
          showingAddForm={mostrarAgregar}
          search={busqueda}
          filteredOptions={procedenciasFiltradas}
          selectedValue={valor}
          newName={nuevaProcedencia}
          onSearchChange={setBusqueda}
          onNewNameChange={setNuevaProcedencia}
          onAdd={abrirAgregar}
          onCancelAdd={() => {
            setMostrarAgregar(false);
            setNuevaProcedencia("");
          }}
          onSelect={seleccionarProcedencia}
          onSaveNew={guardarNuevaProcedencia}
          onDismiss={resetearDialogo}
        />
      )}
    </>
  );
};

export default ProcedenciaSelector;
