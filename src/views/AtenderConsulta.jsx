import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaStethoscope,
} from "react-icons/fa";
import { toast } from "react-toastify";

import useAtenderConsulta from "./useAtenderConsulta";
import ExpedienteDetalle from "../components/expedientes/ExpedienteDetalle";
import AtenderConsultaPatientSummary from "../components/consultas/AtenderConsultaPatientSummary";
import AtenderConsultaClinicalDetails from "../components/consultas/AtenderConsultaClinicalDetails";
import ProcedimientosConsulta from "../components/consultas/ProcedimientosConsulta";
import AtenderConsultaForm from "../components/consultas/AtenderConsultaForm";
import AtenderConsultaSidebar from "../components/consultas/AtenderConsultaSidebar";

import "../styles/AtenderConsulta.css";
import "../styles/Expedientes.css";

const AtenderConsulta = () => {
  const { id_cita } = useParams();
  const navigate = useNavigate();

  const {
    cita,
    signosVitales,
    expediente,
    antecedentes,
    mostrarExpediente,
    setMostrarExpediente,
    cargando,
    guardando,
    formulario,
    cambiarCampo,
    guardarConsulta,
    procedimientos,
    procedimientosSeleccionados,
    cargandoProcedimientos,
    agregarProcedimiento,
    cambiarCantidadProcedimiento,
    eliminarProcedimiento,
    formatearFecha,
    formatearHora,
    calcularEdad,
  } = useAtenderConsulta(id_cita, navigate);

  /*
  =========================================================
  CARGANDO
  =========================================================
  */

  if (cargando) {
    return (
      <div className="atender-consulta-loading">
        <div
          className="spinner-border"
          role="status"
        />

        <p>
          Cargando información del paciente...
        </p>
      </div>
    );
  }

  /*
  =========================================================
  SIN CITA
  =========================================================
  */

  if (!cita) {
    return null;
  }

  const paciente =
    cita.pacientes || {};

  const especialista =
    cita.especialistas || {};

  const nombrePaciente =
    `${paciente.nombres || ""} ${
      paciente.apellidos || ""
    }`.trim();

  const nombreEspecialista =
    `${especialista.nombres || ""} ${
      especialista.apellidos || ""
    }`.trim();

  const especialidad =
    especialista.especialidades?.nombre ||
    "Sin especialidad";

  const abrirExpediente = () => {
    if (!paciente.id_paciente) {
      toast.error("No se encontró la información del paciente.");
      return;
    }

    setMostrarExpediente(true);
  };

  const cerrarExpediente = () => {
    setMostrarExpediente(false);
  };

  const editarExpediente = () => {
    setMostrarExpediente(false);
    navigate("/expedientes");
  };

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div className="atender-consulta-page">
      <header className="atender-consulta-header">
        <button
          type="button"
          className="atender-volver"
          onClick={() => navigate("/consultas")}
        >
          <FaArrowLeft />
          Volver a consultas
        </button>
        <div className="atender-header-titulo">
          <div className="atender-header-icon">
            <FaStethoscope />
          </div>
          <div>
            <h1>{"Atenci\u00f3n m\u00e9dica"}</h1>
            <p>{"Registro de consulta cl\u00ednica"}</p>
          </div>
        </div>
        <div className="atender-header-estado">CONFIRMADA</div>
      </header>

      <main className="atender-consulta-contenido">
        <AtenderConsultaPatientSummary
          paciente={paciente}
          nombrePaciente={nombrePaciente}
          calcularEdad={calcularEdad}
          onVerExpediente={abrirExpediente}
        />
        <div className="atender-layout">
          <div className="atender-columna-principal">
            <AtenderConsultaClinicalDetails
              signosVitales={signosVitales}
              cita={cita}
              nombreEspecialista={nombreEspecialista}
              especialidad={especialidad}
              formatearFecha={formatearFecha}
              formatearHora={formatearHora}
            />
            <ProcedimientosConsulta
              procedimientos={procedimientos}
              seleccionados={procedimientosSeleccionados}
              cargando={cargandoProcedimientos}
              onAgregar={agregarProcedimiento}
              onCambiarCantidad={cambiarCantidadProcedimiento}
              onEliminar={eliminarProcedimiento}
            />
            <AtenderConsultaForm
              formulario={formulario}
              cambiarCampo={cambiarCampo}
              onSubmit={guardarConsulta}
              onCancelar={() => navigate("/consultas")}
              guardando={guardando}
            />
          </div>
          <AtenderConsultaSidebar
            paciente={paciente}
            expediente={expediente}
            antecedentes={antecedentes}
            formatearFecha={formatearFecha}
          />
        </div>
      </main>

      {mostrarExpediente && (
        <ExpedienteDetalle
          paciente={{ ...paciente, expediente }}
          onCerrar={cerrarExpediente}
          onEditar={editarExpediente}
        />
      )}
    </div>
  );
};

export default AtenderConsulta;