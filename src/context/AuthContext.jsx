import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../database/supabase";
import { AuthContext } from "./AuthContextValue";

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

  const cerrarSesion = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error cerrando sesión:", error);
      return;
    }

    setUsuario(null);
    setPerfil(null);
  }, []);

  const valorContexto = useMemo(
    () => ({
      usuario,
      perfil,
      cargando,
      cerrarSesion,
    }),
    [usuario, perfil, cargando, cerrarSesion]
  );

  return (
    <AuthContext.Provider
      value={valorContexto}
    >
      {children}
    </AuthContext.Provider>
  );
};