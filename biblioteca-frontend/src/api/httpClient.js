// src/api/httpClient.js
import { getSession } from "../auth/sessionStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

function buildUrl(path) {
  const base = String(BASE_URL).replace(/\/+$/, "");
  const p = String(path).startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function request(path, { method = "GET", body, token, headers } = {}) {
  const url = buildUrl(path);

  const finalHeaders = { ...(headers || {}) };

  // ✅ Solo Content-Type si hay body
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  // ✅ Auth (si lo usas)
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  // ✅ Header requerido por tu backend
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
    if (hasJson) {
      try {
        const data = await res.json();
        message = data?.message || data?.error || message;
      } catch {
        // Keep the generic HTTP message when the response body cannot be parsed.
      }
    } else {
      try {
        const text = await res.text();
        if (text) message = text;
      } catch {
        // Keep the generic HTTP message when the response body cannot be read.
      }
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return hasJson ? res.json() : res.text();
}

export const httpClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
