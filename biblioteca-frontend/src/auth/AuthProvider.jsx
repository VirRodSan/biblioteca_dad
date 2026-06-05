// Mantiene la sesion activa y expone acciones de login, registro y logout.

import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getSession, setSession, clearSession } from "./sessionStorage";
import { loginRequest, registerRequest } from "../api/auth.api";

// Unifica el campo de rol porque el backend puede devolverlo como rol o como tipo.
function normalizeUsuario(usuario) {
  if (!usuario) return null;
  return {
    ...usuario,
    rol: usuario.rol || usuario.tipo,
  };
}

// Provider central de autenticacion: inicializa la sesion, expone el usuario y acciones globales.
export function AuthProvider({ children }) {
  // La lectura inicial viene de localStorage para mantener la sesion tras recargar la pagina.
  const [usuario, setUsuario] = useState(() => normalizeUsuario(getSession()?.usuario));
  const [isLoadingSession] = useState(false);

  // Autentica contra la API, guarda la sesion persistente y actualiza el context en memoria.
  async function login(credentials) {
    const loggedUser = normalizeUsuario(await loginRequest(credentials));

    const session = {
      usuario: loggedUser,
    };

    setSession(session);
    setUsuario(loggedUser);

    return loggedUser;
  }

  // El registro delega en la API; no inicia sesion automaticamente para separar ambos flujos.
  async function register(payload) {
    return registerRequest(payload);
  }

  // Cierra la sesion en memoria y tambien borra la copia persistida en localStorage.
  function logout() {
    clearSession();
    setUsuario(null);
  }

  // useMemo evita recrear el value del context salvo cuando cambia el usuario o la carga.
  const value = useMemo(
    () => ({
      usuario,
      isAuthenticated: Boolean(usuario),
      isLoadingSession,
      login,
      register,
      logout,
    }),
    [usuario, isLoadingSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}




