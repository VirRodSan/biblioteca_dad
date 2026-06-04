// src/api/usuarios.api.js
import { httpClient } from "./httpClient";

export function fetchUsuarios(query) {
  const path = query ? `/usuarios?q=${encodeURIComponent(query)}` : "/usuarios";
  return httpClient.get(path);
}

export function fetchUsuarioById(id) {
  return httpClient.get(`/usuarios/${id}`);
}

export function createUsuario(payload) {
  return httpClient.post("/usuarios", payload);
}

export function updateUsuario(id, payload) {
  return httpClient.patch(`/usuarios/${id}`, payload);
}

export function deleteUsuario(id) {
  return httpClient.del(`/usuarios/${id}`);
}


export function changeUsuarioRol_patch(id, rol) {
  return httpClient.patch(`/usuarios/${id}/rol`, { tipo: rol });
}
