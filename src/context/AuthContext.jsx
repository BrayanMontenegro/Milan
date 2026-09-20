import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../database/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const obtenerPerfil = async (user) => {
    if (!user) {
      setPerfil(null);
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select(`
        id_usuario,
        nombres,
        apellidos,
        id_rol,
        roles (
          id_rol,
          nombre
        )
      `)
      .eq("id_usuario", user.id)
      .single();

    if (error) {
      console.error("Error obteniendo perfil:", error);
      setPerfil(null);
      return;
    }

    setPerfil(data);
  };

  useEffect(() => {
    const iniciarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUsuario(session.user);
        await obtenerPerfil(session.user);
      }

      setCargando(false);
    };

    iniciarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUsuario(session?.user ?? null);

      if (session?.user) {
        await obtenerPerfil(session.user);
      } else {
        setPerfil(null);
      }

      setCargando(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error cerrando sesión:", error);
      return;
    }

    setUsuario(null);
    setPerfil(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        cargando,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);