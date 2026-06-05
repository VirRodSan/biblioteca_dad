// Expone el hook de acceso al context de autenticacion.

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook seguro para consumir AuthContext desde cualquier componente de la app.
export function useAuth() {
  const ctx = useContext(AuthContext);
  // El error ayuda a detectar componentes montados fuera de AuthProvider durante desarrollo.
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}



