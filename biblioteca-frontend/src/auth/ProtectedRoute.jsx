// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoadingSession, usuario } = useAuth();
  const location = useLocation();

  if (isLoadingSession) return null; // simple: no flashes
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const rol = usuario?.rol;
    const isAllowed = allowedRoles.includes(rol);
    if (!isAllowed) return <Navigate to="/" replace />;
  }

  return <Outlet />;
}