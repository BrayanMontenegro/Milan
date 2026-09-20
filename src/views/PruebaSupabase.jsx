import { useEffect, useState } from "react";
import { supabase } from "../database/supabase";

function PruebaSupabase() {
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerEspecialidades = async () => {
      const { data, error } = await supabase
        .from("especialidades")
        .select("*")
        .order("nombre");

      if (error) {
        console.error(error);
        setError(error.message);
        setCargando(false);
        return;
      }

      setEspecialidades(data);
      setCargando(false);
    };

    obtenerEspecialidades();
  }, []);

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error de conexión: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Especialidades</h2>

      <ul className="list-group mt-3">
        {especialidades.map((especialidad) => (
          <li
            key={especialidad.id_especialidad}
            className="list-group-item"
          >
            {especialidad.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PruebaSupabase;