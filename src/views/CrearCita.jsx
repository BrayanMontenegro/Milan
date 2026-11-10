import React from "react";
import { useNavigate } from "react-router-dom";
import useCrearCita from "./useCrearCita";
import CrearCitaPageContent from "../components/Citas/crear/CrearCitaPageContent";

import "../styles/CrearCita.css";

const FORMATEADOR_FECHA = new Intl.DateTimeFormat(
  "es-NI",
  {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
);

const CrearCita = () => {
  const navigate = useNavigate();
  const flow = useCrearCita(navigate);

  return (
    <CrearCitaPageContent
      flow={flow}
      formatearFecha={formatearFecha}
      formatearHora={formatearHora}
    />
  );
};

// =========================================================
// FUNCIONES AUXILIARES
// =========================================================

const formatearHora = (hora) => {
  if (!hora) return "";

  const [horas, minutos] =
    hora.slice(0, 5).split(":");

  let h = Number(horas);

  const periodo =
    h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${minutos} ${periodo}`;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  const fechaLocal =
    new Date(`${fecha}T00:00:00`);

  return FORMATEADOR_FECHA.format(fechaLocal);
};

export default CrearCita;