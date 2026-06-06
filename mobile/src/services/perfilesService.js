import { supabase } from "../lib/supabase";

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