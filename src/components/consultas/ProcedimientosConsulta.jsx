
import React, { useMemo } from "react";
import {
  FaPlus,
  FaTrash,
  FaProcedures,
  FaMoneyBillWave,
} from "react-icons/fa";

const moneda = (valor) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(Number(valor) || 0);

const ProcedimientosConsulta = ({
  procedimientos = [],
  seleccionados = [],
  onAgregar,
  onCambiarCantidad,
  onEliminar,
  cargando = false,
}) => {
  const total = useMemo(
    () =>
      seleccionados.reduce(
        (suma, item) =>
          suma + Number(item.precio_unitario) * Number(item.cantidad),
        0
      ),
    [seleccionados]
  );

  const disponibles = procedimientos.filter(
    (procedimiento) =>
      !seleccionados.some(
        (item) =>
          item.id_procedimiento_especialista ===
          procedimiento.id_procedimiento_especialista
      )
  );

  return (
    <section className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <FaProcedures className="text-primary" />
          <div>
            <h5 className="mb-1">Procedimientos realizados</h5>
            <small className="text-muted">
              Selecciona los procedimientos efectuados durante la atención.
            </small>
          </div>
        </div>

        <div className="row g-2 align-items-end mb-4">
          <div className="col-12 col-md">
            <label
              className="form-label"
              htmlFor="procedimiento-catalogo"
            >
              Procedimiento del catálogo
            </label>

            <select
              id="procedimiento-catalogo"
              className="form-select"
              value=""
              disabled={cargando || disponibles.length === 0}
              onChange={(e) => {
                const id = e.target.value;
                const seleccionado = disponibles.find(
                  (item) =>
                    String(item.id_procedimiento_especialista) === id
                );

                if (seleccionado) onAgregar(seleccionado);
              }}
            >
              <option value="">
                {cargando
                  ? "Cargando procedimientos..."
                  : disponibles.length
                    ? "Seleccionar procedimiento"
                    : "No hay procedimientos disponibles"}
              </option>

              {disponibles.map((item) => (
                <option
                  key={item.id_procedimiento_especialista}
                  value={item.id_procedimiento_especialista}
                >
                  {item.nombre} — {moneda(item.precio)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-auto">
            <button
              type="button"
              className="btn btn-outline-primary w-100"
              disabled={cargando || disponibles.length === 0}
              onClick={() => {
                const primero = disponibles[0];
                if (primero) onAgregar(primero);
              }}
            >
              <FaPlus className="me-2" />
              Agregar primero
            </button>
          </div>
        </div>

        {seleccionados.length === 0 ? (
          <div className="text-center text-muted py-4 border rounded">
            No has agregado procedimientos a esta consulta.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Procedimiento</th>
                  <th style={{ minWidth: 100 }}>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>

              <tbody>
                {seleccionados.map((item) => (
                  <tr key={item.id_procedimiento_especialista}>
                    <td>
                      <div className="fw-semibold">{item.nombre}</div>
                      {item.descripcion && (
                        <small className="text-muted">
                          {item.descripcion}
                        </small>
                      )}
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        step="1"
                        value={item.cantidad}
                        aria-label={`Cantidad de ${item.nombre}`}
                        onChange={(e) =>
                          onCambiarCantidad(
                            item.id_procedimiento_especialista,
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>{moneda(item.precio_unitario)}</td>

                    <td className="fw-semibold">
                      {moneda(
                        Number(item.cantidad) *
                          Number(item.precio_unitario)
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        aria-label={`Eliminar ${item.nombre}`}
                        onClick={() =>
                          onEliminar(
                            item.id_procedimiento_especialista
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
          <span className="fw-semibold">
            <FaMoneyBillWave className="me-2" />
            Total de procedimientos
          </span>
          <span className="fs-5 fw-bold text-primary">
            {moneda(total)}
          </span>
        </div>

        <small className="text-muted d-block mt-2">
          Este importe es el valor de los procedimientos registrados,
          no una confirmación de pago.
        </small>
      </div>
    </section>
  );
};

export default ProcedimientosConsulta;
