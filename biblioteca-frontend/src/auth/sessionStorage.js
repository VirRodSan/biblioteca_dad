// Lee y guarda la sesion del usuario en localStorage.

// Clave unica para guardar la sesion sin mezclarse con otros datos del navegador.
const SESSION_KEY = "biblioteca_session_v1";

// Recupera la sesion persistida al arrancar la app; si el JSON no es valido, evita romper la carga.
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

// Persiste la sesion completa para que el usuario siga autenticado al refrescar la pagina.
export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Elimina la sesion local durante el logout para cerrar el acceso en este navegador.
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}




