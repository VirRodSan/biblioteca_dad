// Agrupa las operaciones de API relacionadas con usuarios.
import { httpClient } from "./httpClient";

// Obtiene usuarios y permite filtrar por texto desde buscadores o listados.
export function fetchUsuarios(query) {
  const path = query ? `/usuarios?q=${encodeURIComponent(query)}` : "/usuarios";
  return httpClient.get(path);
}

// Recupera un usuario concreto para cargar sus datos en edicion.
export function fetchUsuarioById(id) {
  return httpClient.get(`/usuarios/${id}`);
}

// Envia a la API los datos necesarios para crear un usuario.
export function createUsuario(payload) {
  return httpClient.post("/usuarios", payload);
}

// Modifica parcialmente los datos de un usuario existente.
export function updateUsuario(id, payload) {
  return httpClient.patch(`/usuarios/${id}`, payload);
}

// Borra un usuario desde la administracion.
export function deleteUsuario(id) {
  return httpClient.del(`/usuarios/${id}`);
}


// Cambia solo el rol/tipo del usuario sin enviar el resto del formulario.
export function changeUsuarioRol_patch(id, rol) {
  return httpClient.patch(`/usuarios/${id}/rol`, { tipo: rol });
}




