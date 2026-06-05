// Centraliza las llamadas HTTP y el manejo comun de respuestas de la API.

import { getSession } from "../auth/sessionStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

// Normaliza base y path para evitar dobles barras al construir la URL final.
function buildUrl(path) {
  const base = String(BASE_URL).replace(/\/+$/, "");
  const p = String(path).startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

// Punto unico de comunicacion con el backend: prepara headers, serializa body y traduce errores HTTP.
async function request(path, { method = "GET", body, token, headers } = {}) {
  const url = buildUrl(path);

  const finalHeaders = { ...(headers || {}) };

  // Cuando hay body se envia JSON, que es el formato esperado por la API del proyecto.
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  // Permite adjuntar token Bearer si en el futuro el backend activa autenticacion por JWT.
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  // El backend usa el id de usuario para resolver acciones dependientes de la sesion actual.
  const session = getSession();
  const userId = session?.usuario?.id;
  if (userId != null) finalHeaders["X-User-Id"] = String(userId);

  console.log("[HTTP]", method, url);

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = `Error HTTP ${res.status}`;
    // Intenta mostrar el mensaje real del backend antes de lanzar el error al componente.
    if (hasJson) {
      try {
        const data = await res.json();
        message = data?.message || data?.error || message;
      } catch {
        // Si la respuesta JSON falla, se mantiene el mensaje HTTP generico.
      }
    } else {
      try {
        const text = await res.text();
        if (text) message = text;
      } catch {
        // Si tampoco se puede leer texto, se mantiene el mensaje HTTP generico.
      }
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  // Las respuestas 204 no traen cuerpo, por eso se devuelven como null.
  if (res.status === 204) return null;
  return hasJson ? res.json() : res.text();
}

// Fachada sencilla para que el resto del frontend no repita fetch ni configuracion HTTP.
export const httpClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};




