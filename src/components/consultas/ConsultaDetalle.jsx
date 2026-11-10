import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaFileMedical,
  FaStethoscope,
  FaNotesMedical,
  FaClipboardCheck,
  FaProcedures,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "../../database/supabase";
import useNativeDialog from "../../hooks/useNativeDialog";

const formatearFecha = (fecha) => {
  if (!fecha) return "No disponible";
  const valor = fecha.includes("T") ? fecha : `${fecha}T12:00:00`;
  return new Date(valor).toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatearHora = (hora) => {
  if (!hora) return "No disponible";
  const [horas, minutos] = hora.split(":");
  const fecha = new Date();
  fecha.setHours(Number(horas), Number(minutos), 0, 0);
  return fecha.toLocaleTimeString("es-NI", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const mostrarDato = (valor) =>
  valor?.trim?.() || valor || "No registrado";

const Dato = ({ etiqueta, valor, icono }) => (
  <div className="consulta-detalle-dato">
    <span>
      {icono}
      {etiqueta}
    </span>
    <strong>{valor || "No registrado"}</strong>
  </div>
);

const Campo = ({ etiqueta, valor, destacado = false }) => (
  <div
    className={`consulta-detalle-campo ${
      destacado ? "consulta-detalle-campo-destacado" : ""
    }`}
  >
    <h4>{etiqueta}</h4>
    <p>{valor?.trim?.() || valor || "No registrado"}</p>
  </div>
);

const ConsultaDetalleRegistro = ({
  consulta,
  formatearFecha,
  mostrarDato,
}) => (
  <>
    <section className="consulta-detalle-seccion">
      <h3>
        <FaNotesMedical />
        Registro clínico
      </h3>
      <div className="consulta-detalle-campos">
        <Campo
          etiqueta="Fecha de consulta"
          valor={formatearFecha(consulta.fecha_consulta)}
        />
        <Campo etiqueta="Motivo de consulta" valor={consulta.motivo_consulta} />
        <Campo etiqueta="Síntomas" valor={consulta.sintomas} />
        <Campo etiqueta="Diagnóstico" valor={consulta.diagnostico} destacado />
        <Campo etiqueta="Tratamiento" valor={consulta.tratamiento} />
        <Campo
          etiqueta="Indicaciones médicas"
          valor={consulta.indicaciones}
        />
        <Campo etiqueta="Observaciones" valor={consulta.observaciones} />
      </div>
    </section>
    <section className="consulta-detalle-seccion">
      <h3>
        <FaProcedures />
        Procedimientos realizados
      </h3>
      {consulta.procedimientos_consulta?.length > 0 ? (
        <div className="consulta-detalle-procedimientos">
          {consulta.procedimientos_consulta.map((procedimiento) => (
            <article
              className="consulta-detalle-procedimiento"
              key={procedimiento.id_procedimiento}
            >
              <h4>{procedimiento.nombre}</h4>
              <p>{mostrarDato(procedimiento.descripcion)}</p>
              {procedimiento.observaciones && (
                <small>Observaciones: {procedimiento.observaciones}</small>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="consulta-detalle-vacio">
          No hay procedimientos registrados para esta consulta.
        </p>
      )}
    </section>
  </>
);

const ConsultaDetalleContenido = ({
  cargando,
  cita,
  consulta,
  paciente,
  especialista,
  nombrePaciente,
  nombreEspecialista,
}) => (
  <div className="consulta-detalle-body">
    {cargando ? (
      <div className="consulta-detalle-cargando">
        <FaSpinner className="consulta-detalle-spinner" />
        <p>Cargando información médica...</p>
      </div>
    ) : (
      <>
        <section className="consulta-detalle-resumen">
          <div className="consulta-detalle-resumen-icono">
            <FaUser />
          </div>
          <div className="consulta-detalle-resumen-info">
            <span>Paciente</span>
            <h3>{nombrePaciente || "Paciente no disponible"}</h3>
            <p>
              Expediente: {paciente.codigo_expediente || "Sin expediente"}
            </p>
          </div>
          <span className="consulta-detalle-badge">
            <FaClipboardCheck />
            {cita?.estado || "ATENDIDA"}
          </span>
        </section>

        <section className="consulta-detalle-seccion">
          <h3>
            <FaCalendarAlt />
            Información de la cita
          </h3>
          <div className="consulta-detalle-grid">
            <Dato etiqueta="Fecha" valor={formatearFecha(cita?.fecha_cita)} />
            <Dato
              etiqueta="Hora de inicio"
              valor={formatearHora(cita?.hora_inicio)}
            />
            <Dato
              etiqueta="Hora de finalización"
              valor={formatearHora(cita?.hora_fin)}
            />
            <Dato
              etiqueta="Tipo de consulta"
              valor={
                cita?.tipo_consulta === "PRIMERA_VEZ"
                  ? "Primera vez"
                  : cita?.tipo_consulta === "SEGUIMIENTO"
                  ? "Seguimiento"
                  : mostrarDato(cita?.tipo_consulta)
              }
            />
            <Dato
              etiqueta="Especialista"
              valor={nombreEspecialista}
              icono={<FaUserMd />}
            />
            <Dato
              etiqueta="Especialidad"
              valor={especialista.especialidades?.nombre}
              icono={<FaStethoscope />}
            />
          </div>
        </section>

        {consulta ? (
          <ConsultaDetalleRegistro
            consulta={consulta}
            formatearFecha={formatearFecha}
            mostrarDato={mostrarDato}
          />
        ) : (
          <div className="consulta-detalle-sin-registro">
            <FaFileMedical />
            <h3>No se encontró el registro clínico</h3>
            <p>
              La cita está disponible, pero no se encontró una consulta médica
              asociada en la tabla de consultas.
            </p>
            <p>
              Verifica que la atención se haya guardado y que
              <code> consultas.id_cita </code>
              corresponda a esta cita.
            </p>
          </div>
        )}

        {cita?.observaciones && (
          <section className="consulta-detalle-seccion">
            <h3>Observaciones de la cita</h3>
            <p className="consulta-detalle-texto">{cita.observaciones}</p>
          </section>
        )}
      </>
    )}
  </div>
);

const ConsultaDetalle = ({ cita, onCerrar }) => {
  const dialogRef = useNativeDialog(true, onCerrar);
  const [consulta, setConsulta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;

    const cargarConsulta = async () => {
      if (!cita?.id_cita) {
        setCargando(false);
        return;
      }

      setCargando(true);
      const { data, error } = await supabase
        .from("consultas")
        .select(`
          id_consulta,
          id_cita,
          fecha_consulta,
          motivo_consulta,
          sintomas,
          diagnostico,
          tratamiento,
          indicaciones,
          observaciones,
          procedimientos_consulta (
            id_procedimiento,
            nombre,
            descripcion,
            observaciones
          )
        `)
        .eq("id_cita", cita.id_cita);

      console.log("ID de la cita:", cita.id_cita);
      console.log("Consultas encontradas:", data);
      console.log("Error:", error);
      if (!vigente) return;

      if (error) {
        console.error("Error cargando consulta médica:", error);
        toast.error("No se pudo cargar el detalle de la consulta.");
        setConsulta(null);
      } else {
        setConsulta(data);
      }
      setCargando(false);
    };

    cargarConsulta();
    return () => {
      vigente = false;
    };
  }, [cita?.id_cita]);

  const paciente = cita?.pacientes || {};
  const especialista = cita?.especialistas || {};
  const nombrePaciente =
    `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim();
  const nombreEspecialista =
    `${especialista.nombres || ""} ${especialista.apellidos || ""}`.trim();

  return (
    <dialog
      ref={dialogRef}
      className="consulta-detalle-overlay native-modal-root"
      aria-labelledby="consulta-detalle-titulo"
    >
      <button
        type="button"
        className="modal-backdrop-dismiss"
        aria-label="Cerrar detalle de consulta"
        onClick={() => dialogRef.current?.close()}
      />
      <section
        className="consulta-detalle-modal modal-backdrop-content"
      >
        <header className="consulta-detalle-header">
          <div className="consulta-detalle-header-icon">
            <FaFileMedical />
          </div>
          <div className="consulta-detalle-header-texto">
            <h2 id="consulta-detalle-titulo">Detalle de consulta</h2>
            <p>Información de la atención médica registrada</p>
          </div>
          <button
            type="button"
            className="consulta-detalle-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
          >
            <FaTimes />
          </button>
        </header>
        <ConsultaDetalleContenido
          cargando={cargando}
          cita={cita}
          consulta={consulta}
          paciente={paciente}
          especialista={especialista}
          nombrePaciente={nombrePaciente}
          nombreEspecialista={nombreEspecialista}
        />
        <footer className="consulta-detalle-footer">
          <button
            type="button"
            className="consulta-detalle-btn-cerrar"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </footer>
      </section>
    </dialog>
  );
};

export default ConsultaDetalle;
