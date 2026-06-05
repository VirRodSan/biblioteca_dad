// Hook que encapsula la carga y modificacion de libros.
import { useCallback, useState } from "react";
import {
  fetchLibros,
  fetchLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} from "../../../api/libros.api";

// Hook de datos de libros: guarda listado, loading y error para que las paginas no repitan esta logica.
export function useLibros() {
  const [libros, setLibros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga libros desde la API y opcionalmente aplica busqueda por texto.
  const loadLibros = useCallback(async (query) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchLibros(query);
      setLibros(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtiene un libro puntual sin alterar el listado cargado en pantalla.
  const getLibro = useCallback(async (id) => {
    return fetchLibroById(id);
  }, []);

  // Operaciones CRUD delegadas en la capa API para mantener el hook como fachada de datos.
  const addLibro = useCallback(async (payload) => {
    return createLibro(payload);
  }, []);

  const editLibro = useCallback(async (id, payload) => {
    return updateLibro(id, payload);
  }, []);

  const removeLibro = useCallback(async (id) => {
    return deleteLibro(id);
  }, []);

  return {
    libros,
    isLoading,
    error,
    loadLibros,
    getLibro,
    addLibro,
    editLibro,
    removeLibro,
  };
}



