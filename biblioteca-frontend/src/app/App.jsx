// Monta el router principal de la aplicacion.
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProviders } from "./providers";

// Componente que renderiza esta parte de la interfaz.
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}



