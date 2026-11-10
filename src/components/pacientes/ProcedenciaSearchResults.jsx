import React, { useEffect, useRef } from "react";
import {
  FaCheck,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

const ProcedenciaSearchResults = ({
  id,
  search,
  filteredOptions,
  selectedValue,
  onSearchChange,
  onAdd,
  onSelect,
}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <>
    <label className="form-label" htmlFor={id}>
      Buscar procedencia
    </label>
    <div className="procedencia-search">
      <FaSearch />
      <input
        ref={searchInputRef}
        id={id}
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar procedencia..."
      />
      {search && (
        <button
          type="button"
          aria-label="Limpiar búsqueda de procedencia"
          onClick={() => onSearchChange("")}
        >
          <FaTimes />
        </button>
      )}
    </div>

    <div className="procedencia-list">
      {filteredOptions.length === 0 ? (
        <div className="procedencia-empty">
          <FaMapMarkerAlt />
          <p>No se encontraron procedencias.</p>
          <button
            type="button"
            className="btn btn-sm btn-procedencia-agregar"
            onClick={onAdd}
          >
            <FaPlus className="me-1" />
            Escribir nueva procedencia
          </button>
        </div>
      ) : (
        filteredOptions.map((procedencia) => (
          <button
            type="button"
            key={procedencia}
            className={`procedencia-option ${
              selectedValue === procedencia ? "seleccionada" : ""
            }`}
            onClick={() => onSelect(procedencia)}
          >
            <div className="procedencia-option-icon">
              <FaMapMarkerAlt />
            </div>
            <span>{procedencia}</span>
            {selectedValue === procedencia && (
              <FaCheck className="procedencia-check" />
            )}
          </button>
        ))
      )}
    </div>

    <div className="procedencia-modal-footer">
      <span>
        {filteredOptions.length} procedencia
        {filteredOptions.length !== 1 ? "s" : ""}
      </span>
      <button
        type="button"
        className="btn btn-procedencia-agregar"
        onClick={onAdd}
      >
        <FaPlus className="me-2" />
        Agregar procedencia
      </button>
    </div>
    </>
  );
};

export default ProcedenciaSearchResults;
