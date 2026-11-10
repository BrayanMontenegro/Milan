import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import ProcedenciaAddForm from "./ProcedenciaAddForm";
import ProcedenciaSearchResults from "./ProcedenciaSearchResults";

const ProcedenciaDialog = ({
  titleId,
  searchId,
  newNameId,
  showingAddForm,
  search,
  filteredOptions,
  selectedValue,
  newName,
  onSearchChange,
  onNewNameChange,
  onAdd,
  onCancelAdd,
  onSelect,
  onSaveNew,
  onDismiss,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) dialog.showModal();
    dialog.querySelector("input")?.focus();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const handleCancel = (event) => {
    event.preventDefault();
    onDismiss();
  };

  return (
    <div className="procedencia-modal-backdrop">
      <style>{".procedencia-dialog::backdrop { background: transparent; }"}</style>
      <dialog
        ref={dialogRef}
        className="procedencia-dialog"
        style={{
          position: "fixed",
          inset: 0,
          margin: 0,
          padding: 0,
          border: 0,
          width: "100vw",
          height: "100vh",
          maxWidth: "none",
          maxHeight: "none",
          overflow: "visible",
          background: "transparent",
        }}
        aria-labelledby={titleId}
        onCancel={handleCancel}
      >
        <button
          type="button"
          className="modal-backdrop-dismiss"
          aria-label="Cerrar selector de procedencia"
          onClick={onDismiss}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            padding: 0,
            border: 0,
            background: "transparent",
          }}
        />
        <div
          className="procedencia-modal modal-backdrop-content"
          style={{ position: "fixed", inset: 0, margin: "auto" }}
        >
          <div className="procedencia-modal-header">
            <div>
              <h5 id={titleId}>
                {showingAddForm
                  ? "Agregar procedencia"
                  : "Seleccionar procedencia"}
              </h5>
              <small>
                {showingAddForm
                  ? "Escriba la localidad o comarca"
                  : "Busque y seleccione la localidad o comarca"}
              </small>
            </div>
            <button
              type="button"
              className="procedencia-close"
              onClick={onDismiss}
              aria-label="Cerrar selector de procedencia"
            >
              <FaTimes />
            </button>
          </div>

          {showingAddForm ? (
            <ProcedenciaAddForm
              id={newNameId}
              value={newName}
              onChange={onNewNameChange}
              onCancel={onCancelAdd}
              onSave={onSaveNew}
            />
          ) : (
            <ProcedenciaSearchResults
              id={searchId}
              search={search}
              filteredOptions={filteredOptions}
              selectedValue={selectedValue}
              onSearchChange={onSearchChange}
              onAdd={onAdd}
              onSelect={onSelect}
            />
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ProcedenciaDialog;
