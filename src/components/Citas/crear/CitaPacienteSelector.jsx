import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaIdCard,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

const CitaPacienteSelector = ({
  paciente,
  pacientes = [],
  busqueda,
  setBusqueda,
  onSeleccionar,
  cargando = false,
}) => {
  const [mostrarResultados, setMostrarResultados] =
    useState(false);

  useEffect(() => {
    if (busqueda.trim()) {
      setMostrarResultados(true);
    }
  }, [busqueda]);

  const seleccionarPaciente = (item) => {
    onSeleccionar(item);
    setMostrarResultados(false);
  };

  const limpiarPaciente = () => {
    onSeleccionar(null);
    setBusqueda("");
    setMostrarResultados(false);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setMostrarResultados(true);
  };

  if (paciente) {
    return (
      <div className="cita-paciente-seleccionado">

        <div className="cita-paciente-avatar">
          <FaUser />
        </div>

        <div className="cita-paciente-info">

          <strong>
            {paciente.nombres}{" "}
            {paciente.apellidos}
          </strong>

          <span>
            <FaIdCard />
            {paciente.codigo_expediente}
          </span>

          {paciente.telefono && (
            <span>
              {paciente.telefono}
            </span>
          )}

        </div>

        <div className="cita-paciente-check">
          <FaCheckCircle />
        </div>

        <button
          type="button"
          className="cita-paciente-quitar"
          onClick={limpiarPaciente}
          title="Cambiar paciente"
        >
          <FaTimes />
        </button>

      </div>
    );
  }

  return (
    <div className="cita-paciente-selector">

      <div className="cita-paciente-buscador">

        <FaSearch />

        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, expediente o teléfono..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          onFocus={() =>
            setMostrarResultados(true)
          }
        />

        {busqueda && (
          <button
            type="button"
            onClick={limpiarBusqueda}
            className="cita-buscador-limpiar"
            title="Limpiar búsqueda"
          >
            <FaTimes />
          </button>
        )}

      </div>

      {mostrarResultados && (
        <div className="cita-paciente-resultados">

          {cargando ? (
            <div className="cita-selector-cargando">

              <div
                className="spinner-border spinner-border-sm"
                role="status"
              />

              <span>
                Buscando pacientes...
              </span>

            </div>
          ) : pacientes.length === 0 ? (
            <div className="cita-selector-vacio">

              <FaUser />

              <strong>
                {busqueda.trim()
                  ? "No se encontraron pacientes"
                  : "No hay pacientes disponibles"}
              </strong>

              <span>
                {busqueda.trim()
                  ? "Intente con otro nombre, expediente o teléfono."
                  : "No existen pacientes activos registrados."}
              </span>

            </div>
          ) : (
            pacientes.map((item) => (
              <button
                type="button"
                key={item.id_paciente}
                className="cita-paciente-resultado"
                onClick={() =>
                  seleccionarPaciente(item)
                }
              >

                <div className="cita-paciente-resultado-icono">
                  <FaUser />
                </div>

                <div className="cita-paciente-resultado-info">

                  <strong>
                    {item.nombres}{" "}
                    {item.apellidos}
                  </strong>

                  <span>
                    <FaIdCard />
                    {item.codigo_expediente}
                  </span>

                  {item.telefono && (
                    <small>
                      {item.telefono}
                    </small>
                  )}

                </div>

              </button>
            ))
          )}

        </div>
      )}

    </div>
  );
};

export default CitaPacienteSelector;