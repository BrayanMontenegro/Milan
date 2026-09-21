import { useEffect, useMemo, useState } from "react";
import { FaUserInjured } from "react-icons/fa";
import { toast } from "react-toastify";

import { supabase } from "../database/supabase";
import departamentosData from "../database/Departamentos.json";

import PacienteHeader from "../components/pacientes/PacienteHeader";
import PacienteFiltros from "../components/pacientes/PacienteFilters";
import PacienteTabla from "../components/pacientes/PacienteTable";
import PacienteCard from "../components/pacientes/PacienteCard";
import PacienteModal from "../components/pacientes/PacienteModal";
import PacienteDetalle from "../components/pacientes/PacienteDetalle";

import "../styles/pacientes.css";

const formularioInicial = {
  nombres: "",
  apellidos: "",
  fecha_nacimiento: "",
  sexo: "",
  telefono: "",
  correo: "",
  direccion: "",
  procedencia: "",
  ocupacion: "",
  estado_civil: "",

  // Nombres correctos según la tabla pacientes
  nombre_tutor: "",
  parentesco_tutor: "",
  telefono_tutor: "",

  observaciones: ""
};

const calcularEdad = (fechaNacimiento) => {

  if (!fechaNacimiento) {
    return null;
  }

  const nacimiento = new Date(
    `${fechaNacimiento}T00:00:00`
  );

  if (Number.isNaN(nacimiento.getTime())) {
    return null;
  }

  const hoy = new Date();

  let edad =
    hoy.getFullYear() -
    nacimiento.getFullYear();

  const mes =
    hoy.getMonth() -
    nacimiento.getMonth();

  if (
    mes < 0 ||
    (
      mes === 0 &&
      hoy.getDate() < nacimiento.getDate()
    )
  ) {
    edad--;
  }

  return edad;
};

const procedenciasNicaragua = [
  ...new Set(
    (departamentosData.departamentos || []).flatMap(
      (departamento) => [
        departamento.nombre,
        ...(departamento.municipios || [])
      ]
    )
  )
].sort((a, b) => a.localeCompare(b));

const Pacientes = () => {

  const [
    pacienteSeleccionado,
    setPacienteSeleccionado
  ] = useState(null);

  const [
    mostrarPaciente,
    setMostrarPaciente
  ] = useState(false);

  const [
    pacientes,
    setPacientes
  ] = useState([]);

  const [
    cargando,
    setCargando
  ] = useState(true);

  const [
    guardando,
    setGuardando
  ] = useState(false);

  const verPaciente = (paciente) => {

    setPacienteSeleccionado(
      paciente
    );

    setMostrarPaciente(true);
  };


  const cerrarPaciente = () => {

    setMostrarPaciente(false);

    setPacienteSeleccionado(null);
  };

  const [
    mostrarModal,
    setMostrarModal
  ] = useState(false);

  const [
    modoEdicion,
    setModoEdicion
  ] = useState(false);

  const [
    formulario,
    setFormulario
  ] = useState({
    ...formularioInicial
  });

  const [
    busqueda,
    setBusqueda
  ] = useState("");

  const [
    procedencia,
    setProcedencia
  ] = useState("");

  const [
    estado,
    setEstado
  ] = useState("");

  const [
    procedencias,
    setProcedencias
  ] = useState([]);

  const cargarPacientes = async () => {

    try {

      setCargando(true);

      const {
        data,
        error
      } = await supabase
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
          observaciones,
          activo,
          created_at,
          updated_at
        `)
        .order(
          "created_at",
          {
            ascending: false
          }
        );

      if (error) {

        console.error(
          "Error cargando pacientes:",
          error
        );

        throw error;
      }

      console.log(
        "Pacientes recibidos:",
        data
      );

      setPacientes(
        data || []
      );

    } catch (error) {

      console.error(
        "Error:",
        error
      );

      toast.error(
        "No se pudieron cargar los pacientes."
      );

    } finally {

      setCargando(false);

    }
  };

  const cargarProcedencias = async () => {

    try {

      const {
        data,
        error
      } = await supabase
        .from("pacientes")
        .select("procedencia")
        .not(
          "procedencia",
          "is",
          null
        );

      if (error) {
        throw error;
      }

      const procedenciasExistentes = [
        ...new Set(
          (data || [])
            .map(
              (item) =>
                item.procedencia?.trim()
            )
            .filter(Boolean)
        )
      ];

      const valoresUnicos = [
        ...new Set(
          [
            ...procedenciasNicaragua,
            ...procedenciasExistentes
          ]
        )
      ].sort(
        (a, b) =>
          a.localeCompare(b)
      );

      setProcedencias(
        valoresUnicos
      );

    } catch (error) {

      console.error(
        "Error cargando procedencias:",
        error
      );

    }
  };

  useEffect(() => {
    cargarPacientes();
    cargarProcedencias();
  }, []);

  const generarCodigoExpediente = async () => {

    const anioActual =
      new Date().getFullYear();

    try {

      const {
        data,
        error
      } = await supabase
        .from("pacientes")
        .select(
          "codigo_expediente"
        )
        .like(
          "codigo_expediente",
          `PAC-${anioActual}-%`
        )
        .order(
          "codigo_expediente",
          {
            ascending: false
          }
        )
        .limit(1);

      if (error) {
        throw error;
      }

      let consecutivo = 1;

      if (
        data &&
        data.length > 0 &&
        data[0].codigo_expediente
      ) {

        const partes =
          data[0]
            .codigo_expediente
            .split("-");

        const ultimoNumero =
          parseInt(
            partes[2],
            10
          );

        if (
          !Number.isNaN(
            ultimoNumero
          )
        ) {

          consecutivo =
            ultimoNumero + 1;
        }
      }

      return (
        `PAC-${anioActual}-` +
        `${String(consecutivo).padStart(3, "0")}`
      );

    } catch (error) {

      console.error(
        "Error generando expediente:",
        error
      );

      return (
        `PAC-${anioActual}-` +
        `${Date.now().toString().slice(-6)}`
      );
    }
  };

  const limpiarFormulario = () => {

    setFormulario({
      ...formularioInicial
    });

    setPacienteSeleccionado(
      null
    );

    setModoEdicion(false);
  };

  const nuevoPaciente = () => {

    limpiarFormulario();

    setMostrarModal(true);
  };

  const editarPaciente = (paciente) => {

    if (!paciente) {
      return;
    }

    setPacienteSeleccionado(
      paciente
    );

    setModoEdicion(true);

    setFormulario({

      nombres:
        paciente.nombres || "",

      apellidos:
        paciente.apellidos || "",

      fecha_nacimiento:
        paciente.fecha_nacimiento || "",

      sexo:
        paciente.sexo || "",

      telefono:
        paciente.telefono || "",

      correo:
        paciente.correo || "",

      direccion:
        paciente.direccion || "",

      procedencia:
        paciente.procedencia || "",

      ocupacion:
        paciente.ocupacion || "",

      estado_civil:
        paciente.estado_civil || "",

      // Nombres correctos de la BD
      nombre_tutor:
        paciente.nombre_tutor || "",

      parentesco_tutor:
        paciente.parentesco_tutor || "",

      telefono_tutor:
        paciente.telefono_tutor || "",

      observaciones:
        paciente.observaciones || ""

    });

    setMostrarModal(true);
  };

  const validarFormulario = () => {

    const {
      nombres,
      apellidos,
      fecha_nacimiento,
      sexo,
      procedencia,
      nombre_tutor,
      parentesco_tutor,
      telefono_tutor
    } = formulario;

    if (!nombres.trim()) {

      toast.warning(
        "Ingrese los nombres del paciente."
      );

      return false;
    }


    if (!apellidos.trim()) {

      toast.warning(
        "Ingrese los apellidos del paciente."
      );

      return false;
    }


    if (!fecha_nacimiento) {

      toast.warning(
        "Seleccione la fecha de nacimiento."
      );

      return false;
    }


    if (!sexo) {

      toast.warning(
        "Seleccione el sexo del paciente."
      );

      return false;
    }


    if (!procedencia) {

      toast.warning(
        "Seleccione la procedencia."
      );

      return false;
    }

    const fechaNacimiento =
      new Date(
        `${fecha_nacimiento}T00:00:00`
      );

    const hoy =
      new Date();

    if (
      Number.isNaN(
        fechaNacimiento.getTime()
      )
    ) {

      toast.warning(
        "La fecha de nacimiento no es válida."
      );

      return false;
    }


    if (
      fechaNacimiento > hoy
    ) {

      toast.warning(
        "La fecha de nacimiento no puede ser futura."
      );

      return false;
    }

    const edad =
      calcularEdad(
        fecha_nacimiento
      );

    const esMenor =
      edad !== null &&
      edad < 18;

    if (esMenor) {

      if (!nombre_tutor.trim()) {

        toast.warning(
          "Ingrese el nombre completo del tutor."
        );

        return false;
      }


      if (!parentesco_tutor) {

        toast.warning(
          "Seleccione el parentesco del tutor."
        );

        return false;
      }


      if (!telefono_tutor.trim()) {

        toast.warning(
          "Ingrese el teléfono del tutor."
        );

        return false;
      }
    }


    return true;
  };

  const prepararDatosPaciente = (
    codigo = null
  ) => {

    const edad =
      calcularEdad(
        formulario.fecha_nacimiento
      );

    const esMenor =
      edad !== null &&
      edad < 18;


    return {

      ...(codigo && {
        codigo_expediente:
          codigo
      }),

      nombres:
        formulario.nombres.trim(),

      apellidos:
        formulario.apellidos.trim(),

      fecha_nacimiento:
        formulario.fecha_nacimiento,

      sexo:
        formulario.sexo,

      telefono:
        formulario.telefono.trim() ||
        null,

      correo:
        formulario.correo.trim() ||
        null,

      direccion:
        formulario.direccion.trim() ||
        null,

      procedencia:
        formulario.procedencia.trim(),

      ocupacion:
        formulario.ocupacion.trim() ||
        null,

      estado_civil:
        formulario.estado_civil ||
        null,

      es_menor_edad:
        esMenor,

      nombre_tutor:
        esMenor
          ? formulario.nombre_tutor.trim()
          : null,

      parentesco_tutor:
        esMenor
          ? formulario.parentesco_tutor
          : null,

      telefono_tutor:
        esMenor
          ? formulario.telefono_tutor.trim()
          : null,

      observaciones:
        formulario.observaciones.trim() ||
        null,

      activo: true
    };
  };

  const registrarPaciente = async () => {

    if (!validarFormulario()) {
      return;
    }

    try {

      setGuardando(true);


      const codigo =
        await generarCodigoExpediente();


      const datosPaciente =
        prepararDatosPaciente(
          codigo
        );


      console.log(
        "Registrando paciente:",
        datosPaciente
      );


      const {
        data,
        error
      } = await supabase
        .from("pacientes")
        .insert(
          datosPaciente
        )
        .select()
        .single();


      if (error) {

        console.error(
          "Error registrando paciente:",
          error
        );

        throw error;
      }


      setPacientes(
        (actuales) => [
          data,
          ...actuales
        ]
      );


      await cargarProcedencias();


      setMostrarModal(false);

      limpiarFormulario();


      toast.success(
        `Paciente registrado correctamente. Expediente ${codigo}`
      );

    } catch (error) {

      console.error(
        "Error registrando paciente:",
        error
      );

      toast.error(
        error?.message ||
        "No se pudo registrar el paciente."
      );

    } finally {

      setGuardando(false);

    }
  };

  const actualizarPaciente = async () => {

    if (!validarFormulario()) {
      return;
    }

    if (!pacienteSeleccionado) {

      toast.error(
        "No se ha seleccionado un paciente."
      );

      return;
    }


    try {

      setGuardando(true);


      const datosActualizados =
        prepararDatosPaciente();


      datosActualizados.updated_at =
        new Date().toISOString();


      console.log(
        "Actualizando paciente:",
        datosActualizados
      );


      const {
        data,
        error
      } = await supabase
        .from("pacientes")
        .update(
          datosActualizados
        )
        .eq(
          "id_paciente",
          pacienteSeleccionado.id_paciente
        )
        .select()
        .single();


      if (error) {

        console.error(
          "Error actualizando paciente:",
          error
        );

        throw error;
      }


      setPacientes(
        (actuales) =>
          actuales.map(
            (paciente) =>
              paciente.id_paciente ===
              data.id_paciente
                ? data
                : paciente
          )
      );


      await cargarProcedencias();


      setMostrarModal(false);

      limpiarFormulario();


      toast.success(
        "Paciente actualizado correctamente."
      );

    } catch (error) {

      console.error(
        "Error actualizando paciente:",
        error
      );

      toast.error(
        error?.message ||
        "No se pudo actualizar el paciente."
      );

    } finally {

      setGuardando(false);

    }
  };

  const guardarPaciente = async (e) => {

    e.preventDefault();

    if (modoEdicion) {

      await actualizarPaciente();

    } else {

      await registrarPaciente();

    }
  };

  const cambiarEstado = async (paciente) => {

    if (!paciente) {
      return;
    }


    const nuevoEstado =
      !paciente.activo;

    const accion =
      nuevoEstado
        ? "activar"
        : "desactivar";


    const confirmar =
      window.confirm(
        `¿Está seguro que desea ${accion} al paciente ${paciente.nombres} ${paciente.apellidos}?`
      );


    if (!confirmar) {
      return;
    }


    try {

      const {
        data,
        error
      } = await supabase
        .from("pacientes")
        .update({

          activo:
            nuevoEstado,

          updated_at:
            new Date().toISOString()

        })
        .eq(
          "id_paciente",
          paciente.id_paciente
        )
        .select()
        .single();


      if (error) {
        throw error;
      }


      setPacientes(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id_paciente ===
              data.id_paciente
                ? data
                : item
          )
      );


      toast.success(
        nuevoEstado
          ? "Paciente activado correctamente."
          : "Paciente desactivado correctamente."
      );

    } catch (error) {

      console.error(
        "Error cambiando estado:",
        error
      );

      toast.error(
        error?.message ||
        "No se pudo actualizar el estado del paciente."
      );
    }
  };

  const pacientesFiltrados =
    useMemo(() => {

      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return pacientes.filter(
        (paciente) => {

          const nombreCompleto =
            `${paciente.nombres || ""} ${paciente.apellidos || ""}`
              .toLowerCase();


          const codigo =
            (
              paciente.codigo_expediente ||
              ""
            ).toLowerCase();


          const telefono =
            (
              paciente.telefono ||
              ""
            ).toLowerCase();


          const coincideBusqueda =
            !texto ||
            nombreCompleto.includes(
              texto
            ) ||
            codigo.includes(
              texto
            ) ||
            telefono.includes(
              texto
            );


          const coincideProcedencia =
            !procedencia ||
            paciente.procedencia ===
            procedencia;


          const coincideEstado =
            !estado ||
            (
              estado === "activo" &&
              paciente.activo
            ) ||
            (
              estado === "inactivo" &&
              !paciente.activo
            );


          return (
            coincideBusqueda &&
            coincideProcedencia &&
            coincideEstado
          );
        }
      );

    }, [
      pacientes,
      busqueda,
      procedencia,
      estado
    ]);

  const limpiarFiltros = () => {

    setBusqueda("");

    setProcedencia("");

    setEstado("");
  };

  const totalPacientes =
    pacientes.length;


  const pacientesActivos =
    pacientes.filter(
      (paciente) =>
        paciente.activo
    ).length;


  const pacientesInactivos =
    pacientes.filter(
      (paciente) =>
        !paciente.activo
    ).length;


  const menores =
    pacientes.filter(
      (paciente) =>
        paciente.es_menor_edad ??
        (
          calcularEdad(
            paciente.fecha_nacimiento
          ) < 18
        )
    ).length;

  return (
    <div className="pacientes-page container-fluid px-3 px-md-4 py-3">

      <PacienteHeader
        onNuevoPaciente={
          nuevoPaciente
        }
      />

      <div className="row g-3 mb-4">

        <div className="col-6 col-lg-3">

          <div className="paciente-stat-card">

            <div className="paciente-stat-icon purple">
              <FaUserInjured />
            </div>

            <div>

              <small>
                Total pacientes
              </small>

              <h3>
                {totalPacientes}
              </h3>

            </div>

          </div>

        </div>


        <div className="col-6 col-lg-3">

          <div className="paciente-stat-card">

            <div className="paciente-stat-icon turquoise">
              <span>✓</span>
            </div>

            <div>

              <small>
                Pacientes activos
              </small>

              <h3>
                {pacientesActivos}
              </h3>

            </div>

          </div>

        </div>


        <div className="col-6 col-lg-3">

          <div className="paciente-stat-card">

            <div className="paciente-stat-icon yellow">
              <span>18</span>
            </div>

            <div>

              <small>
                Menores de edad
              </small>

              <h3>
                {menores}
              </h3>

            </div>

          </div>

        </div>


        <div className="col-6 col-lg-3">

          <div className="paciente-stat-card">

            <div className="paciente-stat-icon fuchsia">
              <span>!</span>
            </div>

            <div>

              <small>
                Inactivos
              </small>

              <h3>
                {pacientesInactivos}
              </h3>

            </div>

          </div>

        </div>

      </div>

      <div className="pacientes-main-card">
        <PacienteFiltros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          procedencia={procedencia}
          setProcedencia={setProcedencia}
          estado={estado}
          setEstado={setEstado}
          procedencias={procedencias}
          onLimpiar={limpiarFiltros}
        />
        <div className="px-3 px-md-4 py-3">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1 pacientes-section-title">
                Registro de pacientes
              </h5>

              <small className="text-muted">

                {cargando
                  ? "Cargando pacientes..."
                  : `${pacientesFiltrados.length} paciente${pacientesFiltrados.length !== 1 ? "s" : ""} encontrado${pacientesFiltrados.length !== 1 ? "s" : ""}`
                }

              </small>

            </div>

          </div>

        </div>

        {cargando ? (

          <div className="pacientes-loading">

            <div
              className="spinner-border"
              role="status"
            />

            <p>
              Cargando pacientes...
            </p>

          </div>

        ) : (

          <>

            <PacienteTabla
              pacientes={pacientesFiltrados}
              onVer={verPaciente}
              onEditar={editarPaciente}
              onCambiarEstado={cambiarEstado}
            />


            <PacienteDetalle
              paciente={pacienteSeleccionado}
              mostrar={mostrarPaciente}
              onCerrar={cerrarPaciente}
            />

            <div className="pacientes-mobile-list">

              {pacientesFiltrados.length === 0 ? (

                <div className="pacientes-mobile-empty">

                  <FaUserInjured />

                  <h5>
                    No se encontraron pacientes
                  </h5>

                  <p>
                    Intente cambiar los filtros
                    de búsqueda.
                  </p>

                </div>

              ) : (

                pacientesFiltrados.map(
                  (paciente) => (

                    <PacienteCard
                      key={
                        paciente.id_paciente
                      }

                      paciente={
                        paciente
                      }

                      onVer={
                        verPaciente
                      }

                      onEditar={
                        editarPaciente
                      }

                      onCambiarEstado={
                        cambiarEstado
                      }
                    />

                  )
                )

              )}

            </div>

          </>

        )}

      </div>

      <PacienteModal
        mostrar={
          mostrarModal
        }

        onCerrar={() => {

          if (!guardando) {

            setMostrarModal(
              false
            );

            limpiarFormulario();

          }

        }}

        formulario={
          formulario
        }

        setFormulario={
          setFormulario
        }

        onSubmit={
          guardarPaciente
        }

        guardando={
          guardando
        }

        modoEdicion={
          modoEdicion
        }

        procedencias={
          procedencias
        }

      />

    </div>
  );
};


export default Pacientes;