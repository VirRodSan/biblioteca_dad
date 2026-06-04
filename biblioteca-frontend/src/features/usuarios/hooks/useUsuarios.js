// src/features/usuarios/hooks/useUsuarios.js
import { useCallback, useState } from "react";
import {
  fetchUsuarios,
  fetchUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  changeUsuarioRol_patch,
} from "../../../api/usuarios.api";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUsuarios = useCallback(async (query) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchUsuarios(query);
      setUsuarios(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsuario = useCallback(async (id) => {
    return fetchUsuarioById(id);
  }, []);

  const addUsuario = useCallback(async (payload) => {
    return createUsuario(payload);
  }, []);

  const editUsuario = useCallback(async (id, payload) => {
    return updateUsuario(id, payload);
  }, []);

  const removeUsuario = useCallback(async (id) => {
    return deleteUsuario(id);
  }, []);

  const changeRol = useCallback(async (id, rol) => {
    return changeUsuarioRol_patch(id, rol);
  }, []);

  return {
    usuarios,
    isLoading,
    error,
    loadUsuarios,
    getUsuario,
    addUsuario,
    editUsuario,
    removeUsuario,
    changeRol,
  };
}
