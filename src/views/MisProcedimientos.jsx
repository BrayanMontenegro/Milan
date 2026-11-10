import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaPowerOff,
  FaStethoscope,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { supabase } from "../database/supabase";
import { useAuth } from "../context/AuthContextValue";
import "../styles/MisProcedimientos.css";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
};

export default function MisProcedimientos() {
  const { usuario } = useAuth();

  const [especialistaId, setEspecialistaId] = useState(null);
  const [procedimientos, setProcedimientos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [procedimientoEditar, setProcedimientoEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarEspecialista = useCallback(async () => {
    if (!usuario?.id) return;

    const { data, error } = await supabase
      .from("especialistas")
      .select("id_especialista")
      .eq("id_usuario", usuario.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      toast.error("No se pudo identificar al especialista.");
      return;
    }

    if (!data) {
      toast.error("No se encontró el perfil de especialista.");
      return;
    }

    setEspecialistaId(data.id_especialista);
  }, [usuario]);

  const cargarProcedimientos = useCallback(async () => {
    if (!especialistaId) return;

    setCargando(true);

    const { data, error } = await supabase
      .from("procedimientos_especialistas")
      .select(
        "id_procedimiento_especialista, nombre, descripcion, precio, activo"
      )
      .eq("id_especialista", especialistaId)
      .order("nombre", { ascending: true });

    if (error) {
      console.error(error);
      toast.error("No se pudieron cargar los procedimientos.");
    } else {
      setProcedimientos(data || []);
    }

    setCargando(false);
  }, [especialistaId]);

  useEffect(() => {
    cargarEspecialista();
  }, [cargarEspecialista]);

  useEffect(() => {
    cargarProcedimientos();
  }, [cargarProcedimientos]);

  const abrirNuevo = () => {
    setProcedimientoEditar(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
  };

  const abrirEditar = (procedimiento) => {
    setProcedimientoEditar(procedimiento);
    setFormulario({
      nombre: procedimiento.nombre || "",
      descripcion: procedimiento.descripcion || "",
      precio: String(procedimiento.precio ?? ""),
    });
    setMostrarFormulario(true);
  };

  const cambiarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const guardarProcedimiento = async (e) => {
    e.preventDefault();

    const nombre = formulario.nombre.trim();
    const precio = Number(formulario.precio);

    if (!nombre) {
      toast.warning("Escribe el nombre del procedimiento.");
      return;
    }

    if (formulario.precio === "" || !Number.isFinite(precio) || precio < 0) {
      toast.warning("Ingresa un precio válido.");
      return;
    }

    if (!especialistaId) {
      toast.error("No se encontró el especialista de la sesión.");
      return;
    }

    setGuardando(true);

    const datos = {
      nombre,
      descripcion: formulario.descripcion.trim() || null,
      precio,
    };

    let resultado;

    if (procedimientoEditar) {
      resultado = await supabase
        .from("procedimientos_especialistas")
        .update(datos)
        .eq(
          "id_procedimiento_especialista",
          procedimientoEditar.id_procedimiento_especialista
        )
        .eq("id_especialista", especialistaId);
    } else {
      resultado = await supabase
        .from("procedimientos_especialistas")
        .insert({
          ...datos,
          id_especialista: especialistaId,
          activo: true,
        });
    }

    setGuardando(false);

    if (resultado.error) {
      console.error(resultado.error);

      if (resultado.error.code === "23505") {
        toast.error("Ya tienes un procedimiento con ese nombre.");
      } else {
        toast.error("No se pudo guardar el procedimiento.");
      }

      return;
    }

    toast.success(
      procedimientoEditar
        ? "Procedimiento actualizado."
        : "Procedimiento agregado."
    );

    setMostrarFormulario(false);
    setFormulario(formularioInicial);
    setProcedimientoEditar(null);
    await cargarProcedimientos();
  };

  const cambiarEstado = async (procedimiento) => {
    const nuevoEstado = !procedimiento.activo;

    const { error } = await supabase
      .from("procedimientos_especialistas")
      .update({ activo: nuevoEstado })
      .eq(
        "id_procedimiento_especialista",
        procedimiento.id_procedimiento_especialista
      )
      .eq("id_especialista", especialistaId);

    if (error) {
      console.error(error);
      toast.error("No se pudo cambiar el estado.");
      return;
    }

    toast.success(
      nuevoEstado
        ? "Procedimiento activado."
        : "Procedimiento desactivado."
    );

    await cargarProcedimientos();
  };

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency: "NIO",
    }).format(Number(precio || 0));

  return (
    <div className="mis-procedimientos">
      <div className="procedimientos-encabezado">
        <div>
          <h2>
            <FaStethoscope /> Mis procedimientos
          </h2>
          <p>Administra los procedimientos y sus precios.</p>
        </div>

        <button className="btn-agregar-procedimiento" onClick={abrirNuevo}>
          <FaPlus /> Agregar procedimiento
        </button>
      </div>

      {mostrarFormulario && (
        <div className="procedimiento-formulario-contenedor">
          <form onSubmit={guardarProcedimiento}>
            <div className="procedimiento-formulario-titulo">
              <h3>
                {procedimientoEditar
                  ? "Editar procedimiento"
                  : "Nuevo procedimiento"}
              </h3>

              <button
                type="button"
                className="btn-cerrar-procedimiento"
                onClick={() => setMostrarFormulario(false)}
                aria-label="Cerrar formulario"
              >
                <FaTimes />
              </button>
            </div>

            <div className="campo-procedimiento">
              <label htmlFor="nombre">Nombre del procedimiento *</label>
              <input
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                maxLength={150}
                placeholder="Ej. Limpieza dental"
                required
              />
            </div>

            <div className="campo-procedimiento">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={cambiarCampo}
                rows={3}
                placeholder="Describe el procedimiento..."
              />
            </div>

            <div className="campo-procedimiento">
              <label htmlFor="precio">Precio (C$) *</label>
              <input
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={cambiarCampo}
                placeholder="0.00"
                required
              />
            </div>

            <div className="procedimiento-formulario-acciones">
              <button
                type="button"
                className="btn-cancelar-procedimiento"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-agregar-procedimiento"
                disabled={guardando}
              >
                <FaSave />
                {guardando ? "Guardando..." : "Guardar procedimiento"}
              </button>
            </div>
          </form>
        </div>
      )}

      {cargando ? (
        <p className="procedimientos-mensaje">Cargando procedimientos...</p>
      ) : procedimientos.length === 0 ? (
        <div className="procedimientos-vacio">
          <FaStethoscope />
          <h3>Aún no tienes procedimientos</h3>
          <p>Agrega el primero para utilizarlo al atender una consulta.</p>
        </div>
      ) : (
        <div className="procedimientos-tabla-contenedor">
          <table className="procedimientos-tabla">
            <thead>
              <tr>
                <th>Procedimiento</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {procedimientos.map((procedimiento) => (
                <tr key={procedimiento.id_procedimiento_especialista}>
                  <td>{procedimiento.nombre}</td>
                  <td>{procedimiento.descripcion || "Sin descripción"}</td>
                  <td>{formatoPrecio(procedimiento.precio)}</td>
                  <td>
                    <span
                      className={
                        procedimiento.activo
                          ? "procedimiento-estado activo"
                          : "procedimiento-estado inactivo"
                      }
                    >
                      {procedimiento.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="procedimiento-acciones">
                      <button
                        type="button"
                        onClick={() => abrirEditar(procedimiento)}
                        title="Editar"
                        aria-label={`Editar ${procedimiento.nombre}`}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() => cambiarEstado(procedimiento)}
                        title={
                          procedimiento.activo ? "Desactivar" : "Activar"
                        }
                        aria-label={
                          procedimiento.activo ? "Desactivar" : "Activar"
                        }
                      >
                        <FaPowerOff />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}