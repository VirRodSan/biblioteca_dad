// Agrupa los providers globales que envuelven la aplicacion.

import { AuthProvider } from "../auth/AuthProvider";

// Componente que renderiza esta parte de la interfaz.
export function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}



