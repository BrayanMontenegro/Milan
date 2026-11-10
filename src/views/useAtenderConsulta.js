import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../database/supabase";

const useAtenderConsulta = (id_cita, navigate) => {
  const [cita, setCita] = useState(null);
  const [signosVitales, setSignosVitales] = useState(null);
  const [expediente, setExpediente] = useState(null);
  const [antecedentes, setAntecedentes] = useState([]);
  const [mostrarExpediente, setMostrarExpediente] = useState(false);

  const [procedimientos, setProcedimientos] = useState([]);
  const [procedimientosSeleccionados, setProcedimientosSeleccionados] =
    useState([]);
  const [cargandoProcedimientos, setCargandoProcedimientos] =
    useState(false);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    motivo_consulta: "",
    sintomas: "",
    diagnostico: "",
    tratamiento: "",
    indicaciones: "",
    observaciones: "",
  });

  /*
  =========================================================
  CARGAR INFORMACIÓN DE LA CONSULTA
  =========================================================
  */

  const cargarProcedimientos = useCallback(async (idEspecialista) => {
    try {
      setCargandoProcedimientos(true);

      const { data, error } = await supabase
        .from("procedimientos_especialistas")
        .select(`
          id_procedimiento_especialista,
          nombre,
          descripcion,
          precio
        `)
        .eq("id_especialista", idEspecialista)
        .eq("activo", true)
        .order("nombre", { ascending: true });

      if (error) throw error;

      setProcedimientos(data || []);
    } catch (error) {
      console.error("Error cargando procedimientos:", error);
      toast.error("No se pudo cargar el catálogo de procedimientos.");
    } finally {
      setCargandoProcedimientos(false);
    }
  }, []);

  const agregarProcedimiento = (procedimiento) => {
    setProcedimientosSeleccionados((actuales) => {
      const existe = actuales.some(
        (item) =>
          item.id_procedimiento_especialista ===
          procedimiento.id_procedimiento_especialista
      );

      if (existe) return actuales;

      return [
        ...actuales,
        {
          id_procedimiento_especialista:
            procedimiento.id_procedimiento_especialista,
          nombre: procedimiento.nombre,
          descripcion: procedimiento.descripcion || null,
          cantidad: 1,
          precio_unitario: Number(procedimiento.precio),
        },
      ];
    });
  };

  const cambiarCantidadProcedimiento = (id, valor) => {
    if (valor === "") {
      setProcedimientosSeleccionados((actuales) =>
        actuales.map((item) =>
          item.id_procedimiento_especialista === id
            ? { ...item, cantidad: "" }
            : item
        )
      );
      return;
    }

    const cantidad = Number(valor);

    if (!Number.isInteger(cantidad) || cantidad < 1) return;

    setProcedimientosSeleccionados((actuales) =>
      actuales.map((item) =>
        item.id_procedimiento_especialista === id
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const eliminarProcedimiento = (id) => {
    setProcedimientosSeleccionados((actuales) =>
      actuales.filter(
        (item) =>
          item.id_procedimiento_especialista !== id
      )
    );
  };

  const cargarInformacion = useCallback(async () => {
    try {
      setCargando(true);

      /*
      -------------------------------------------------------
      1. CARGAR CITA
      -------------------------------------------------------
      */

      const {
        data: citaData,
        error: citaError,
      } = await supabase
        .from("citas")
        .select(`
          id_cita,
          id_paciente,
          id_especialista,
          fecha_cita,
          hora_inicio,
          hora_fin,
          motivo,
          tipo_consulta,
          estado,
          observaciones,

          pacientes (
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
            telefono_tutor
          ),

          especialistas (
            id_especialista,
            nombres,
            apellidos,
            codigo_profesional,
            telefono,
            correo,

            especialidades (
              id_especialidad,
              nombre,
              descripcion
            )
          )
        `)
        .eq("id_cita", id_cita)
        .single();

      if (citaError) {
        console.error(
          "Error cargando cita:",
          citaError
        );

        toast.error(
          "No se pudo cargar la cita."
        );

        navigate("/consultas");
        return;
      }

      /*
      -------------------------------------------------------
      VALIDAR ESTADO
      -------------------------------------------------------
      */

      if (citaData.estado !== "CONFIRMADA") {
        toast.warning(
          "Esta cita no está disponible para atención médica."
        );

        navigate("/consultas");
        return;
      }

      setCita(citaData);
      setProcedimientosSeleccionados([]);
      await cargarProcedimientos(citaData.id_especialista);

      /*
      -------------------------------------------------------
      2. CARGAR SIGNOS VITALES
      -------------------------------------------------------
      */

      const {
        data: signosData,
        error: signosError,
      } = await supabase
        .from("registros_enfermeria")
        .select(`
          id_registro_enfermeria,
          id_paciente,
          id_usuario,
          fecha_registro,
          peso,
          talla,
          temperatura,
          presion_arterial,
          frecuencia_cardiaca,
          frecuencia_respiratoria,
          saturacion_oxigeno,
          motivo_consulta,
          observaciones,

          usuarios (
            id_usuario,
            nombres,
            apellidos
          )
        `)
        .eq(
          "id_paciente",
          citaData.id_paciente
        )
        .order(
          "fecha_registro",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

      if (signosError) {
        console.error(
          "Error cargando signos vitales:",
          signosError
        );
      }

      setSignosVitales(signosData || null);

      /*
      -------------------------------------------------------
      3. CARGAR EXPEDIENTE
      -------------------------------------------------------
      */

      const {
        data: expedienteData,
        error: expedienteError,
      } = await supabase
        .from("expedientes")
        .select(`
          id_expediente,
          id_paciente,
          grupo_sanguineo,
          alergias,
          medicamentos_actuales,
          enfermedades_cronicas,
          antecedentes_importantes,
          observaciones
        `)
        .eq(
          "id_paciente",
          citaData.id_paciente
        )
        .maybeSingle();

      if (expedienteError) {
        console.error(
          "Error cargando expediente:",
          expedienteError
        );
      }

      setExpediente(expedienteData || null);

      /*
      -------------------------------------------------------
      4. CARGAR ANTECEDENTES
      -------------------------------------------------------
      */

      const {
        data: antecedentesData,
        error: antecedentesError,
      } = await supabase
        .from("antecedentes_paciente")
        .select(`
          id_antecedente,
          tipo_antecedente,
          descripcion,
          fecha_registro,
          observaciones
        `)
        .eq(
          "id_paciente",
          citaData.id_paciente
        )
        .order(
          "fecha_registro",
          {
            ascending: false,
          }
        );

      if (antecedentesError) {
        console.error(
          "Error cargando antecedentes:",
          antecedentesError
        );
      }

      setAntecedentes(
        antecedentesData || []
      );

      /*
      -------------------------------------------------------
      5. PRECARGAR MOTIVO
      -------------------------------------------------------
      */

      setFormulario({
        motivo_consulta:
          citaData.motivo || "",

        sintomas:
          signosData?.motivo_consulta || "",

        diagnostico: "",
        tratamiento: "",
        indicaciones: "",

        observaciones:
          signosData?.observaciones || "",
      });

    } catch (error) {
      console.error(
        "Error inesperado:",
        error
      );

      toast.error(
        "Ocurrió un error al cargar la atención."
      );
    } finally {
      setCargando(false);
    }
  }, [id_cita, navigate, cargarProcedimientos]);

  useEffect(() => {
    if (!id_cita) return;

    cargarInformacion();
  }, [id_cita, cargarInformacion]);

  /*
  =========================================================
  CAMBIAR FORMULARIO
  =========================================================
  */

  const cambiarCampo = (
    campo,
    valor
  ) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  /*
  =========================================================
  GUARDAR CONSULTA
  =========================================================
  */

  const guardarConsulta = async (e) => {
    e.preventDefault();

    if (!cita) return;

    if (
      !formulario.motivo_consulta.trim()
    ) {
      toast.warning(
        "El motivo de consulta es obligatorio."
      );
      return;
    }

    try {
      setGuardando(true);

      /*
      -------------------------------------------------------
      CREAR CONSULTA
      -------------------------------------------------------
      */

      const {
        data: consultaCreada,
        error: consultaError,
      } = await supabase
        .from("consultas")
        .insert({
          id_paciente:
            cita.id_paciente,

          id_especialista:
            cita.id_especialista,

          id_cita:
            cita.id_cita,

          motivo_consulta:
            formulario.motivo_consulta
              .trim(),

          sintomas:
            formulario.sintomas.trim() ||
            null,

          diagnostico:
            formulario.diagnostico.trim() ||
            null,

          tratamiento:
            formulario.tratamiento.trim() ||
            null,

          indicaciones:
            formulario.indicaciones.trim() ||
            null,

          observaciones:
            formulario.observaciones.trim() ||
            null,
        })
        .select("id_consulta")
        .single();

      if (consultaError) {
        console.error(
          "Error creando consulta:",
          consultaError
        );

        toast.error(
          "No se pudo guardar la consulta."
        );

        return;
      }

      if (procedimientosSeleccionados.length > 0) {
        const registros = procedimientosSeleccionados.map((item) => {
          const cantidad = Number(item.cantidad);

          if (!Number.isInteger(cantidad) || cantidad < 1) {
            throw new Error(
              `La cantidad de "${item.nombre}" no es válida.`
            );
          }

          return {
            id_consulta: consultaCreada.id_consulta,
            id_procedimiento_especialista:
              item.id_procedimiento_especialista,
            nombre: item.nombre,
            descripcion: item.descripcion,
            cantidad,
            precio_unitario: Number(item.precio_unitario),
          };
        });

        const { error: procedimientosError } = await supabase
          .from("procedimientos_consulta")
          .insert(registros);

        if (procedimientosError) throw procedimientosError;
      }

      /*
      -------------------------------------------------------
      ACTUALIZAR CITA
      -------------------------------------------------------
      */

      const {
        error: citaError,
      } = await supabase
        .from("citas")
        .update({
          estado: "ATENDIDA",
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id_cita",
          cita.id_cita
        );

      if (citaError) {
        console.error(
          "Error actualizando cita:",
          citaError
        );

        toast.warning(
          "La consulta fue guardada, pero no se pudo actualizar la cita."
        );

        return;
      }

      toast.success(
        "Consulta registrada correctamente."
      );

      navigate("/consultas");

    } catch (error) {
      console.error(
        "Error inesperado guardando:",
        error
      );

      toast.error(
        "Ocurrió un error al guardar la consulta."
      );
    } finally {
      setGuardando(false);
    }
  };

  /*
  =========================================================
  FORMATO DE FECHA
  =========================================================
  */

  const formatearFecha = (
    fecha
  ) => {
    if (!fecha) return "-";

    const [year, month, day] =
      fecha.split("-");

    return `${day}/${month}/${year}`;
  };

  /*
  =========================================================
  FORMATO HORA
  =========================================================
  */

  const formatearHora = (
    hora
  ) => {
    if (!hora) return "-";

    const [horas, minutos] =
      hora.split(":");

    const fecha = new Date();

    fecha.setHours(
      Number(horas),
      Number(minutos),
      0,
      0
    );

    return fecha.toLocaleTimeString(
      "es-NI",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  /*
  =========================================================
  CALCULAR EDAD
  =========================================================
  */

  const calcularEdad = (
    fechaNacimiento
  ) => {
    if (!fechaNacimiento) return "-";

    const nacimiento =
      new Date(
        fechaNacimiento +
          "T00:00:00"
      );

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
        hoy.getDate() <
          nacimiento.getDate()
      )
    ) {
      edad--;
    }

    return edad;
  };


  return {
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
  };
};

export default useAtenderConsulta;
