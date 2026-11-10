import React from "react";
import {
  FaEye,
  FaUser,
  FaUserMd,
  FaWeight,
  FaThermometerHalf,
  FaTint,
  FaLungs,
  FaHeartbeat,
} from "react-icons/fa";
import TablaEncabezado from "../../TablaEncabezado";

const COLUMNAS_REGISTROS_ENFERMERIA = [
  { etiqueta: "Paciente" },
  { etiqueta: "Fecha y hora" },
  { etiqueta: "Enfermería" },
  { etiqueta: "Signos vitales" },
  { etiqueta: "Motivo" },
  { etiqueta: "Acciones", className: "text-center" },
];

const RegistroEnfermeriaTabla = ({
  registros,
  onVer,
}) => {

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-NI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "--:--";

    return new Date(fecha).toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const obtenerNombrePaciente = (registro) => {
    const paciente = registro.pacientes || {};

    return `${paciente.nombres || ""} ${
      paciente.apellidos || ""
    }`.trim() || "Paciente no disponible";
  };

  const obtenerNombreUsuario = (registro) => {
    const usuario = registro.usuarios || {};

    return `${usuario.nombres || ""} ${
      usuario.apellidos || ""
    }`.trim() || "Usuario no disponible";
  };

  return (
    <div className="registro-enfermeria-tabla-wrapper">

      <div className="table-responsive">

        <table className="table registro-enfermeria-tabla">

          <TablaEncabezado columnas={COLUMNAS_REGISTROS_ENFERMERIA} />

          <tbody>

            {registros.map((registro) => {

              const paciente = registro.pacientes || {};

              return (
                <tr key={registro.id_registro_enfermeria}>

                  {/* PACIENTE */}
                  <td>
                    <div className="registro-paciente-celda">

                      <div className="registro-paciente-icon">
                        <FaUser />
                      </div>

                      <div>
                        <strong>
                          {obtenerNombrePaciente(registro)}
                        </strong>

                        <small>
                          {paciente.codigo_expediente ||
                            "Sin expediente"}
                        </small>
                      </div>

                    </div>
                  </td>

                  {/* FECHA */}
                  <td>
                    <div className="registro-fecha-celda">

                      <strong>
                        {formatearFecha(
                          registro.fecha_registro
                        )}
                      </strong>

                      <small>
                        {formatearHora(
                          registro.fecha_registro
                        )}
                      </small>

                    </div>
                  </td>

                  {/* USUARIO */}
                  <td>
                    <div className="registro-usuario-celda">

                      <div className="registro-usuario-icon">
                        <FaUserMd />
                      </div>

                      <span>
                        {obtenerNombreUsuario(registro)}
                      </span>

                    </div>
                  </td>

                  {/* SIGNOS */}
                  <td>
                    <div className="registro-signos-resumen">

                      {registro.peso !== null &&
                        registro.peso !== undefined && (
                          <span title="Peso">
                            <FaWeight />
                            {registro.peso} kg
                          </span>
                        )}

                      {registro.temperatura !== null &&
                        registro.temperatura !== undefined && (
                          <span title="Temperatura">
                            <FaThermometerHalf />
                            {registro.temperatura} °C
                          </span>
                        )}

                      {registro.presion_arterial && (
                        <span title="Presión arterial">
                          <FaTint />
                          {registro.presion_arterial}
                        </span>
                      )}

                      {registro.frecuencia_cardiaca !== null &&
                        registro.frecuencia_cardiaca !== undefined && (
                          <span title="Frecuencia cardíaca">
                            <FaHeartbeat />
                            {registro.frecuencia_cardiaca} ppm
                          </span>
                        )}

                      {registro.saturacion_oxigeno !== null &&
                        registro.saturacion_oxigeno !== undefined && (
                          <span title="Saturación">
                            <FaLungs />
                            {registro.saturacion_oxigeno}%
                          </span>
                        )}

                    </div>
                  </td>

                  {/* MOTIVO */}
                  <td>
                    <div className="registro-motivo-celda">
                      {registro.motivo_consulta ||
                        "Sin motivo registrado"}
                    </div>
                  </td>

                  {/* ACCIONES */}
                  <td className="text-center">

                    <button
                      type="button"
                      className="registro-btn-ver"
                      onClick={() => onVer?.(registro)}
                      title="Ver registro"
                    >
                      <FaEye />
                      <span>Ver</span>
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RegistroEnfermeriaTabla;