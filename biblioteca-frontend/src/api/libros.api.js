// Agrupa las operaciones de API relacionadas con libros.
import { httpClient } from "./httpClient";

// Obtiene el listado de libros y aplica busqueda por query cuando existe texto.
export function fetchLibros(query) {
  const path = query ? `/libros?q=${encodeURIComponent(query)}` : "/libros";
  return httpClient.get(path);
}

// Recupera un libro concreto para precargar formularios de edicion.
export function fetchLibroById(id) {
  return httpClient.get(`/libros/${id}`);
}

// Envia los datos del formulario para crear un nuevo libro.
export function createLibro(payload) {
  return httpClient.post("/libros", payload);
}

// Actualiza un libro existente manteniendo el id en la ruta.
export function updateLibro(id, payload) {
  return httpClient.put(`/libros/${id}`, payload);
}

// Elimina un libro desde la zona de gestion.
export function deleteLibro(id) {
  return httpClient.del(`/libros/${id}`);
}



