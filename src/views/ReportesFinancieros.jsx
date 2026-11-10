import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiDollarSign,
  FiDownload,
  FiPrinter,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { supabase } from "../database/supabase";
import "../styles/ReportesFinancieros.css";

const PORCENTAJE_CLINICA = 0.3;
const PORCENTAJE_ESPECIALISTA = 0.7;
const TAMANO_PAGINA = 1000;
const COLORES = ["#164777", "#9063a6", "#00a89c", "#e0a800", "#c6006f", "#687386"];

const fechaLocal = (fecha) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const inicioMes = () => {
  const ahora = new Date();
  return fechaLocal(new Date(ahora.getFullYear(), ahora.getMonth(), 1));
};

const hoy = () => fechaLocal(new Date());

const inicioDiaIso = (fecha) => new Date(`${fecha}T00:00:00`).toISOString();

const inicioDiaSiguienteIso = (fecha) => {
  const siguiente = new Date(`${fecha}T00:00:00`);
  siguiente.setDate(siguiente.getDate() + 1);
  return siguiente.toISOString();
};

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0);

const formatoFecha = (valor) => {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "—";
  return new Intl.DateTimeFormat("es-NI", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fecha);
};

const nombreCompleto = (persona) =>
  [persona?.nombres, persona?.apellidos].filter(Boolean).join(" ") ||
  "No disponible";

const valorProcedimiento = (procedimiento) =>
  Number(
    procedimiento.subtotal ??
      Number(procedimiento.precio_unitario || 0) *
        Number(procedimiento.cantidad || 0)
  );

const cargarTodasLasFilas = async (crearConsulta) => {
  const filas = [];
  let desde = 0;

  while (true) {
    const { data, error } = await crearConsulta().range(
      desde,
      desde + TAMANO_PAGINA - 1
    );
    if (error) throw error;

    filas.push(...(data || []));
    if (!data || data.length < TAMANO_PAGINA) return filas;
    desde += TAMANO_PAGINA;
  }
};

const agruparTendencia = (pagos, desde, hasta) => {
  const fechaInicio = new Date(`${desde}T00:00:00`);
  const fechaFin = new Date(`${hasta}T00:00:00`);
  const diasPeriodo = Math.floor(
    (fechaFin.getTime() - fechaInicio.getTime()) / 86400000
  ) + 1;
  const agruparPorMes = diasPeriodo > 31;
  const grupos = new Map();

  pagos.forEach((pago) => {
    const fecha = new Date(pago.fecha_pago);
    if (Number.isNaN(fecha.getTime())) return;
    const clave = agruparPorMes
      ? `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`
      : fechaLocal(fecha);
    grupos.set(clave, (grupos.get(clave) || 0) + Number(pago.monto || 0));
  });

  const puntos = [];
  if (agruparPorMes) {
    const cursor = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
    const fin = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
    while (cursor <= fin) {
      const clave = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      puntos.push({
        clave,
        etiqueta: new Intl.DateTimeFormat("es-NI", { month: "short" })
          .format(cursor)
          .replace(".", ""),
        total: grupos.get(clave) || 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    const cursor = new Date(fechaInicio);
    while (cursor <= fechaFin) {
      const clave = fechaLocal(cursor);
      puntos.push({
        clave,
        etiqueta: String(cursor.getDate()),
        total: grupos.get(clave) || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return puntos;
};

const GraficoTendencia = ({ puntos, agrupadoPorMes }) => {
  const ancho = 640;
  const alto = 230;
  const margenX = 34;
  const margenY = 20;
  const valores = puntos.map((punto) => punto.total);
  const maximo = Math.max(...valores, 1);
  const coordenadas = puntos.map((punto, index) => {
    const x =
      margenX +
      (index * (ancho - margenX * 2)) / Math.max(puntos.length - 1, 1);
    const y =
      alto -
      margenY -
      (punto.total / maximo) * (alto - margenY * 2 - 22);
    return { ...punto, x, y };
  });
  const etiquetas = coordenadas.filter(
    (_, index) =>
      index === 0 ||
      index === coordenadas.length - 1 ||
      index % Math.ceil(coordenadas.length / 6) === 0
  );

  if (puntos.length === 0) {
    return <p className="reporte-chart-empty">No hay cobros en este período.</p>;
  }

  return (
    <div className="reporte-line-chart">
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        role="img"
        aria-label={`Tendencia de ingresos cobrados ${agrupadoPorMes ? "por mes" : "por día"}`}
      >
        {[0, 1, 2, 3].map((linea) => {
          const y = margenY + (linea * (alto - margenY * 2 - 22)) / 3;
          return (
            <line
              key={linea}
              x1={margenX}
              x2={ancho - margenX}
              y1={y}
              y2={y}
              className="reporte-chart-grid"
            />
          );
        })}
        <polyline
          points={coordenadas.map(({ x, y }) => `${x},${y}`).join(" ")}
          className="reporte-line"
        />
        {coordenadas.map((punto) => (
          <circle
            key={punto.clave}
            cx={punto.x}
            cy={punto.y}
            r="3.5"
            className="reporte-line-point"
          >
            <title>
              {punto.clave}: {formatoMoneda(punto.total)}
            </title>
          </circle>
        ))}
        {etiquetas.map((punto) => (
          <text
            key={punto.clave}
            x={punto.x}
            y={alto - 3}
            textAnchor="middle"
            className="reporte-chart-label"
          >
            {punto.etiqueta}
          </text>
        ))}
      </svg>
    </div>
  );
};

const GraficoEspecialidades = ({ datos }) => {
  const total = datos.reduce((suma, item) => suma + item.total, 0);
  const circunferencia = 2 * Math.PI * 54;
  const segmentos = datos.map((item, index) => {
    const longitud = (item.total / total) * circunferencia;
    const dashOffset = -datos
      .slice(0, index)
      .reduce(
        (suma, anterior) => suma + (anterior.total / total) * circunferencia,
        0
      );
    return { item, longitud, dashOffset, index };
  });

  if (total <= 0) {
    return <p className="reporte-chart-empty">Sin procedimientos facturados.</p>;
  }

  return (
    <div className="reporte-donut-layout">
      <svg
        viewBox="0 0 140 140"
        role="img"
        aria-label="Distribución de procedimientos facturados por especialidad"
      >
        <circle cx="70" cy="70" r="54" className="reporte-donut-track" />
        {segmentos.map(({ item, longitud, dashOffset, index }) => {
          return (
            <circle
              key={item.nombre}
              cx="70"
              cy="70"
              r="54"
              className="reporte-donut-segment"
              stroke={COLORES[index % COLORES.length]}
              strokeDasharray={`${longitud} ${circunferencia - longitud}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 70 70)"
            >
              <title>
                {item.nombre}: {formatoMoneda(item.total)}
              </title>
            </circle>
          );
        })}
        <text x="70" y="67" textAnchor="middle" className="reporte-donut-value">
          {datos.length}
        </text>
        <text x="70" y="84" textAnchor="middle" className="reporte-donut-label">
          especialidades
        </text>
      </svg>
      <ul className="reporte-legend">
        {datos.map((item, index) => (
          <li key={item.nombre}>
            <span
              className="reporte-legend-dot"
              style={{ backgroundColor: COLORES[index % COLORES.length] }}
              aria-hidden="true"
            />
            <span className="reporte-legend-name">{item.nombre}</span>
            <strong>{formatoMoneda(item.total)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ReportesFinancieros = () => {
  const [desde, setDesde] = useState(inicioMes);
  const [hasta, setHasta] = useState(hoy);
  const [periodo, setPeriodo] = useState(() => ({
    desde: inicioMes(),
    hasta: hoy(),
  }));
  const [pagos, setPagos] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [cajeros, setCajeros] = useState({});
  const [cajeroFiltro, setCajeroFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorVista, setErrorVista] = useState("");
  const [versionReporte, setVersionReporte] = useState(0);

  const obtenerDatosReporte = useCallback(async () => {
    const [todasLasConsultas, pagosPeriodo] = await Promise.all([
      cargarTodasLasFilas(() =>
        supabase
          .from("consultas")
          .select(`
            id_consulta,
            fecha_consulta,
            pacientes (
              nombres,
              apellidos
            ),
            especialistas (
              id_especialista,
              nombres,
              apellidos,
              especialidades (
                nombre
              )
            ),
            procedimientos_consulta (
              id_procedimiento,
              nombre,
              cantidad,
              precio_unitario,
              subtotal
            ),
            pagos_caja (
              monto
            )
          `)
          .order("fecha_consulta", { ascending: false })
      ),
      cargarTodasLasFilas(() =>
        supabase
          .from("pagos_caja")
          .select(`
            id_pago,
            codigo_comprobante,
            id_consulta,
            id_paciente,
            id_cajero,
            monto,
            metodo_pago,
            fecha_pago,
            pacientes (
              nombres,
              apellidos
            )
          `)
          .gte("fecha_pago", inicioDiaIso(periodo.desde))
          .lt("fecha_pago", inicioDiaSiguienteIso(periodo.hasta))
          .order("fecha_pago", { ascending: false })
      ),
    ]);
    const idsCajeros = [
      ...new Set(pagosPeriodo.map((pago) => pago.id_cajero).filter(Boolean)),
    ];
    let nombresCajeros = {};

    if (idsCajeros.length > 0) {
      const { data: perfiles, error } = await supabase
        .from("usuarios")
        .select("id_usuario, nombres, apellidos")
        .in("id_usuario", idsCajeros);
      if (error) throw error;
      nombresCajeros = Object.fromEntries(
        (perfiles || []).map((perfil) => [
          perfil.id_usuario,
          nombreCompleto(perfil),
        ])
      );
    }

    return {
      consultas: todasLasConsultas || [],
      pagos: pagosPeriodo || [],
      cajeros: nombresCajeros,
    };
  }, [periodo]);

  useEffect(() => {
    let vigente = true;
    obtenerDatosReporte()
      .then((resultado) => {
        if (!vigente) return;
        setConsultas(resultado.consultas);
        setPagos(resultado.pagos);
        setCajeros(resultado.cajeros);
        setCajeroFiltro("");
      })
      .catch((error) => {
        if (!vigente) return;
        console.error("Error cargando reportes financieros:", error);
        setConsultas([]);
        setPagos([]);
        setCajeros({});
        setErrorVista(
          `No se pudieron cargar los reportes financieros: ${error.message}`
        );
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [obtenerDatosReporte, versionReporte]);

  const consultasPeriodo = useMemo(
    () =>
      consultas.filter(
        (consulta) => {
          const fecha = String(consulta.fecha_consulta || "").slice(0, 10);
          return fecha >= periodo.desde && fecha <= periodo.hasta;
        }
      ),
    [consultas, periodo]
  );

  const pagosFiltrados = useMemo(
    () =>
      cajeroFiltro
        ? pagos.filter((pago) => pago.id_cajero === cajeroFiltro)
        : pagos,
    [cajeroFiltro, pagos]
  );

  const totalCobrado = useMemo(
    () => pagos.reduce((total, pago) => total + Number(pago.monto || 0), 0),
    [pagos]
  );

  const saldoPendiente = useMemo(
    () =>
      consultas.reduce((total, consulta) => {
        const facturado = (consulta.procedimientos_consulta || []).reduce(
          (suma, procedimiento) => suma + valorProcedimiento(procedimiento),
          0
        );
        const pagado = (consulta.pagos_caja || []).reduce(
          (suma, pago) => suma + Number(pago.monto || 0),
          0
        );
        return total + Math.max(0, facturado - pagado);
      }, 0),
    [consultas]
  );

  const liquidacionEspecialistas = useMemo(() => {
    const resultado = new Map();

    consultasPeriodo.forEach((consulta) => {
      const especialista = consulta.especialistas;
      const id = especialista?.id_especialista || "sin-especialista";
      const nombre = nombreCompleto(especialista);
      const actual = resultado.get(id) || {
        id,
        nombre,
        especialidad: especialista?.especialidades?.nombre || "Sin especialidad",
        consultas: new Set(),
        bruto: 0,
      };
      actual.consultas.add(consulta.id_consulta);
      actual.bruto += (consulta.procedimientos_consulta || []).reduce(
        (suma, procedimiento) => suma + valorProcedimiento(procedimiento),
        0
      );
      resultado.set(id, actual);
    });

    return [...resultado.values()]
      .map((item) => ({
        ...item,
        cantidadConsultas: item.consultas.size,
        honorarios: item.bruto * PORCENTAJE_ESPECIALISTA,
        retencion: item.bruto * PORCENTAJE_CLINICA,
      }))
      .sort((a, b) => b.bruto - a.bruto);
  }, [consultasPeriodo]);

  const totalFacturado = useMemo(
    () =>
      liquidacionEspecialistas.reduce((total, item) => total + item.bruto, 0),
    [liquidacionEspecialistas]
  );

  const ingresosPorMetodo = useMemo(() => {
    const totales = new Map();
    pagos.forEach((pago) => {
      const metodo = pago.metodo_pago || "OTRO";
      totales.set(metodo, (totales.get(metodo) || 0) + Number(pago.monto || 0));
    });
    return [...totales.entries()].sort((a, b) => b[1] - a[1]);
  }, [pagos]);

  const facturadoPorEspecialidad = useMemo(() => {
    const totales = new Map();
    consultasPeriodo.forEach((consulta) => {
      const nombre =
        consulta.especialistas?.especialidades?.nombre || "Sin especialidad";
      const importe = (consulta.procedimientos_consulta || []).reduce(
        (suma, procedimiento) => suma + valorProcedimiento(procedimiento),
        0
      );
      totales.set(nombre, (totales.get(nombre) || 0) + importe);
    });
    return [...totales.entries()]
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total);
  }, [consultasPeriodo]);

  const tendencia = useMemo(
    () => agruparTendencia(pagos, periodo.desde, periodo.hasta),
    [pagos, periodo]
  );
  const diasSeleccionados =
    Math.floor(
      (new Date(`${periodo.hasta}T00:00:00`).getTime() -
        new Date(`${periodo.desde}T00:00:00`).getTime()) /
        86400000
    ) + 1;

  const aplicarPeriodo = (event) => {
    event.preventDefault();
    if (!desde || !hasta || desde > hasta) {
      setErrorVista("Selecciona un rango de fechas válido.");
      return;
    }
    setErrorVista("");
    setCargando(true);
    setPeriodo({ desde, hasta });
    setVersionReporte((version) => version + 1);
  };

  const actualizarReporte = () => {
    setErrorVista("");
    setCargando(true);
    setVersionReporte((version) => version + 1);
  };

  const exportarExcel = async () => {
    try {
      const { default: ExcelJS } = await import("exceljs");
      const libro = new ExcelJS.Workbook();
      const agregarHoja = (nombre, filas, anchos) => {
        const hoja = libro.addWorksheet(nombre);
        hoja.columns = anchos.map((width) => ({ width }));
        hoja.addRows(filas);
      };

      agregarHoja("Resumen", [
        ["Reporte financiero · Clínica Milán"],
        ["Período", periodo.desde, "al", periodo.hasta],
        ["Indicador", "Valor"],
        ["Ingresos cobrados (C$)", totalCobrado],
        ["Saldo pendiente acumulado (C$)", saldoPendiente],
        ["Facturado en el período (C$)", totalFacturado],
        ["Honorarios estimados · 70% (C$)", totalFacturado * PORCENTAJE_ESPECIALISTA],
        ["Retención clínica · 30% (C$)", totalFacturado * PORCENTAJE_CLINICA],
        ["Comprobantes emitidos", pagos.length],
        ["Promedio cobrado por día (C$)", diasSeleccionados > 0 ? totalCobrado / diasSeleccionados : 0],
      ], [38, 20, 8, 14]);

      agregarHoja("Tendencia", [
        ["Período", "Ingresos cobrados (C$)"],
        ...tendencia.map((punto) => [punto.clave, punto.total]),
      ], [18, 26]);

      agregarHoja("Métodos de pago", [
        ["Método de pago", "Total cobrado (C$)", "Porcentaje"],
        ...ingresosPorMetodo.map(([metodo, total]) => [
          metodo,
          total,
          totalCobrado > 0 ? total / totalCobrado : 0,
        ]),
      ], [22, 24, 16]);

      agregarHoja("Especialidades", [
        ["Especialidad", "Facturado (C$)"],
        ...facturadoPorEspecialidad.map(({ nombre, total }) => [nombre, total]),
      ], [32, 22]);

      agregarHoja("Honorarios", [
        [
          "Especialista",
          "Especialidad",
          "Consultas",
          "Bruto facturado (C$)",
          "Honorarios · 70% (C$)",
          "Clínica · 30% (C$)",
        ],
        ...liquidacionEspecialistas.map((item) => [
          item.nombre,
          item.especialidad,
          item.cantidadConsultas,
          item.bruto,
          item.honorarios,
          item.retencion,
        ]),
      ], [28, 28, 12, 22, 24, 20]);

      agregarHoja("Transacciones", [
        [
          "Comprobante",
          "Fecha de pago",
          "Paciente",
          "Cajero",
          "Método de pago",
          "Monto (C$)",
        ],
        ...pagosFiltrados.map((pago) => [
          pago.codigo_comprobante || "Sin código",
          pago.fecha_pago,
          nombreCompleto(pago.pacientes),
          cajeros[pago.id_cajero] || "No disponible",
          pago.metodo_pago || "No disponible",
          Number(pago.monto) || 0,
        ]),
      ], [20, 24, 28, 24, 20, 18]);

      const archivo = await libro.xlsx.writeBuffer();
      const url = URL.createObjectURL(
        new Blob([archivo], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `reporte-financiero-${periodo.desde}-al-${periodo.hasta}.xlsx`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      toast.success("Reporte Excel descargado.");
    } catch (error) {
      console.error("Error exportando el reporte financiero a Excel:", error);
      toast.error("No se pudo generar el archivo Excel.");
    }
  };

  return (
    <main className="reportes-page">
      <header className="reportes-header">
        <div className="reportes-header-title">
          <span className="reportes-header-icon" aria-hidden="true">
            <FiActivity />
          </span>
          <div>
            <p className="reportes-eyebrow">Clínica Milán · Administración</p>
            <h1>Reportes financieros</h1>
            <p>Ingresos, saldos pendientes y liquidación estimada por especialista.</p>
          </div>
        </div>
        <div className="reportes-header-actions reportes-no-print">
          <button
            type="button"
            className="btn reportes-exportar reportes-exportar-pdf"
            onClick={() => window.print()}
            disabled={cargando || Boolean(errorVista)}
          >
            <FiPrinter aria-hidden="true" />
            Guardar PDF
          </button>
          <button
            type="button"
            className="btn reportes-exportar reportes-exportar-excel"
            onClick={exportarExcel}
            disabled={cargando || Boolean(errorVista)}
          >
            <FiDownload aria-hidden="true" />
            Descargar Excel
          </button>
          <button
            type="button"
            className="btn reportes-refresh"
            onClick={actualizarReporte}
            disabled={cargando}
          >
            <FiRefreshCw
              aria-hidden="true"
              className={cargando ? "reportes-spin" : ""}
            />
            Actualizar
          </button>
        </div>
      </header>

      <form className="reportes-filtros" onSubmit={aplicarPeriodo}>
        <div className="reportes-filtro-title">
          <FiCalendar aria-hidden="true" />
          <strong>Período del reporte</strong>
        </div>
        <label>
          Desde
          <input
            className="form-control"
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            required
          />
        </label>
        <label>
          Hasta
          <input
            className="form-control"
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            required
          />
        </label>
        <button className="btn reportes-aplicar" type="submit">
          Aplicar filtros
        </button>
      </form>

      {errorVista && (
        <div className="alert alert-danger mb-0" role="alert">
          {errorVista}
        </div>
      )}

      <section className="reportes-kpis" aria-label="Indicadores financieros">
        <article className="reportes-kpi">
          <span className="reportes-kpi-icon kpi-cobrado" aria-hidden="true">
            <FiDollarSign />
          </span>
          <div>
            <span>Ingresos cobrados</span>
            <strong>{cargando ? "Cargando..." : formatoMoneda(totalCobrado)}</strong>
            <small>En el período seleccionado</small>
          </div>
        </article>
        <article className="reportes-kpi">
          <span className="reportes-kpi-icon kpi-pendiente" aria-hidden="true">
            <FiActivity />
          </span>
          <div>
            <span>Saldo pendiente</span>
            <strong>{cargando ? "Cargando..." : formatoMoneda(saldoPendiente)}</strong>
            <small>Saldo acumulado de todas las consultas</small>
          </div>
        </article>
        <article className="reportes-kpi">
          <span className="reportes-kpi-icon kpi-honorarios" aria-hidden="true">
            <FiTrendingUp />
          </span>
          <div>
            <span>Honorarios estimados · 70%</span>
            <strong>
              {cargando
                ? "Cargando..."
                : formatoMoneda(totalFacturado * PORCENTAJE_ESPECIALISTA)}
            </strong>
            <small>Sobre facturación del período</small>
          </div>
        </article>
        <article className="reportes-kpi">
          <span className="reportes-kpi-icon kpi-clinica" aria-hidden="true">
            <FiDollarSign />
          </span>
          <div>
            <span>Retención clínica · 30%</span>
            <strong>
              {cargando
                ? "Cargando..."
                : formatoMoneda(totalFacturado * PORCENTAJE_CLINICA)}
            </strong>
            <small>Sobre facturación del período</small>
          </div>
        </article>
        <article className="reportes-kpi">
          <span className="reportes-kpi-icon kpi-comprobantes" aria-hidden="true">
            <FiActivity />
          </span>
          <div>
            <span>Comprobantes emitidos</span>
            <strong>{cargando ? "Cargando..." : pagos.length}</strong>
            <small>En el período seleccionado</small>
          </div>
        </article>
      </section>

      <section className="reportes-graficos">
        <article className="reportes-card reporte-tendencia">
          <div className="reportes-card-heading">
            <div>
              <h2>Tendencia de ingresos</h2>
              <p>{diasSeleccionados > 31 ? "Agrupado por mes" : "Agrupado por día"}</p>
            </div>
            <span className="reportes-chart-badge">Cobrado</span>
          </div>
          {cargando ? (
            <p className="reporte-chart-empty">Cargando datos...</p>
          ) : (
            <GraficoTendencia
              puntos={tendencia}
              agrupadoPorMes={diasSeleccionados > 31}
            />
          )}
        </article>

        <article className="reportes-card">
          <div className="reportes-card-heading">
            <div>
              <h2>Ingresos por método de pago</h2>
              <p>Distribución de cobros en el período</p>
            </div>
          </div>
          {cargando ? (
            <p className="reporte-chart-empty">Cargando datos...</p>
          ) : ingresosPorMetodo.length === 0 ? (
            <p className="reporte-chart-empty">No hay cobros en este período.</p>
          ) : (
            <div className="reporte-metodos">
              {ingresosPorMetodo.map(([metodo, total], index) => {
                const porcentaje = totalCobrado > 0 ? (total / totalCobrado) * 100 : 0;
                return (
                  <div className="reporte-metodo" key={metodo}>
                    <div className="reporte-metodo-heading">
                      <span>
                        <i style={{ backgroundColor: COLORES[index % COLORES.length] }} />
                        {metodo}
                      </span>
                      <strong>{formatoMoneda(total)}</strong>
                    </div>
                    <div
                      className="reporte-bar-track"
                      role="img"
                      aria-label={`${metodo}: ${porcentaje.toFixed(1)}%`}
                    >
                      <span
                        style={{
                          width: `${porcentaje}%`,
                          backgroundColor: COLORES[index % COLORES.length],
                        }}
                      />
                    </div>
                    <small>{porcentaje.toFixed(1)}% del total cobrado</small>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="reportes-card reporte-especialidades">
          <div className="reportes-card-heading">
            <div>
              <h2>Facturación por especialidad</h2>
              <p>Procedimientos realizados en el período</p>
            </div>
          </div>
          {cargando ? (
            <p className="reporte-chart-empty">Cargando datos...</p>
          ) : (
            <GraficoEspecialidades datos={facturadoPorEspecialidad} />
          )}
        </article>
      </section>

      <section className="reportes-card">
        <div className="reportes-card-heading reportes-tabla-heading">
          <div>
            <h2>Transacciones recientes</h2>
            <p>Pagos recibidos en el rango seleccionado.</p>
          </div>
          <label className="reportes-filtro-cajero">
            Filtrar por cajero
            <select
              className="form-select"
              value={cajeroFiltro}
              onChange={(event) => setCajeroFiltro(event.target.value)}
            >
              <option value="">Todos los cajeros</option>
              {[...new Set(pagos.map((pago) => pago.id_cajero).filter(Boolean))].map(
                (id) => (
                  <option key={id} value={id}>
                    {cajeros[id] || "Cajero sin perfil"}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
        {cargando ? (
          <p className="reporte-chart-empty">Cargando transacciones...</p>
        ) : pagosFiltrados.length === 0 ? (
          <p className="reporte-chart-empty">No hay transacciones para mostrar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle reportes-table">
              <thead>
                <tr>
                  <th>Comprobante</th>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Cajero</th>
                  <th>Método de pago</th>
                  <th className="text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.slice(0, 100).map((pago) => (
                  <tr key={pago.id_pago}>
                    <td className="reportes-comprobante">
                      {pago.codigo_comprobante || "Sin código"}
                    </td>
                    <td>{formatoFecha(pago.fecha_pago)}</td>
                    <td>{nombreCompleto(pago.pacientes)}</td>
                    <td>{cajeros[pago.id_cajero] || "No disponible"}</td>
                    <td>
                      <span className="reportes-metodo-tag">
                        {pago.metodo_pago || "No disponible"}
                      </span>
                    </td>
                    <td className="text-end fw-semibold">
                      {formatoMoneda(pago.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagosFiltrados.length > 100 && (
              <p className="reportes-tabla-nota">
                Se muestran los 100 pagos más recientes de {pagosFiltrados.length}.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="reportes-card">
        <div className="reportes-card-heading">
          <div>
            <h2>Liquidación por especialista</h2>
            <p>Distribución estimada sobre procedimientos facturados en el período.</p>
          </div>
          <span className="reportes-regla">70% especialista · 30% clínica</span>
        </div>
        {cargando ? (
          <p className="reporte-chart-empty">Cargando liquidación...</p>
        ) : liquidacionEspecialistas.length === 0 ? (
          <p className="reporte-chart-empty">
            No hay procedimientos facturados en este período.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle reportes-table">
              <thead>
                <tr>
                  <th>Especialista</th>
                  <th>Especialidad</th>
                  <th className="text-center">Consultas</th>
                  <th className="text-end">Bruto facturado</th>
                  <th className="text-end">Honorarios · 70%</th>
                  <th className="text-end">Clínica · 30%</th>
                </tr>
              </thead>
              <tbody>
                {liquidacionEspecialistas.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.nombre}</td>
                    <td>{item.especialidad}</td>
                    <td className="text-center">{item.cantidadConsultas}</td>
                    <td className="text-end">{formatoMoneda(item.bruto)}</td>
                    <td className="text-end reportes-honorarios">
                      {formatoMoneda(item.honorarios)}
                    </td>
                    <td className="text-end">{formatoMoneda(item.retencion)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3">Total del período</th>
                  <th className="text-end">{formatoMoneda(totalFacturado)}</th>
                  <th className="text-end">
                    {formatoMoneda(totalFacturado * PORCENTAJE_ESPECIALISTA)}
                  </th>
                  <th className="text-end">
                    {formatoMoneda(totalFacturado * PORCENTAJE_CLINICA)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <p className="reportes-nota-contable">
          Para este reporte se aplica provisionalmente la regla genérica 30% clínica / 70% especialista
          a todos los procedimientos; la excepción de C$100 aún no está configurada por procedimiento.
          {" "}
          Los honorarios son una estimación calculada sobre lo facturado. El sistema no registra pagos
          realizados a especialistas, por lo que este reporte no indica montos liquidados ni adeudados.
        </p>
      </section>
    </main>
  );
};

export default ReportesFinancieros;
