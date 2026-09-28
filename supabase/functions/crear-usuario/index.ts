import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

// =========================================================
// CORS
// =========================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

// =========================================================
// FUNCIÓN PRINCIPAL
// =========================================================

Deno.serve(async (req: Request) => {
  // -------------------------------------------------------
  // PRE-FLIGHT CORS
  // -------------------------------------------------------

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // -----------------------------------------------------
    // VALIDAR MÉTODO
    // -----------------------------------------------------

    if (req.method !== "POST") {
      return responder(
        {
          error: "Método no permitido.",
        },
        405
      );
    }

    // -----------------------------------------------------
    // VARIABLES DE SUPABASE
    // -----------------------------------------------------

    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY");

    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      return responder(
        {
          error:
            "Faltan variables de entorno de Supabase.",
        },
        500
      );
    }

    // -----------------------------------------------------
    // OBTENER SESIÓN DEL ADMINISTRADOR
    // -----------------------------------------------------

    const authHeader =
      req.headers.get("Authorization");

    if (!authHeader) {
      return responder(
        {
          error:
            "No se encontró la sesión del usuario.",
        },
        401
      );
    }

    // Cliente usando la sesión del usuario actual
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

    // -----------------------------------------------------
    // CLIENTE ADMINISTRADOR
    // -----------------------------------------------------

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // -----------------------------------------------------
    // OBTENER PERFIL DEL USUARIO ACTUAL
    // -----------------------------------------------------

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

    if (
      perfilActualError ||
      !usuarioActual
    ) {
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

    // -----------------------------------------------------
    // OBTENER NOMBRE DEL ROL
    // -----------------------------------------------------

    const rolActual =
      Array.isArray(usuarioActual.roles)
        ? usuarioActual.roles[0]?.nombre
        : usuarioActual.roles?.nombre;

    // -----------------------------------------------------
    // VALIDAR ADMINISTRADOR
    // -----------------------------------------------------

    if (rolActual !== "ADMINISTRADOR") {
      return responder(
        {
          error:
            "No tienes permisos para crear usuarios.",
        },
        403
      );
    }

    // -----------------------------------------------------
    // LEER BODY
    // -----------------------------------------------------

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

    const telefono =
      typeof body?.telefono === "string"
        ? body.telefono.trim()
        : "";

    const codigo_profesional =
      typeof body?.codigo_profesional === "string"
        ? body.codigo_profesional.trim()
        : "";

    const codigo_minsa =
      typeof body?.codigo_minsa === "string"
        ? body.codigo_minsa.trim()
        : "";

    const id_rol =
      typeof body?.id_rol === "string"
        ? body.id_rol.trim()
        : "";

    const id_especialidad =
      typeof body?.id_especialidad === "string"
        ? body.id_especialidad.trim()
        : "";

    // -----------------------------------------------------
    // VALIDACIONES BÁSICAS
    // -----------------------------------------------------

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
            "Todos los campos obligatorios deben completarse.",
        },
        400
      );
    }

    // -----------------------------------------------------
    // VALIDAR CONTRASEÑA
    // -----------------------------------------------------

    const tieneLongitudValida = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneCaracterEspecial = /[^A-Za-z0-9]/.test(password);

    if (
      !tieneLongitudValida ||
      !tieneMayuscula ||
      !tieneMinuscula ||
      !tieneNumero ||
      !tieneCaracterEspecial
    ) {
      return responder(
        {
          error:
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (#, !, @, $, %).",
        },
        400
      );
    }

    // -----------------------------------------------------
    // NORMALIZAR CORREO
    // -----------------------------------------------------

    const emailNormalizado =
      email.toLowerCase();

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailNormalizado
      );

    if (!emailValido) {
      return responder(
        {
          error:
            "El correo electrónico no es válido.",
        },
        400
      );
    }

    // -----------------------------------------------------
    // BUSCAR ROL
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // NO PERMITIR CREAR ADMINISTRADORES
    // -----------------------------------------------------

    if (rol.nombre === "ADMINISTRADOR") {
      return responder(
        {
          error:
            "No se pueden crear administradores desde este módulo.",
        },
        403
      );
    }

    // -----------------------------------------------------
    // VALIDAR ESPECIALISTA
    // -----------------------------------------------------

    const esEspecialista =
      rol.nombre === "ESPECIALISTA";

    if (
      esEspecialista &&
      !id_especialidad
    ) {
      return responder(
        {
          error:
            "Debe seleccionar una especialidad para el especialista.",
        },
        400
      );
    }

    // -----------------------------------------------------
    // BUSCAR ESPECIALIDAD
    // -----------------------------------------------------

    let especialidad = null;

    if (esEspecialista) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("especialidades")
        .select(
          "id_especialidad, nombre, activo"
        )
        .eq(
          "id_especialidad",
          id_especialidad
        )
        .single();

      if (error || !data) {
        console.error(
          "Error buscando especialidad:",
          error
        );

        return responder(
          {
            error:
              "La especialidad seleccionada no existe.",
          },
          400
        );
      }

      if (!data.activo) {
        return responder(
          {
            error:
              "La especialidad seleccionada está inactiva.",
          },
          400
        );
      }

      especialidad = data;
    }

    // -----------------------------------------------------
    // CREAR USUARIO EN AUTH
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // ESPERAR TRIGGER
    // -----------------------------------------------------
    //
    // Tu proyecto ya tiene un trigger que crea
    // public.usuarios cuando se crea auth.users.
    //
    // NO hacemos INSERT manual en usuarios.
    // -----------------------------------------------------

    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    // -----------------------------------------------------
    // VERIFICAR PERFIL
    // -----------------------------------------------------

    const {
      data: perfilExistente,
      error: perfilConsultaError,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id_usuario")
      .eq(
        "id_usuario",
        nuevoUsuarioId
      )
      .maybeSingle();

    if (
      perfilConsultaError ||
      !perfilExistente
    ) {
      console.error(
        "Error verificando perfil:",
        perfilConsultaError
      );

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

    // -----------------------------------------------------
    // ACTUALIZAR USUARIO
    // -----------------------------------------------------

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
          telefono:
            telefono || null,
          activo: true,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id_usuario",
          nuevoUsuarioId
        )
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

    if (
      perfilUpdateError ||
      !perfil
    ) {
      console.error(
        "Error actualizando perfil:",
        perfilUpdateError
      );

      // Eliminar primero public.usuarios
      await supabaseAdmin
        .from("usuarios")
        .delete()
        .eq(
          "id_usuario",
          nuevoUsuarioId
        );

      // Luego eliminar Auth
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

    // -----------------------------------------------------
    // OBTENER NOMBRE DEL ROL
    // -----------------------------------------------------

    const nombreRol =
      Array.isArray(perfil.roles)
        ? perfil.roles[0]?.nombre
        : perfil.roles?.nombre;

    // =====================================================
    // CREAR ESPECIALISTA
    // =====================================================

    let especialistaCreado = null;

    if (esEspecialista) {
      // ---------------------------------------------------
      // GENERAR CÓDIGO PROFESIONAL
      // ---------------------------------------------------

      const anio =
        new Date().getFullYear();

      const prefijo =
        `ESP-${anio}-`;

      const {
        data: ultimoEspecialista,
        error:
          codigoConsultaError,
      } = await supabaseAdmin
        .from("especialistas")
        .select(
          "codigo_profesional"
        )
        .like(
          "codigo_profesional",
          `${prefijo}%`
        )
        .order(
          "codigo_profesional",
          {
            ascending: false,
          }
        )
        .limit(1);

      if (codigoConsultaError) {
        console.error(
          "Error consultando códigos:",
          codigoConsultaError
        );

        // Rollback
        await supabaseAdmin
          .from("usuarios")
          .delete()
          .eq(
            "id_usuario",
            nuevoUsuarioId
          );

        await supabaseAdmin.auth.admin.deleteUser(
          nuevoUsuarioId
        );

        return responder(
          {
            error:
              "No se pudo generar el código profesional.",
            detalle:
              codigoConsultaError.message,
          },
          500
        );
      }

      let siguiente = 1;

      if (
        ultimoEspecialista &&
        ultimoEspecialista.length > 0
      ) {
        const ultimoCodigo =
          ultimoEspecialista[0]
            .codigo_profesional;

        if (ultimoCodigo) {
          const numero =
            parseInt(
              ultimoCodigo.replace(
                prefijo,
                ""
              ),
              10
            );

          if (
            !Number.isNaN(numero)
          ) {
            siguiente =
              numero + 1;
          }
        }
      }

      const codigoProfesional =
        codigo_profesional ||
        `${prefijo}${String(
          siguiente
        ).padStart(3, "0")}`;

      // ---------------------------------------------------
      // CREAR REGISTRO ESPECIALISTA
      // ---------------------------------------------------

      const {
        data:
          nuevoEspecialista,
        error:
          especialistaError,
      } = await supabaseAdmin
        .from("especialistas")
        .insert({
          id_usuario:
            nuevoUsuarioId,

          id_especialidad:
            id_especialidad,

          nombres,

          apellidos,

          codigo_profesional:
            codigoProfesional,

          codigo_minsa:
            codigo_minsa || null,

          telefono:
            telefono || null,

          correo:
            emailNormalizado,

          activo: true,
        })
        .select(`
          id_especialista,
          id_usuario,
          id_especialidad,
          nombres,
          apellidos,
          codigo_profesional,
          codigo_minsa,
          telefono,
          correo,
          activo,
          created_at,
          updated_at,
          especialidades (
            id_especialidad,
            nombre,
            descripcion
          )
        `)
        .single();

      if (
        especialistaError ||
        !nuevoEspecialista
      ) {
        console.error(
          "Error creando especialista:",
          especialistaError
        );

        // -------------------------------------------------
        // ROLLBACK
        // -------------------------------------------------

        await supabaseAdmin
          .from("usuarios")
          .delete()
          .eq(
            "id_usuario",
            nuevoUsuarioId
          );

        await supabaseAdmin.auth.admin.deleteUser(
          nuevoUsuarioId
        );

        return responder(
          {
            error:
              "No se pudo crear el registro del especialista.",
            detalle:
              especialistaError?.message,
          },
          500
        );
      }

      especialistaCreado =
        nuevoEspecialista;
    }

    // =====================================================
    // RESPUESTA
    // =====================================================

    return responder(
      {
        success: true,

        mensaje:
          esEspecialista
            ? "Especialista registrado correctamente."
            : "Usuario creado correctamente.",

        usuario: {
          id:
            perfil.id_usuario,

          nombres:
            perfil.nombres,

          apellidos:
            perfil.apellidos,

          email:
            emailNormalizado,

          telefono:
            perfil.telefono,

          rol:
            nombreRol,

          activo:
            perfil.activo,
        },

        especialista:
          especialistaCreado,
      },
      200
    );

  } catch (error) {
    // =====================================================
    // ERROR GENERAL
    // =====================================================

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

// =========================================================
// RESPONDER
// =========================================================

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