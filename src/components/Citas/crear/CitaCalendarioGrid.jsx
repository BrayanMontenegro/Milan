import React from "react";

const CitaCalendarioGrid = ({
  diasSemana,
  diasVacios,
  dias,
  anio,
  mes,
  fecha,
  seleccionarDia,
  esAnteriorAHoy,
  tieneHorario,
}) => (
  <>
    <div className="cita-calendario-grid">
      {diasSemana.map((dia) => (
        <div key={dia} className="cita-calendario-dia-nombre">
          {dia}
        </div>
      ))}

      {diasVacios.map((dia) => (
        <div
          key={`vacio-${dia}`}
          className="cita-calendario-dia vacio"
        />
      ))}

      {dias.map((dia) => {
        const fechaDia =
          `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const seleccionado = fecha === fechaDia;
        const deshabilitado = esAnteriorAHoy(dia);
        const disponible = tieneHorario(dia);

        return (
          <button
            type="button"
            key={dia}
            disabled={deshabilitado || !disponible}
            className={`cita-calendario-dia ${
              seleccionado ? "seleccionado" : ""
            } ${!disponible ? "sin-horario" : ""} ${
              deshabilitado ? "deshabilitado" : ""
            }`}
            onClick={() => seleccionarDia(dia)}
            title={
              deshabilitado
                ? "Fecha no disponible"
                : !disponible
                ? "El especialista no atiende este día"
                : "Seleccionar fecha"
            }
          >
            <span>{dia}</span>
            {disponible && !deshabilitado && <i />}
          </button>
        );
      })}
    </div>
    <div className="cita-calendario-leyenda">
      <span>
        <i className="disponible" />
        Con horario
      </span>
      <span>
        <i className="seleccionado" />
        Seleccionado
      </span>
    </div>
  </>
);

export default CitaCalendarioGrid;
