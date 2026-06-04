// src/api/libros.api.js
import { httpClient } from "./httpClient";

export function fetchLibros(query) {
  const path = query ? `/libros?q=${encodeURIComponent(query)}` : "/libros";
  return httpClient.get(path);
}

export function fetchLibroById(id) {
  return httpClient.get(`/libros/${id}`);
}

export function createLibro(payload) {
  return httpClient.post("/libros", payload);
}

export function updateLibro(id, payload) {
  return httpClient.put(`/libros/${id}`, payload);
}

export function deleteLibro(id) {
  return httpClient.del(`/libros/${id}`);
}