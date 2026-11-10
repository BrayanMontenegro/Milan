
import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaFileMedical,
  FaHeartbeat,
  FaHistory,
  FaTimes,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import { supabase } from "../../database/supabase";

const fecha = (valor) => {
  if (!valor) return "Sin fecha";

  const resultado = new Date(valor);
  if (Number.isNaN(resultado.getTime())) return "Sin fecha";

  return resultado.toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const fechaHora = (valor) => {
  if (!valor) return "Sin fecha";

  const resultado = new Date(valor);
  if (Number.isNaN(resultado.getTime())) return "Sin fecha";

  return resultado.toLocaleString("es-NI", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function SeccionVacia({ texto }) {
  return <p className="expedientes-detail-empty">{texto}</p>;
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="expedientes-detail-field">
      <span>{etiqueta}</span>
      <p>{valor || "No registrado"}</p>
    </div>
  );
}

function ExpedienteDetalleInformacionMedica({ expediente }) {
  return (
    <section className="expedientes-detail-section">
      <h3>
        <FaFileMedical /> Información médica general
      </h3>
      {expediente ? (
        <div className="expedientes-detail-grid">
          <Dato etiqueta="Grupo sanguíneo" valor={expediente.grupo_sanguineo} />
          <Dato etiqueta="Alergias" valor={expediente.alergias} />
          <Dato
            etiqueta="Medicamentos actuales"
            valor={expediente.medicamentos_actuales}
          />
          <Dato
            etiqueta="Enfermedades crónicas"
            valor={expediente.enfermedades_cronicas}
          />
          <Dato
            etiqueta="Antecedentes importantes"
            valor={expediente.antecedentes_importantes}
          />
          <Dato etiqueta="Observaciones" valor={expediente.observaciones} />
          <Dato
            etiqueta="Fecha de creación de ficha"
            valor={fecha(expediente.created_at)}
          />
          <Dato
            etiqueta="Última actualización"
            valor={fecha(expediente.updated_at)}
          />
        </div>
      ) : (
        <div className="expedientes-no-record">
          <FaFileMedical />
          <div>
            <strong>Este paciente todavía no tiene ficha médica.</strong>
            <p>
              Puedes crearla desde el botón superior. El historial disponible
              se consulta por separado.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function ExpedienteDetalleHistorial({
  historial,
  cargando,
  errorHistorial,
}) {
  return (
    <>
      <section className="expedientes-detail-section">
        <h3>
          <FaHistory /> Antecedentes registrados
        </h3>
        {cargando ? (
          <SeccionVacia texto="Cargando antecedentes..." />
        ) : historial.antecedentes.length === 0 ? (
          <SeccionVacia texto="No hay antecedentes individuales registrados." />
        ) : (
          <div className="expedientes-history-list">
            {historial.antecedentes.map((item) => (
              <article
                className="expedientes-history-item"
                key={item.id_antecedente}
              >
                <div className="expedientes-history-top">
                  <strong>{item.tipo_antecedente || "Antecedente"}</strong>
                  <span>{fecha(item.fecha_registro)}</span>
                </div>
                <p>{item.descripcion || "Sin descripción"}</p>
                {item.observaciones && <small>{item.observaciones}</small>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="expedientes-detail-section">
        <h3>
          <FaUserMd /> Consultas médicas
        </h3>
        {cargando ? (
          <SeccionVacia texto="Cargando consultas..." />
        ) : historial.consultas.length === 0 ? (
          <SeccionVacia texto="No hay consultas médicas registradas." />
        ) : (
          <div className="expedientes-history-list">
            {historial.consultas.map((consulta) => (
              <article
                className="expedientes-history-item"
                key={consulta.id_consulta}
              >
                <div className="expedientes-history-top">
                  <strong>{consulta.motivo_consulta || "Consulta médica"}</strong>
                  <span>{fechaHora(consulta.fecha_consulta)}</span>
                </div>
                <Dato etiqueta="Síntomas" valor={consulta.sintomas} />
                <Dato etiqueta="Diagnóstico" valor={consulta.diagnostico} />
                <Dato etiqueta="Tratamiento" valor={consulta.tratamiento} />
                <Dato etiqueta="Indicaciones" valor={consulta.indicaciones} />
                <Dato etiqueta="Observaciones" valor={consulta.observaciones} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="expedientes-detail-section">
        <h3>
          <FaHeartbeat /> Registros de enfermería
        </h3>
        {cargando ? (
          <SeccionVacia texto="Cargando registros de enfermería..." />
        ) : historial.enfermeria.length === 0 ? (
          <SeccionVacia texto="No hay registros de enfermería disponibles." />
        ) : (
          <div className="expedientes-history-list">
            {historial.enfermeria.map((registro) => (
              <article
                className="expedientes-history-item"
                key={registro.id_registro_enfermeria}
              >
                <div className="expedientes-history-top">
                  <strong>
                    {registro.motivo_consulta || "Registro de enfermería"}
                  </strong>
                  <span>{fechaHora(registro.fecha_registro)}</span>
                </div>
                <div className="expedientes-vitals-grid">
                  <Dato
                    etiqueta="Peso"
                    valor={registro.peso != null ? `${registro.peso} kg` : null}
                  />
                  <Dato
                    etiqueta="Talla"
                    valor={registro.talla != null ? `${registro.talla} cm` : null}
                  />
                  <Dato
                    etiqueta="Temperatura"
                    valor={
                      registro.temperatura != null
                        ? `${registro.temperatura} °C`
                        : null
                    }
                  />
                  <Dato
                    etiqueta="Presión arterial"
                    valor={registro.presion_arterial}
                  />
                  <Dato
                    etiqueta="Frecuencia cardíaca"
                    valor={
                      registro.frecuencia_cardiaca != null
                        ? `${registro.frecuencia_cardiaca} lpm`
                        : null
                    }
                  />
                  <Dato
                    etiqueta="Frecuencia respiratoria"
                    valor={
                      registro.frecuencia_respiratoria != null
                        ? `${registro.frecuencia_respiratoria} rpm`
                        : null
                    }
                  />
                  <Dato
                    etiqueta="Saturación de oxígeno"
                    valor={
                      registro.saturacion_oxigeno != null
                        ? `${registro.saturacion_oxigeno}%`
                        : null
                    }
                  />
                  <Dato etiqueta="Observaciones" valor={registro.observaciones} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {errorHistorial && (
        <div className="alert alert-warning" role="alert">
          {errorHistorial}
        </div>
      )}
    </>
  );
}

export default function ExpedienteDetalle({
  paciente,
  recarga = 0,
  onCerrar,
  onEditar,
}) {
  const [historial, setHistorial] = useState({
    antecedentes: [],
    consultas: [],
    enfermeria: [],
  });
  const [cargando, setCargando] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState("");

  const expediente = paciente.expediente;
  const nombre = `${paciente.nombres || ""} ${
    paciente.apellidos || ""
  }`.trim();

  useEffect(() => {
    const manejarEscape = (event) => {
      if (event.key === "Escape") onCerrar();
    };

    window.addEventListener("keydown", manejarEscape);
    return () => window.removeEventListener("keydown", manejarEscape);
  }, [onCerrar]);

  useEffect(() => {
    let vigente = true;

    const cargarHistorial = async () => {
      setCargando(true);
      setErrorHistorial("");

      try {
        const [antecedentesResp, consultasResp, enfermeriaResp] =
          await Promise.all([
            supabase
              .from("antecedentes_paciente")
              .select(`
                id_antecedente,
                tipo_antecedente,
                descripcion,
                fecha_registro,
                observaciones
              `)
              .eq("id_paciente", paciente.id_paciente)
              .order("fecha_registro", { ascending: false }),

            supabase
              .from("consultas")
              .select(`
                id_consulta,
                id_especialista,
                fecha_consulta,
                motivo_consulta,
                sintomas,
                diagnostico,
                tratamiento,
                indicaciones,
                observaciones
              `)
              .eq("id_paciente", paciente.id_paciente)
              .order("fecha_consulta", { ascending: false }),

            supabase
              .from("registros_enfermeria")
              .select(`
                id_registro_enfermeria,
                fecha_registro,
                peso,
                talla,
                temperatura,
                presion_arterial,
                frecuencia_cardiaca,
                frecuencia_respiratoria,
                saturacion_oxigeno,
                motivo_consulta,
                observaciones
              `)
              .eq("id_paciente", paciente.id_paciente)
              .order("fecha_registro", { ascending: false }),
          ]);

        if (antecedentesResp.error) throw antecedentesResp.error;
        if (consultasResp.error) throw consultasResp.error;
        if (enfermeriaResp.error) throw enfermeriaResp.error;

        if (!vigente) return;

        setHistorial({
          antecedentes: antecedentesResp.data || [],
          consultas: consultasResp.data || [],
          enfermeria: enfermeriaResp.data || [],
        });
      } catch (error) {
        console.error("Error cargando historial médico:", error);
        if (vigente) {
          setErrorHistorial(
            "No fue posible cargar todo el historial. Comprueba los permisos de lectura y vuelve a intentarlo."
          );
        }
      } finally {
        if (vigente) setCargando(false);
      }
    };

    cargarHistorial();

    return () => {
      vigente = false;
    };
  }, [paciente.id_paciente, recarga]);

  return (
    <div
      className="expedientes-detail-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCerrar();
      }}
    >
      <section
        className="expedientes-detail-modal modal-backdrop-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expediente-detail-title"
      >
        <header className="expedientes-detail-header">
          <div className="expedientes-detail-header-icon">
            <FaFileMedical />
          </div>

          <div className="expedientes-detail-heading">
            <h2 id="expediente-detail-title">Expediente del paciente</h2>
            <p>{nombre || "Paciente sin nombre"}</p>
          </div>

          <button
            type="button"
            className="expedientes-modal-close"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
          >
            <FaTimes />
          </button>
        </header>

        <div className="expedientes-detail-body">
          <section className="expedientes-detail-patient">
            <div className="expedientes-detail-avatar">
              <FaUser />
            </div>

            <div className="expedientes-detail-patient-main">
              <h3>{nombre || "Paciente sin nombre"}</h3>
              <span className="expedientes-code">
                {paciente.codigo_expediente || "Sin código de paciente"}
              </span>
              <div className="expedientes-detail-badges">
                <span
                  className={`expedientes-status ${
                    expediente ? "con-expediente" : "sin-expediente"
                  }`}
                >
                  {expediente ? "Ficha médica registrada" : "Sin ficha médica"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary expedientes-detail-edit"
              onClick={onEditar}
            >
              {expediente ? "Editar ficha" : "Crear ficha"}
            </button>
          </section>

          <section className="expedientes-detail-section">
            <h3>
              <FaUser /> Datos del paciente
            </h3>

            <div className="expedientes-detail-grid">
              <Dato etiqueta="Fecha de nacimiento" valor={fecha(paciente.fecha_nacimiento)} />
              <Dato etiqueta="Sexo" valor={paciente.sexo} />
              <Dato etiqueta="Teléfono" valor={paciente.telefono} />
              <Dato etiqueta="Correo" valor={paciente.correo} />
              <Dato etiqueta="Procedencia" valor={paciente.procedencia} />
              <Dato etiqueta="Dirección" valor={paciente.direccion} />
              <Dato etiqueta="Ocupación" valor={paciente.ocupacion} />
              <Dato etiqueta="Estado civil" valor={paciente.estado_civil} />
              {paciente.es_menor_edad && (
                <>
                  <Dato etiqueta="Tutor" valor={paciente.nombre_tutor} />
                  <Dato etiqueta="Parentesco del tutor" valor={paciente.parentesco_tutor} />
                  <Dato etiqueta="Teléfono del tutor" valor={paciente.telefono_tutor} />
                </>
              )}
            </div>
          </section>

          <ExpedienteDetalleInformacionMedica expediente={expediente} />
          <ExpedienteDetalleHistorial
            historial={historial}
            cargando={cargando}
            errorHistorial={errorHistorial}
          />
        </div>

        <footer className="expedientes-detail-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </footer>
      </section>
    </div>
  );
}
