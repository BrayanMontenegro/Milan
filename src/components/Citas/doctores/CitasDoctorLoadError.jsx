import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const CitasDoctorLoadError = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div
      className="alert alert-danger d-flex align-items-start gap-3 mb-4"
      role="alert"
    >
      <FaExclamationTriangle className="mt-1" />
      <div>
        <strong>No fue posible cargar las citas.</strong>
        <div className="small mt-1">{error}</div>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger mt-3"
          onClick={onRetry}
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );
};

export default CitasDoctorLoadError;
