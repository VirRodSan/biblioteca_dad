// src/features/libros/hooks/useLibros.js
import { useCallback, useState } from "react";
import {
  fetchLibros,
  fetchLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} from "../../../api/libros.api";

export function useLibros() {
  const [libros, setLibros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const getLibro = useCallback(async (id) => {
    return fetchLibroById(id);
  }, []);

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