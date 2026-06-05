// Hook que encapsula la carga y modificacion de usuarios.
import { useCallback, useState } from "react";
import {
  fetchUsuarios,
  fetchUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  changeUsuarioRol_patch,
} from "../../../api/usuarios.api";

// Hook de datos de usuarios: expone listado, carga, errores y operaciones de administracion.
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga usuarios desde la API y aplica filtro cuando la pagina envia una busqueda.
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

  // Recupera un usuario puntual para editar sin reemplazar el listado actual.
  const getUsuario = useCallback(async (id) => {
    return fetchUsuarioById(id);
  }, []);

  // Crea usuarios desde formularios de administracion.
  const addUsuario = useCallback(async (payload) => {
    return createUsuario(payload);
  }, []);

  // Actualiza datos generales del usuario.
  const editUsuario = useCallback(async (id, payload) => {
    return updateUsuario(id, payload);
  }, []);

  // Elimina usuarios desde la tabla de gestion.
  const removeUsuario = useCallback(async (id) => {
    return deleteUsuario(id);
  }, []);

  // Cambia solo el rol para no enviar campos que no han sido modificados.
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




