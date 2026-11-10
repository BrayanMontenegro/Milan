import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";
import CitaCalendarioGrid from "./CitaCalendarioGrid";

const diasSemana = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
];

const FORMATEADOR_NOMBRE_MES = new Intl.DateTimeFormat(
  "es-NI",
  {
    month: "long",
    year: "numeric",
  }
);

const CitaCalendario = ({
  fecha,
  setFecha,
  horarios = [],
}) => {
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  // =========================================================
  // FECHA ACTUAL
  // =========================================================

  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();

  // =========================================================
  // FECHA MOSTRADA
  // =========================================================

  const [anio, mes] = fecha
    ? fecha.split("-").map(Number)
    : [
        anioActual,
        mesActual,
      ];

  // =========================================================
  // PRIMER Y ÚLTIMO DÍA DEL MES
  // =========================================================

  const primerDia = new Date(
    anio,
    mes - 1,
    1
  );

  const ultimoDia = new Date(
    anio,
    mes,
    0
  );

  const diasMes =
    ultimoDia.getDate();

  // =========================================================
  // AJUSTAR INICIO DE SEMANA
  // Lunes = 0
  // Domingo = 6
  // =========================================================

  let inicioSemana =
    primerDia.getDay();

  if (inicioSemana === 0) {
    inicioSemana = 6;
  } else {
    inicioSemana -= 1;
  }

  // =========================================================
  // CREAR DÍAS DEL CALENDARIO
  // =========================================================

  const diasVacios = diasSemana.slice(0, inicioSemana);
  const dias = Array.from(
    { length: diasMes },
    (_, index) => index + 1
  );

  // =========================================================
  // COMPROBAR SI ES EL MES ACTUAL
  // =========================================================

  const esMesActual =
    anio === anioActual &&
    mes === mesActual;

  // =========================================================
  // CAMBIAR MES
  // =========================================================

  const cambiarMes = (cantidad) => {
    const nuevaFecha = new Date(
      anio,
      mes - 1 + cantidad,
      1
    );

    // No permitir ir antes del mes actual
    const primerMesPermitido =
      new Date(
        anioActual,
        mesActual - 1,
        1
      );

    if (
      nuevaFecha <
      primerMesPermitido
    ) {
      return;
    }

    const nuevaFechaFormateada =
      `${nuevaFecha.getFullYear()}-${String(
        nuevaFecha.getMonth() + 1
      ).padStart(2, "0")}-01`;

    setFecha(
      nuevaFechaFormateada
    );
  };

  // =========================================================
  // SELECCIONAR DÍA
  // =========================================================

  const seleccionarDia = (dia) => {
    if (!dia) return;

    const fechaNueva =
      `${anio}-${String(
        mes
      ).padStart(2, "0")}-${String(
        dia
      ).padStart(2, "0")}`;

    const fechaSeleccionada =
      new Date(
        `${fechaNueva}T00:00:00`
      );

    if (
      fechaSeleccionada < hoy
    ) {
      return;
    }

    setFecha(fechaNueva);
  };

  // =========================================================
  // OBTENER DÍA DE LA SEMANA
  // =========================================================

  const obtenerDiaSemana = (
    dia
  ) => {
    const fechaDia = new Date(
      anio,
      mes - 1,
      dia
    );

    return fechaDia.getDay();
  };

  // =========================================================
  // COMPROBAR SI TIENE HORARIO
  // =========================================================

  const tieneHorario = (dia) => {
    const diaSemana =
      obtenerDiaSemana(dia);

    return horarios.some(
      (horario) =>
        Number(
          horario.dia_semana
        ) === diaSemana &&
        horario.activo
    );
  };

  // =========================================================
  // COMPROBAR SI ES ANTERIOR A HOY
  // =========================================================

  const esAnteriorAHoy = (
    dia
  ) => {
    const fechaDia = new Date(
      anio,
      mes - 1,
      dia
    );

    return fechaDia < hoy;
  };

  // =========================================================
  // NOMBRE DEL MES
  // =========================================================

  const nombreMes = FORMATEADOR_NOMBRE_MES.format(
    new Date(
      anio,
      mes - 1,
      1
    )
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="cita-calendario">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="cita-calendario-header">

        <button
          type="button"
          className="cita-calendario-nav"
          onClick={() =>
            cambiarMes(-1)
          }
          disabled={esMesActual}
          title="Mes anterior"
        >
          <FaChevronLeft />
        </button>

        <div>
          <FaCalendarAlt />

          <strong>
            {nombreMes
              .charAt(0)
              .toUpperCase() +
              nombreMes.slice(1)}
          </strong>
        </div>

        <button
          type="button"
          className="cita-calendario-nav"
          onClick={() =>
            cambiarMes(1)
          }
          title="Mes siguiente"
        >
          <FaChevronRight />
        </button>

      </div>

      <CitaCalendarioGrid
        diasSemana={diasSemana}
        diasVacios={diasVacios}
        dias={dias}
        anio={anio}
        mes={mes}
        fecha={fecha}
        seleccionarDia={seleccionarDia}
        esAnteriorAHoy={esAnteriorAHoy}
        tieneHorario={tieneHorario}
      />

    </div>
  );
};

export default CitaCalendario;