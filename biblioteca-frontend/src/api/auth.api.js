// Gestiona las peticiones de autenticacion y el modo mock de usuarios.

import { httpClient } from "./httpClient";

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE || "api";

// Usuarios locales para poder probar login sin backend cuando VITE_AUTH_MODE vale "mock".
const MOCK_USERS = [
  {
    id: 1,
    nombre: "Bibliotecario Demo",
    email: "biblio@ies.test",
    password: "1234",
    rol: "BIBLIOTECARIO",
  },
  {
    id: 2,
    nombre: "Docente Demo",
    email: "docente@ies.test",
    password: "1234",
    rol: "DOCENTE",
  },
  {
    id: 3,
    nombre: "Alumno Demo",
    email: "alumno@ies.test",
    password: "1234",
    rol: "ALUMNO",
  },
];

// Valida credenciales en modo mock o las envia al endpoint real de autenticacion.
export async function loginRequest({ email, password }) {
  if (AUTH_MODE === "mock") {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Credenciales incorrectas en modo demo.");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return httpClient.post("/auth/login", { email, password });
}

// Registra un usuario nuevo; en modo mock simula la respuesta que devolveria la API.
export async function registerRequest(payload) {
  if (AUTH_MODE === "mock") {
    return {
      id: Date.now(),
      ...payload,
      rol: payload.rol || "DOCENTE",
    };
  }

  return httpClient.post("/auth/register", payload);
}




