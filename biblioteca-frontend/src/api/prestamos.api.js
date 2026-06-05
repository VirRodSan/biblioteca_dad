// Agrupa las operaciones de API relacionadas con prestamos.

import { httpClient } from "./httpClient";

// Recupera todos los prestamos activos visibles para gestion.
export function fetchPrestamosActivos() {
  return httpClient.get("/prestamos/activos");
}

// Recupera los prestamos activos de un usuario concreto.
export function fetchPrestamosActivosByUsuario(usuarioId) {
  return httpClient.get(`/prestamos/usuario/${usuarioId}/activos`);
}

// Crea un prestamo vinculando usuario y libro seleccionados.
export function createPrestamo(payload) {
  return httpClient.post("/prestamos", payload);
}

// Marca un prestamo como devuelto en el backend.
export function devolverPrestamo(id) {
  return httpClient.put(`/prestamos/${id}/devolver`);
}



