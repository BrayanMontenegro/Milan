import React, { useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";

const ProcedenciaAddForm = ({ id, value, onChange, onCancel, onSave }) => (
  <div className="procedencia-agregar-container">
    <div className="procedencia-agregar-icon">
      <FaMapMarkerAlt />
    </div>
    <label className="form-label" htmlFor={id}>
      Nueva procedencia o comarca
    </label>
    <AutoFocusedNameInput
      id={id}
      value={value}
      onChange={onChange}
      onSave={onSave}
    />
    <div className="d-flex justify-content-end gap-2 mt-3">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
      >
        <FaTimes className="me-1" />
        Cancelar
      </button>
      <button
        type="button"
        className="btn btn-procedencia-agregar"
        onClick={onSave}
        disabled={!value.trim()}
      >
        <FaSave className="me-1" />
        Seleccionar
      </button>
    </div>
  </div>
);

const AutoFocusedNameInput = ({ id, value, onChange, onSave }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      className="form-control"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Ej. Nueva Guinea o comarca"
      onKeyDown={(event) => {
        if (event.key === "Enter") onSave();
      }}
    />
  );
};

export default ProcedenciaAddForm;
