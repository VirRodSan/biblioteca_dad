import { supabase } from '../lib/supabase';

/**
 * Inicia sesion con email y password mediante Supabase Auth.
 *
 * Devuelve los datos de autenticacion de Supabase o lanza un Error con el
 * mensaje original para que la pantalla lo pueda mostrar.
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Cierra la sesion activa en Supabase.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Recupera la sesion guardada, si existe.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}
