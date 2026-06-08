import { supabase } from "../lib/supabase";

/**
 * Obtiene el perfil asociado al usuario autenticado.
 *
 * Si no hay usuario en la sesion actual devuelve null.
 */
export async function getPerfilActual() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Lista usuarios que pueden recibir prestamos.
 *
 * Se limita a alumnos y docentes porque el bibliotecario gestiona el prestamo,
 * pero normalmente no aparece como destinatario.
 */
export async function getUsuariosPrestamo() {
  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .in("rol", ["ALUMNO", "DOCENTE"])
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
