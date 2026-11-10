
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaFileMedical,
  FaPlus,
  FaSyncAlt,
  FaUserInjured,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { supabase } from "../database/supabase";
import ExpedienteFiltros from "../components/expedientes/ExpedienteFiltros";
import ExpedienteTabla from "../components/expedientes/ExpedienteTabla";
import ExpedienteCard from "../components/expedientes/ExpedienteCard";
import ExpedienteModal from "../components/expedientes/ExpedienteModal";
import ExpedienteDetalle from "../components/expedientes/ExpedienteDetalle";
import "../styles/expedientes.css";

const formularioInicial = {
  grupo_sanguineo: "",
  alergias: "",
  medicamentos_actuales: "",
  enfermedades_cronicas: "",
  antecedentes_importantes: "",
  observaciones: "",
};


const useExpedientesController = () => {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteFormulario, setPacienteFormulario] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const [pacienteDetalle, setPacienteDetalle] = useState(null);
  const [recargaDetalle, setRecargaDetalle] = useState(0);

  const cargarDatos = useCallback(async () => {
    setCargando(true);

    try {
      const [pacientesResp, expedientesResp] = await Promise.all([
        supabase
          .from("pacientes")
          .select(`
            id_paciente,
            codigo_expediente,
            nombres,
            apellidos,
            fecha_nacimiento,
            sexo,
            telefono,
            correo,
            direccion,
            procedencia,
            ocupacion,
            estado_civil,
            es_menor_edad,
            nombre_tutor,
            parentesco_tutor,
            telefono_tutor,
            activo
          `)
          .eq("activo", true)
          .order("apellidos", { ascending: true }),

        supabase
          .from("expedientes")
          .select(`
            id_expediente,
            id_paciente,
            grupo_sanguineo,
            alergias,
            medicamentos_actuales,
            enfermedades_cronicas,
            antecedentes_importantes,
            observaciones,
            created_at,
            updated_at
          `),
      ]);

      if (pacientesResp.error) throw pacientesResp.error;
      if (expedientesResp.error) throw expedientesResp.error;

      const expedientesPorPaciente = new Map(
        (expedientesResp.data || []).map((expediente) => [
          expediente.id_paciente,
          expediente,
        ])
      );

      const lista = (pacientesResp.data || []).map((paciente) => ({
        ...paciente,
        expediente: expedientesPorPaciente.get(paciente.id_paciente) || null,
      }));

      setPacientes(lista);
    } catch (error) {
      console.error("Error cargando expedientes:", error);
      toast.error("No se pudieron cargar los expedientes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const pacientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return pacientes.filter((paciente) => {
      const nombreCompleto =
        `${paciente.nombres || ""} ${paciente.apellidos || ""}`.toLowerCase();

      const coincideBusqueda =
        !termino ||
        nombreCompleto.includes(termino) ||
        (paciente.codigo_expediente || "").toLowerCase().includes(termino) ||
        (paciente.telefono || "").toLowerCase().includes(termino) ||
        (paciente.procedencia || "").toLowerCase().includes(termino);

      const coincideEstado =
        estadoFiltro === "todos" ||
        (estadoFiltro === "con" && Boolean(paciente.expediente)) ||
        (estadoFiltro === "sin" && !paciente.expediente);

      return coincideBusqueda && coincideEstado;
    });
  }, [pacientes, busqueda, estadoFiltro]);

  const estadisticas = useMemo(() => {
    const registrados = pacientes.filter((p) => p.expediente).length;

    return {
      pacientes: pacientes.length,
      registrados,
      pendientes: pacientes.length - registrados,
    };
  }, [pacientes]);

  const abrirCrear = (paciente) => {
    if (paciente.expediente) {
      toast.info("Este paciente ya tiene una ficha médica.");
      return;
    }

    setPacienteFormulario(paciente);
    setFormulario(formularioInicial);
    setModalAbierto(true);
  };

  const abrirEditar = (paciente) => {
    if (!paciente.expediente) {
      abrirCrear(paciente);
      return;
    }

    setPacienteFormulario(paciente);
    setFormulario({
      grupo_sanguineo: paciente.expediente.grupo_sanguineo || "",
      alergias: paciente.expediente.alergias || "",
      medicamentos_actuales:
        paciente.expediente.medicamentos_actuales || "",
      enfermedades_cronicas:
        paciente.expediente.enfermedades_cronicas || "",
      antecedentes_importantes:
        paciente.expediente.antecedentes_importantes || "",
      observaciones: paciente.expediente.observaciones || "",
    });
    setModalAbierto(true);
  };

  const guardarExpediente = async (event) => {
    event.preventDefault();

    if (!pacienteFormulario?.id_paciente) {
      toast.error("No se ha seleccionado un paciente.");
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        id_paciente: pacienteFormulario.id_paciente,
        grupo_sanguineo: formulario.grupo_sanguineo || null,
        alergias: formulario.alergias.trim() || null,
        medicamentos_actuales:
          formulario.medicamentos_actuales.trim() || null,
        enfermedades_cronicas:
          formulario.enfermedades_cronicas.trim() || null,
        antecedentes_importantes:
          formulario.antecedentes_importantes.trim() || null,
        observaciones: formulario.observaciones.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const expedienteExistente = pacienteFormulario.expediente;

      let respuesta;

      if (expedienteExistente) {
        respuesta = await supabase
          .from("expedientes")
          .update(datos)
          .eq("id_expediente", expedienteExistente.id_expediente);
      } else {
        respuesta = await supabase.from("expedientes").insert([datos]);
      }

      if (respuesta.error) throw respuesta.error;

      toast.success(
        expedienteExistente
          ? "Ficha médica actualizada correctamente."
          : "Ficha médica creada correctamente."
      );

      setModalAbierto(false);
      setPacienteFormulario(null);
      setFormulario(formularioInicial);

      await cargarDatos();

      if (pacienteDetalle?.id_paciente === pacienteFormulario.id_paciente) {
        setRecargaDetalle((actual) => actual + 1);
      }
    } catch (error) {
      console.error("Error guardando expediente:", error);

      if (error.code === "23505") {
        toast.warning("Este paciente ya tiene una ficha médica registrada.");
        await cargarDatos();
      } else {
        toast.error(error.message || "No se pudo guardar la ficha médica.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const abrirDetalle = (paciente) => {
    setPacienteDetalle(paciente);
  };

  return {
    estadisticas,
    pacientesFiltrados,
    cargando,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    abrirDetalle,
    abrirCrear,
    abrirEditar,
    cargarDatos,
    modalAbierto,
    pacienteFormulario,
    formulario,
    setFormulario,
    guardando,
    guardarExpediente,
    pacienteDetalle,
    setPacienteDetalle,
    recargaDetalle,
    setModalAbierto,
    setPacienteFormulario,
  };
};
export default function Expedientes() {
  const {
    estadisticas,
    pacientesFiltrados,
    cargando,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    abrirDetalle,
    abrirCrear,
    abrirEditar,
    cargarDatos,
    modalAbierto,
    pacienteFormulario,
    formulario,
    setFormulario,
    guardando,
    guardarExpediente,
    pacienteDetalle,
    setPacienteDetalle,
    recargaDetalle,
    setModalAbierto,
    setPacienteFormulario,
  } = useExpedientesController();

  return (
    <main className="expedientes-page container-fluid">
      <header className="expedientes-header">
        <div className="expedientes-header-icon">
          <FaFileMedical />
        </div>

        <div className="expedientes-header-text">
          <h1>Expedientes médicos</h1>
          <p>
            Administra las fichas médicas y consulta el historial de cada
            paciente.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-light expedientes-refresh"
          onClick={cargarDatos}
          disabled={cargando}
          title="Actualizar lista"
        >
          <FaSyncAlt className={cargando ? "expedientes-spin" : ""} />
          <span>Actualizar</span>
        </button>
      </header>

      <section className="expedientes-stats">
        <article className="expedientes-stat">
          <span className="expedientes-stat-icon total">
            <FaUserInjured />
          </span>
          <div>
            <span className="expedientes-stat-label">Pacientes activos</span>
            <strong>{estadisticas.pacientes}</strong>
          </div>
        </article>

        <article className="expedientes-stat">
          <span className="expedientes-stat-icon registrados">
            <FaFileMedical />
          </span>
          <div>
            <span className="expedientes-stat-label">Con ficha médica</span>
            <strong>{estadisticas.registrados}</strong>
          </div>
        </article>

        <article className="expedientes-stat">
          <span className="expedientes-stat-icon pendientes">
            <FaPlus />
          </span>
          <div>
            <span className="expedientes-stat-label">Pendientes de crear</span>
            <strong>{estadisticas.pendientes}</strong>
          </div>
        </article>
      </section>

      <ExpedienteFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        total={pacientesFiltrados.length}
      />

      {cargando ? (
        <div className="expedientes-loading">
          <div className="spinner-border" role="status" />
          <p>Cargando pacientes y fichas médicas...</p>
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="expedientes-empty">
          <FaFileMedical />
          <h3>No se encontraron pacientes</h3>
          <p>Prueba cambiando el texto de búsqueda o el filtro.</p>
        </div>
      ) : (
        <>
          <div className="expedientes-desktop">
            <ExpedienteTabla
              pacientes={pacientesFiltrados}
              onVer={abrirDetalle}
              onCrear={abrirCrear}
              onEditar={abrirEditar}
            />
          </div>

          <div className="expedientes-mobile">
            {pacientesFiltrados.map((paciente) => (
              <ExpedienteCard
                key={paciente.id_paciente}
                paciente={paciente}
                onVer={abrirDetalle}
                onCrear={abrirCrear}
                onEditar={abrirEditar}
              />
            ))}
          </div>
        </>
      )}

      {modalAbierto && pacienteFormulario && (
        <ExpedienteModal
          paciente={pacienteFormulario}
          formulario={formulario}
          setFormulario={setFormulario}
          guardando={guardando}
          onSubmit={guardarExpediente}
          onCerrar={() => {
            if (!guardando) {
              setModalAbierto(false);
              setPacienteFormulario(null);
            }
          }}
          modoEdicion={Boolean(pacienteFormulario.expediente)}
        />
      )}

      {pacienteDetalle && (
        <ExpedienteDetalle
          paciente={pacienteDetalle}
          recarga={recargaDetalle}
          onCerrar={() => setPacienteDetalle(null)}
          onEditar={() => {
            setPacienteDetalle(null);
            abrirEditar(pacienteDetalle);
          }}
        />
      )}
    </main>
  );
}
