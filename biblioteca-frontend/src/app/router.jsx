// Define las rutas y los permisos de navegacion del frontend.

import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { ROLES } from "../auth/roles";

import { AppLayout } from "../layouts/AppLayout/AppLayout";

import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";

import { LibrosCatalogoPage } from "../pages/libros/LibrosCatalogoPage";
import { LibrosListPage } from "../pages/libros/LibrosListPage";
import { LibrosCreatePage } from "../pages/libros/LibrosCreatePage";
import { LibrosEditPage } from "../pages/libros/LibrosEditPage";

import { UsuariosListPage } from "../pages/usuarios/UsuariosListPage";
import { UsuarioCreatePage } from "../pages/usuarios/UsuariosCreatePage";
import { UsuarioEditPage } from "../pages/usuarios/UsuariosEditPage";

import { PrestamoActivePage } from "../pages/prestamos/PrestamoActivePage";
import { PrestamoCreatePage } from "../pages/prestamos/PrestamoCreatePage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // Todas las rutas hijas pasan primero por ProtectedRoute para exigir sesion iniciada.
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/libros", element: <LibrosCatalogoPage /> },
          {
            // Solo el bibliotecario puede crear, editar o borrar libros.
            element: <ProtectedRoute allowedRoles={[ROLES.BIBLIOTECARIO]} />,
            children: [
              { path: "/gestion-libros", element: <LibrosListPage /> },
              { path: "/gestion-libros/crear", element: <LibrosCreatePage /> },
              { path: "/gestion-libros/:id/editar", element: <LibrosEditPage /> },
            ],
          },
          {
            // La gestion de usuarios queda limitada al rol de bibliotecario.
            element: <ProtectedRoute allowedRoles={[ROLES.BIBLIOTECARIO]} />,
            children: [
              { path: "/usuarios", element: <UsuariosListPage /> },
              { path: "/usuarios/crear", element: <UsuarioCreatePage /> },
              { path: "/usuarios/:id/editar", element: <UsuarioEditPage /> },
            ],
          },
          {
            // Cualquier usuario autenticado puede consultar sus prestamos activos.
            element: <ProtectedRoute allowedRoles={[ROLES.BIBLIOTECARIO, ROLES.DOCENTE, ROLES.ALUMNO]} />,
            children: [
              { path: "/prestamos/activos", element: <PrestamoActivePage /> },
            ],
          },
          {
            // Los alumnos consultan prestamos, pero la creacion se limita a bibliotecario y docente.
            element: <ProtectedRoute allowedRoles={[ROLES.BIBLIOTECARIO, ROLES.DOCENTE]} />,
            children: [
              { path: "/prestamos/nuevo", element: <PrestamoCreatePage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);




