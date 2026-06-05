// Hook que encapsula la carga, creacion y devolucion de prestamos.

import { useCallback, useState } from "react";
import {
  fetchPrestamosActivos,
  fetchPrestamosActivosByUsuario,
  createPrestamo,
  devolverPrestamo,
} from "../../../api/prestamos.api";

// Hook de prestamos: centraliza carga, errores y acciones de prestamo/devolucion.
export function usePrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Vista de administracion: carga todos los prestamos que siguen activos.
  const loadTodosPrestamosActivos = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchPrestamosActivos();
      setPrestamos(data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar todos los prestamos activos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Vista de usuario: antes de llamar a la API comprueba que exista un usuario seleccionado.
  const loadPrestamosActivos = useCallback(async (usuarioId) => {
    if (!usuarioId) {
      setPrestamos([]);
      setError("No se ha indicado el usuario.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchPrestamosActivosByUsuario(usuarioId);
      setPrestamos(data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los prestamos activos del usuario");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Convierte IDs y dias a numero porque los formularios los entregan como texto.
  const addPrestamo = useCallback(async ({ usuarioId, libroId, diasPrestamo }) => {
    const payload = {
      usuarioId: Number(usuarioId),
      libroId: Number(libroId),
    };

    if (diasPrestamo !== undefined && diasPrestamo !== "") {
      payload.diasPrestamo = Number(diasPrestamo);
    }

    return createPrestamo(payload);
  }, []);

  // Devuelve el prestamo mediante la API y deja que la pagina decida si recarga el listado.
  const returnPrestamo = useCallback(async (id) => {
    return devolverPrestamo(id);
  }, []);

  return {
    prestamos,
    isLoading,
    error,
    loadTodosPrestamosActivos,
    loadPrestamosActivos,
    addPrestamo,
    returnPrestamo,
  };
}



