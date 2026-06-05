// Protege rutas segun autenticacion y roles permitidos.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

// Comprueba autenticacion y, si se reciben roles, tambien valida permisos de acceso.
export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoadingSession, usuario } = useAuth();
  const location = useLocation();

  // Mientras se inicializa la sesion no se renderiza nada para evitar redirecciones visuales falsas.
  if (isLoadingSession) return null;

  // Si no hay usuario autenticado, envia al login conservando la ruta original en state.
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const rol = usuario?.rol;
    const isAllowed = allowedRoles.includes(rol);
    // Un usuario autenticado sin rol permitido vuelve al inicio en lugar de ver la pantalla privada.
    if (!isAllowed) return <Navigate to="/" replace />;
  }

  return <Outlet />;
}



