import React from "react";

const TablaEncabezado = ({ columnas }) => (
  <thead>
    <tr>
      {columnas.map(({ etiqueta, className }) => (
        <th key={etiqueta} className={className}>
          {etiqueta}
        </th>
      ))}
    </tr>
  </thead>
);

export default TablaEncabezado;
