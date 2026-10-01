import React from "react";
import {
  FaNotesMedical,
  FaClipboardList,
  FaCommentMedical,
} from "react-icons/fa";

const CitaForm = ({
  datos,
  setDatos,
}) => {

  const actualizar = (campo, valor) => {
    setDatos((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  return (
    <div className="cita-form">

      <div className="row g-3">

        {/* Tipo de consulta */}

        <div className="col-12 col-md-6">

          <label
            htmlFor="tipoConsulta"
            className="form-label"
          >
            <FaClipboardList />
            Tipo de consulta
          </label>

          <select
            id="tipoConsulta"
            className="form-select"
            value={datos.tipo_consulta}
            onChange={(e) =>
              actualizar(
                "tipo_consulta",
                e.target.value
              )
            }
          >
            <option value="PRIMERA_VEZ">
              Primera vez
            </option>

            <option value="SEGUIMIENTO">
              Seguimiento
            </option>
          </select>

        </div>

        {/* Motivo */}

        <div className="col-12">

          <label
            htmlFor="motivo"
            className="form-label"
          >
            <FaNotesMedical />
            Motivo de consulta
          </label>

          <textarea
            id="motivo"
            className="form-control"
            rows="3"
            placeholder="Describa brevemente el motivo de la consulta..."
            value={datos.motivo}
            onChange={(e) =>
              actualizar(
                "motivo",
                e.target.value
              )
            }
          />

        </div>

        {/* Observaciones */}

        <div className="col-12">

          <label
            htmlFor="observaciones"
            className="form-label"
          >
            <FaCommentMedical />
            Observaciones
          </label>

          <textarea
            id="observaciones"
            className="form-control"
            rows="3"
            placeholder="Agregue observaciones adicionales..."
            value={datos.observaciones}
            onChange={(e) =>
              actualizar(
                "observaciones",
                e.target.value
              )
            }
          />

        </div>

      </div>

    </div>
  );
};

export default CitaForm;