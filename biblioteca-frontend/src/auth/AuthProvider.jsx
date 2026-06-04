import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getSession, setSession, clearSession } from "./sessionStorage";
import { loginRequest, registerRequest } from "../api/auth.api";

function normalizeUsuario(usuario) {
  if (!usuario) return null;
  return {
    ...usuario,
    rol: usuario.rol || usuario.tipo,
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => normalizeUsuario(getSession()?.usuario));
  const [isLoadingSession] = useState(false);

  async function login(credentials) {
    const loggedUser = normalizeUsuario(await loginRequest(credentials));

    const session = {
      usuario: loggedUser,
    };

    setSession(session);
    setUsuario(loggedUser);

    return loggedUser;
  }

  async function register(payload) {
    return registerRequest(payload);
  }

  function logout() {
    clearSession();
    setUsuario(null);
  }

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
