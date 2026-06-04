import { httpClient } from "./httpClient";

export function fetchPrestamosActivos() {
  return httpClient.get("/prestamos/activos");
}

export function fetchPrestamosActivosByUsuario(usuarioId) {
  return httpClient.get(`/prestamos/usuario/${usuarioId}/activos`);
}

export function createPrestamo(payload) {
  return httpClient.post("/prestamos", payload);
}

export function devolverPrestamo(id) {
  return httpClient.put(`/prestamos/${id}/devolver`);
}