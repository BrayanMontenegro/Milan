import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { supabase } from "../database/supabase";
import "../styles/Caja.css";

const METODOS_PAGO = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TARJETA", label: "Tarjeta" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
];

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
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

const totalProcedimientos = (consulta) =>
  (consulta.procedimientos_consulta || []).reduce(
    (total, item) =>
      total +
      Number(
        item.subtotal ??
          Number(item.precio_unitario || 0) * Number(item.cantidad || 0)
      ),
    0
  );

const totalPagado = (consulta) =>
  (consulta.pagos_caja || []).reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

const saldoPendiente = (consulta) =>
  Math.max(0, totalProcedimientos(consulta) - totalPagado(consulta));

const Caja = () => {
  const [consultas, setConsultas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [referencia, setReferencia] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [errorVista, setErrorVista] = useState("");
  const [comprobante, setComprobante] = useState(null);

  const cargarCaja = useCallback(async () => {
    const [consultasResult, pagosResult] = await Promise.all([
      supabase
        .from("consultas")
        .select(`
          id_consulta,
          fecha_consulta,
          motivo_consulta,
          pacientes (
            id_paciente,
            nombres,
            apellidos,
            codigo_expediente
          ),
          especialistas (
            nombres,
            apellidos
          ),
          procedimientos_consulta (
            id_procedimiento,
            nombre,
            cantidad,
            precio_unitario,
            subtotal
          ),
          pagos_caja (
            id_pago,
            monto,
            fecha_pago,
            metodo_pago,
            codigo_comprobante
          )
        `)
        .order("fecha_consulta", { ascending: false })
        .limit(200),
      supabase
        .from("pagos_caja")
        .select(`
          id_pago,
          codigo_comprobante,
          id_consulta,
          id_paciente,
          monto,
          metodo_pago,
          referencia,
          fecha_pago,
          pacientes (
            nombres,
            apellidos,
            codigo_expediente
          ),
          consultas (
            fecha_consulta,
            especialistas (
              nombres,
              apellidos
            ),
            procedimientos_consulta (
              id_procedimiento,
              nombre,
              cantidad,
              precio_unitario,
              subtotal
            )
          )
        `)
        .order("fecha_pago", { ascending: false })
        .limit(100),
    ]);

    if (consultasResult.error || pagosResult.error) {
      const error = consultasResult.error || pagosResult.error;
      console.error("Error cargando Caja:", error);
      setErrorVista(`No se pudieron cargar los cobros: ${error.message}`);
    } else {
      setConsultas(consultasResult.data || []);
      setPagos(pagosResult.data || []);
    }

    setCargando(false);
  }, []);

  useEffect(() => {
    cargarCaja();
  }, [cargarCaja]);

  const pendientes = useMemo(
    () =>
      consultas
        .map((consulta) => ({
          ...consulta,
          total: totalProcedimientos(consulta),
          pagado: totalPagado(consulta),
          saldo: saldoPendiente(consulta),
        }))
        .filter((consulta) => consulta.saldo > 0),
    [consultas]
  );

  const pendientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es-NI");
    if (!termino) return pendientes;

    return pendientes.filter((consulta) =>
      [
        nombreCompleto(consulta.pacientes),
        nombreCompleto(consulta.especialistas),
        consulta.pacientes?.codigo_expediente,
      ]
        .filter(Boolean)
        .some((valor) => valor.toLocaleLowerCase("es-NI").includes(termino))
    );
  }, [busqueda, pendientes]);

  const saldoTotalPendiente = useMemo(
    () => pendientes.reduce((total, consulta) => total + consulta.saldo, 0),
    [pendientes]
  );

  const registrarPago = async (event) => {
    event.preventDefault();
    if (!consultaSeleccionada || consultaSeleccionada.saldo <= 0) {
      toast.warning("Selecciona una consulta con saldo pendiente.");
      return;
    }

    setGuardando(true);
    const { data, error } = await supabase
      .from("pagos_caja")
      .insert({
        id_consulta: consultaSeleccionada.id_consulta,
        id_paciente: consultaSeleccionada.pacientes.id_paciente,
        monto: consultaSeleccionada.saldo,
        metodo_pago: metodoPago,
        referencia: referencia.trim() || null,
      })
      .select(`
        id_pago,
        codigo_comprobante,
        id_consulta,
        monto,
        metodo_pago,
        referencia,
        fecha_pago
      `)
      .single();
    setGuardando(false);

    if (error) {
      console.error("Error registrando el pago:", error);
      toast.error(`No se pudo registrar el pago: ${error.message}`);
      return;
    }

    setComprobante({
      ...data,
      pacientes: consultaSeleccionada.pacientes,
      especialistas: consultaSeleccionada.especialistas,
      consultas: consultaSeleccionada,
    });
    setConsultaSeleccionada(null);
    setMetodoPago("EFECTIVO");
    setReferencia("");
    toast.success("Pago registrado correctamente.");
    setCargando(true);
    await cargarCaja();
  };

  return (
    <main className="caja-page">
      <header className="caja-header">
        <div className="caja-header-title">
          <span className="caja-header-icon" aria-hidden="true">
            <FiDollarSign />
          </span>
          <div>
            <p className="caja-eyebrow">Clínica Milán</p>
            <h1>Caja</h1>
            <p>Cobros pendientes de procedimientos realizados en consulta.</p>
          </div>
        </div>
        <button
          type="button"
          className="btn caja-refresh"
          onClick={() => {
            setCargando(true);
            setErrorVista("");
            cargarCaja();
          }}
          disabled={cargando}
        >
          <FiRefreshCw
            aria-hidden="true"
            className={cargando ? "caja-spin" : ""}
          />
          {cargando ? "Actualizando..." : "Actualizar"}
        </button>
      </header>

      {errorVista && (
        <div className="alert alert-danger" role="alert">
          <strong>No se pudo cargar Caja.</strong>
          <div>{errorVista}</div>
          <div className="mt-2">
            Revisa el acceso RLS de recepción/administración a las consultas,
            procedimientos y pagos existentes en Supabase.
          </div>
        </div>
      )}

      <section className="caja-resumen" aria-label="Resumen de cobros">
        <article className="caja-card">
          <span
            className="caja-resumen-icon caja-resumen-icon-pendiente"
            aria-hidden="true"
          >
            <FiClock />
          </span>
          <div>
            <p className="caja-eyebrow">Saldo por cobrar</p>
            <strong>{formatoMoneda(saldoTotalPendiente)}</strong>
            <span>{pendientes.length} consultas pendientes</span>
          </div>
        </article>
        <article className="caja-card">
          <span
            className="caja-resumen-icon caja-resumen-icon-pagos"
            aria-hidden="true"
          >
            <FiCreditCard />
          </span>
          <div>
            <p className="caja-eyebrow">Comprobantes registrados</p>
            <strong>{pagos.length}</strong>
            <span>Últimos 100 pagos</span>
          </div>
        </article>
      </section>

      {comprobante && (
        <section className="caja-comprobante caja-card" aria-live="polite">
          <div className="caja-comprobante-acciones caja-no-print">
            <h2>Comprobante de pago</h2>
            <div className="caja-acciones">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => window.print()}
              >
                Imprimir
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setComprobante(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
          <div className="caja-comprobante-contenido">
            <p className="caja-eyebrow">Clínica Milán</p>
            <h2>Comprobante de pago</h2>
            <dl>
              <div>
                <dt>N.º de comprobante</dt>
                <dd>{comprobante.codigo_comprobante}</dd>
              </div>
              <div>
                <dt>Paciente</dt>
                <dd>{nombreCompleto(comprobante.pacientes)}</dd>
              </div>
              <div>
                <dt>Especialista</dt>
                <dd>{nombreCompleto(comprobante.especialistas)}</dd>
              </div>
              <div>
                <dt>Consulta</dt>
                <dd>{formatoFecha(comprobante.consultas?.fecha_consulta)}</dd>
              </div>
              <div>
                <dt>Fecha de pago</dt>
                <dd>{formatoFecha(comprobante.fecha_pago)}</dd>
              </div>
              <div>
                <dt>Método</dt>
                <dd>
                  {METODOS_PAGO.find(
                    (metodo) => metodo.value === comprobante.metodo_pago
                  )?.label || comprobante.metodo_pago}
                </dd>
              </div>
            </dl>
            <h3>Procedimientos</h3>
            <ul>
              {(comprobante.consultas?.procedimientos_consulta || []).map(
                (item) => (
                  <li key={item.id_procedimiento}>
                    {item.nombre} × {item.cantidad}:{" "}
                    {formatoMoneda(
                      item.subtotal ??
                        Number(item.precio_unitario) * Number(item.cantidad)
                    )}
                  </li>
                )
              )}
            </ul>
            <p className="caja-comprobante-total">
              Total pagado: {formatoMoneda(comprobante.monto)}
            </p>
          </div>
        </section>
      )}

      <section className="caja-card">
        <div className="caja-movimientos-header">
          <div>
            <div className="caja-section-title">
              <span className="caja-section-icon" aria-hidden="true">
                <FiClock />
              </span>
              <div>
                <h2>Procedimientos por cobrar</h2>
                <p>Se descuenta lo ya abonado para cada consulta.</p>
              </div>
            </div>
          </div>
          <label className="caja-busqueda-wrap">
            <FiSearch aria-hidden="true" />
            <input
              className="form-control caja-busqueda"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar paciente o especialista"
              aria-label="Buscar paciente o especialista"
            />
          </label>
        </div>

        {cargando ? (
          <div className="caja-loading" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            Cargando cobros...
          </div>
        ) : pendientesFiltrados.length === 0 ? (
          <p className="caja-vacio">
            No hay procedimientos pendientes de cobro.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle caja-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Especialista</th>
                  <th>Procedimientos</th>
                  <th>Saldo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pendientesFiltrados.map((consulta) => (
                  <tr key={consulta.id_consulta}>
                    <td>{formatoFecha(consulta.fecha_consulta)}</td>
                    <td>
                      <strong>{nombreCompleto(consulta.pacientes)}</strong>
                      <small className="d-block text-muted">
                        {consulta.pacientes?.codigo_expediente || "Sin expediente"}
                      </small>
                    </td>
                    <td>{nombreCompleto(consulta.especialistas)}</td>
                    <td>
                      <ul className="caja-lista-procedimientos">
                        {(consulta.procedimientos_consulta || []).map((item) => (
                          <li key={item.id_procedimiento}>
                            {item.nombre} × {item.cantidad}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="fw-semibold">
                      <span className="caja-monto-pendiente">
                        {formatoMoneda(consulta.saldo)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm caja-btn-cobrar"
                        onClick={() => {
                          setConsultaSeleccionada(consulta);
                          setReferencia("");
                          setMetodoPago("EFECTIVO");
                        }}
                      >
                        <FiDollarSign aria-hidden="true" />
                        Cobrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {consultaSeleccionada && (
        <section className="caja-card caja-formulario">
          <div className="caja-formulario-header">
            <span className="caja-section-icon" aria-hidden="true">
              <FiCreditCard />
            </span>
            <div>
              <h2>Registrar pago</h2>
              <p>
                {nombreCompleto(consultaSeleccionada.pacientes)} ·{" "}
                {nombreCompleto(consultaSeleccionada.especialistas)}
              </p>
            </div>
            <p className="caja-saldo-seleccionado">
              Saldo a cobrar <strong>{formatoMoneda(consultaSeleccionada.saldo)}</strong>
            </p>
          </div>
          <form onSubmit={registrarPago}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="caja-metodo">
                  Método de pago
                </label>
                <select
                  id="caja-metodo"
                  className="form-select"
                  value={metodoPago}
                  onChange={(event) => setMetodoPago(event.target.value)}
                  required
                >
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="caja-referencia">
                  Referencia (opcional)
                </label>
                <input
                  id="caja-referencia"
                  className="form-control"
                  value={referencia}
                  maxLength={120}
                  onChange={(event) => setReferencia(event.target.value)}
                  placeholder="N.º de operación"
                />
              </div>
            </div>
            <div className="caja-acciones mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setConsultaSeleccionada(null)}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn caja-btn-confirmar"
                disabled={guardando}
              >
                <FiCheckCircle aria-hidden="true" />
                {guardando ? "Registrando..." : "Confirmar pago"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="caja-card">
        <div className="caja-movimientos-header">
          <div>
            <div className="caja-section-title">
              <span
                className="caja-section-icon caja-section-icon-pagos"
                aria-hidden="true"
              >
                <FiFileText />
              </span>
              <div>
                <h2>Pagos recientes</h2>
                <p>Comprobantes emitidos desde Caja.</p>
              </div>
            </div>
          </div>
          <span className="caja-registros">{pagos.length} registros</span>
        </div>
        {pagos.length === 0 ? (
          <p className="caja-vacio">Todavía no hay pagos registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle caja-table">
              <thead>
                <tr>
                  <th>Comprobante</th>
                  <th>Fecha de pago</th>
                  <th>Paciente</th>
                  <th>Especialista</th>
                  <th>Método</th>
                  <th className="text-end">Monto</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id_pago}>
                    <td>{pago.codigo_comprobante}</td>
                    <td>{formatoFecha(pago.fecha_pago)}</td>
                    <td>{nombreCompleto(pago.pacientes)}</td>
                    <td>
                      {nombreCompleto(pago.consultas?.especialistas)}
                    </td>
                    <td>
                      {METODOS_PAGO.find(
                        (metodo) => metodo.value === pago.metodo_pago
                      )?.label || pago.metodo_pago}
                    </td>
                    <td className="text-end">{formatoMoneda(pago.monto)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setComprobante({
                            ...pago,
                            especialistas: pago.consultas?.especialistas,
                            consultas: {
                              ...pago.consultas,
                              procedimientos_consulta:
                                pago.consultas?.procedimientos_consulta || [],
                            },
                          })
                        }
                      >
                        Ver comprobante
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default Caja;
