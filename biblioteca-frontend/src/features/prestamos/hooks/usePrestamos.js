import { useCallback, useState } from "react";
import {
  fetchPrestamosActivos,
  fetchPrestamosActivosByUsuario,
  createPrestamo,
  devolverPrestamo,
} from "../../../api/prestamos.api";

export function usePrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTodosPrestamosActivos = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchPrestamosActivos();
      setPrestamos(data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar todos los préstamos activos");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      setError(err.message || "No se pudieron cargar los préstamos activos del usuario");
    } finally {
      setIsLoading(false);
    }
  }, []);

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