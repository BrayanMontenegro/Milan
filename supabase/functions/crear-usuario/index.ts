import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // ==========================================
  // CORS
  // ==========================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // ==========================================
    // VARIABLES DE ENTORNO
    // ==========================================

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      return responder(
        {
          error: "Faltan variables de entorno de Supabase.",
        },
        500
      );
    }

    // ==========================================
    // SOLO POST
    // ==========================================

    if (req.method !== "POST") {
      return responder(
        {
          error: "Método no permitido.",
        },
        405
      );
    }

    // ==========================================
    // OBTENER TOKEN
    // ==========================================

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return responder(
        {
          error: "No se encontró la sesión del usuario.",
        },
        401
      );
    }

    // ==========================================
    // CLIENTE CON SESIÓN DEL USUARIO
    // ==========================================

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Error autenticando:",
        userError
      );

      return responder(
        {
          error: "La sesión no es válida.",
        },
        401
      );
    }

    // ==========================================
    // CLIENTE ADMIN
    // ==========================================

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // ==========================================
    // OBTENER PERFIL DEL ADMINISTRADOR
    // ==========================================

    const {
      data: usuarioActual,
      error: perfilActualError,
    } = await supabaseAdmin
      .from("usuarios")
      .select(`
        id_usuario,
        id_rol,
        roles (
          id_rol,
          nombre
        )
      `)
      .eq("id_usuario", user.id)
      .single();

    if (perfilActualError || !usuarioActual) {
      console.error(
        "Error obteniendo perfil:",
        perfilActualError
      );

      return responder(
        {
          error:
            "No se encontró el perfil del usuario actual.",
        },
        403
      );
    }

    // ==========================================
    // OBTENER NOMBRE DEL ROL ACTUAL
    // ==========================================

    const rolActual = Array.isArray(
      usuarioActual.roles
    )
      ? usuarioActual.roles[0]?.nombre
      : usuarioActual.roles?.nombre;

    // ==========================================
    // VERIFICAR ADMINISTRADOR
    // ==========================================

    if (rolActual !== "ADMINISTRADOR") {
      return responder(
        {
          error:
            "No tienes permisos para crear usuarios.",
        },
        403
      );
    }

    // ==========================================
    // LEER BODY
    // ==========================================

    const body = await req.json();

    const nombres =
      typeof body?.nombres === "string"
        ? body.nombres.trim()
        : "";

    const apellidos =
      typeof body?.apellidos === "string"
        ? body.apellidos.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    const id_rol =
      typeof body?.id_rol === "string"
        ? body.id_rol.trim()
        : "";

    // ==========================================
    // VALIDAR CAMPOS
    // ==========================================

    if (
      !nombres ||
      !apellidos ||
      !email ||
      !password ||
      !id_rol
    ) {
      return responder(
        {
          error:
            "Todos los campos son obligatorios.",
        },
        400
      );
    }

    // ==========================================
    // VALIDAR CONTRASEÑA
    // ==========================================

    if (password.length < 6) {
      return responder(
        {
          error:
            "La contraseña debe tener al menos 6 caracteres.",
        },
        400
      );
    }

    // ==========================================
    // NORMALIZAR EMAIL
    // ==========================================

    const emailNormalizado =
      email.toLowerCase();

    // ==========================================
    // VALIDAR EMAIL
    // ==========================================

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailNormalizado
      );

    if (!emailValido) {
      return responder(
        {
          error: "El correo electrónico no es válido.",
        },
        400
      );
    }

    // ==========================================
    // VALIDAR ROL
    // ==========================================

    const {
      data: rol,
      error: rolError,
    } = await supabaseAdmin
      .from("roles")
      .select("id_rol, nombre")
      .eq("id_rol", id_rol)
      .single();

    if (rolError || !rol) {
      console.error(
        "Error buscando rol:",
        rolError
      );

      return responder(
        {
          error:
            "El rol seleccionado no existe.",
        },
        400
      );
    }

    // ==========================================
    // NO PERMITIR CREAR ADMINISTRADORES
    // ==========================================

    if (rol.nombre === "ADMINISTRADOR") {
      return responder(
        {
          error:
            "No se pueden crear administradores desde este módulo.",
        },
        403
      );
    }

    // ==========================================
    // CREAR USUARIO EN AUTH
    // ==========================================

    const {
      data: nuevoUsuario,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser({
        email: emailNormalizado,
        password,
        email_confirm: true,

        user_metadata: {
          nombres,
          apellidos,
        },
      });

    if (
      authError ||
      !nuevoUsuario?.user
    ) {
      console.error(
        "Error creando usuario:",
        authError
      );

      return responder(
        {
          error:
            authError?.message ||
            "No se pudo crear el usuario.",
        },
        400
      );
    }

    const nuevoUsuarioId =
      nuevoUsuario.user.id;

    // ==========================================
    // EL TRIGGER CREA public.usuarios
    // ==========================================
    //
    // IMPORTANTE:
    // No hacemos INSERT aquí porque el trigger
    // crear_usuario() ya creó el registro.
    //

    // Pequeña espera para permitir que el trigger
    // termine antes de consultar el perfil.
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    // ==========================================
    // VERIFICAR PERFIL CREADO POR EL TRIGGER
    // ==========================================

    const {
      data: perfilExistente,
      error: perfilConsultaError,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id_usuario")
      .eq("id_usuario", nuevoUsuarioId)
      .maybeSingle();

    if (
      perfilConsultaError ||
      !perfilExistente
    ) {
      console.error(
        "Error verificando perfil:",
        perfilConsultaError
      );

      // Si el trigger no creó el perfil,
      // eliminamos el usuario de Auth.
      await supabaseAdmin.auth.admin.deleteUser(
        nuevoUsuarioId
      );

      return responder(
        {
          error:
            "El usuario fue creado en Auth, pero no se creó su perfil.",
          detalle:
            perfilConsultaError?.message ||
            "El trigger crear_usuario() no creó el registro en public.usuarios.",
        },
        500
      );
    }

    // ==========================================
    // ACTUALIZAR PERFIL
    // ==========================================

    const {
      data: perfil,
      error: perfilUpdateError,
    } =
      await supabaseAdmin
        .from("usuarios")
        .update({
          id_rol,
          nombres,
          apellidos,
          activo: true,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id_usuario", nuevoUsuarioId)
        .select(`
          id_usuario,
          id_rol,
          nombres,
          apellidos,
          telefono,
          activo,
          created_at,
          updated_at,
          roles (
            id_rol,
            nombre
          )
        `)
        .single();

    // ==========================================
    // SI FALLA LA ACTUALIZACIÓN
    // ==========================================

    if (
      perfilUpdateError ||
      !perfil
    ) {
      console.error(
        "Error actualizando perfil:",
        perfilUpdateError
      );

      // Eliminar usuario de Auth
      await supabaseAdmin.auth.admin.deleteUser(
        nuevoUsuarioId
      );

      return responder(
        {
          error:
            "No se pudo actualizar el perfil del usuario.",
          detalle:
            perfilUpdateError?.message,
        },
        500
      );
    }

    // ==========================================
    // OBTENER NOMBRE DEL ROL
    // ==========================================

    const nombreRol =
      Array.isArray(perfil.roles)
        ? perfil.roles[0]?.nombre
        : perfil.roles?.nombre;

    // ==========================================
    // RESPUESTA EXITOSA
    // ==========================================

    return responder(
      {
        mensaje:
          "Usuario creado correctamente.",

        usuario: {
          id:
            perfil.id_usuario,

          nombres:
            perfil.nombres,

          apellidos:
            perfil.apellidos,

          email:
            emailNormalizado,

          rol:
            nombreRol,

          activo:
            perfil.activo,
        },
      },
      200
    );

  } catch (error) {
    console.error(
      "Error interno:",
      error
    );

    return responder(
      {
        error:
          "Ocurrió un error interno al crear el usuario.",

        detalle:
          error instanceof Error
            ? error.message
            : String(error),
      },
      500
    );
  }
});

// ==========================================
// FUNCIÓN DE RESPUESTA
// ==========================================

function responder(
  datos: Record<string, unknown>,
  status = 200
) {
  return new Response(
    JSON.stringify(datos),
    {
      status,

      headers: {
        ...corsHeaders,

        "Content-Type":
          "application/json",
      },
    }
  );
}