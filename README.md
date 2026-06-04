# Biblioteca IES - Frontend

Frontend de la aplicacion de gestion de biblioteca escolar. Esta desarrollado con React y Vite, consume una API REST Spring Boot y ofrece una interfaz responsive con rutas protegidas por rol.

## Tecnologias

- React 18
- Vite
- React Router DOM 6
- CSS Modules
- CSS global
- Fetch API
- LocalStorage para persistencia de sesion

## Requisitos

- Node.js instalado
- npm instalado
- Backend ejecutandose en `http://localhost:8081/api`

## Instalacion

```bash
npm install
```

## Ejecucion en desarrollo

```bash
npm run dev
```

La aplicacion se abre normalmente en:

```text
http://localhost:5173
```

## Build de produccion

```bash
npm run build
```

El resultado se genera en la carpeta:

```text
dist/
```

## Vista previa del build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Variables de entorno

Crear un archivo `.env` si se necesita cambiar la URL del backend:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

La aplicacion tambien permite modo demo de autenticacion:

```env
VITE_AUTH_MODE=mock
```

Usuarios disponibles en modo mock:

| Rol | Email | Password |
| --- | --- | --- |
| BIBLIOTECARIO | biblio@ies.test | 1234 |
| DOCENTE | docente@ies.test | 1234 |
| ALUMNO | alumno@ies.test | 1234 |

## Estructura del proyecto

```text
src/
  api/              llamadas a la API REST
  app/              configuracion principal, router y providers
  auth/             AuthContext, roles, rutas protegidas y persistencia
  features/         logica y componentes por dominio
  layouts/          Navbar, Sidebar y AppLayout
  pages/            pantallas principales
  styles/           estilos globales
  ui/               componentes reutilizables
```

## Componentes reutilizables

La carpeta `src/ui` contiene componentes comunes:

- `Button`
- `Card`
- `Input`
- `Select`
- `Table`
- `Modal`
- `Field`
- `ErrorText`

Estos componentes se usan en catalogo, usuarios, prestamos, login y registro para mantener una interfaz coherente.

## Rutas publicas

| Ruta | Pantalla |
| --- | --- |
| `/login` | Inicio de sesion |
| `/register` | Registro |

## Rutas protegidas

Todas las rutas internas requieren sesion activa.

| Ruta | Roles permitidos | Descripcion |
| --- | --- | --- |
| `/` | BIBLIOTECARIO, DOCENTE, ALUMNO | Panel principal |
| `/libros` | BIBLIOTECARIO, DOCENTE, ALUMNO | Catalogo |
| `/gestion-libros` | BIBLIOTECARIO | Gestion de libros |
| `/gestion-libros/crear` | BIBLIOTECARIO | Crear libro |
| `/gestion-libros/:id/editar` | BIBLIOTECARIO | Editar libro |
| `/usuarios` | BIBLIOTECARIO | Gestion de usuarios |
| `/usuarios/crear` | BIBLIOTECARIO | Crear usuario |
| `/usuarios/:id/editar` | BIBLIOTECARIO | Editar usuario |
| `/prestamos/activos` | BIBLIOTECARIO, DOCENTE, ALUMNO | Prestamos activos |
| `/prestamos/nuevo` | BIBLIOTECARIO, DOCENTE | Crear prestamo |

## Roles

La aplicacion usa tres roles:

- `BIBLIOTECARIO`
- `DOCENTE`
- `ALUMNO`

### BIBLIOTECARIO

Puede:

- Consultar catalogo.
- Gestionar libros.
- Gestionar usuarios.
- Consultar prestamos activos.
- Crear prestamos.
- Registrar devoluciones.
- Cambiar roles de usuarios.

### DOCENTE

Puede:

- Consultar catalogo.
- Consultar prestamos activos asociados.
- Crear prestamos segun reglas del backend.
- Registrar devoluciones segun permisos del backend.

### ALUMNO

Puede:

- Consultar catalogo.
- Ver sus prestamos activos.
- Ver nombre del libro, autor y fecha de devolucion.
- Ver aviso de estado: `En plazo` o `Atrasado`.

## Autenticacion y persistencia

La autenticacion se gestiona con:

```text
src/auth/AuthProvider.jsx
src/auth/AuthContext.jsx
src/auth/useAuth.js
src/auth/sessionStorage.js
```

La sesion se guarda en LocalStorage con la clave:

```text
biblioteca_session_v1
```

Al iniciar la aplicacion se lee esta sesion para mantener al usuario conectado. Al cerrar sesion se elimina.

El backend devuelve `tipo` y/o `rol`; el frontend normaliza ambos campos para trabajar internamente con `usuario.rol`.

## API consumida

La URL base por defecto es:

```text
http://localhost:8081/api
```

### Autenticacion

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| POST | `/auth/login` | Iniciar sesion |
| POST | `/auth/register` | Registrar usuario |

### Libros

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| GET | `/libros` | Listar libros |
| GET | `/libros?q=texto` | Buscar libros |
| GET | `/libros/{id}` | Obtener libro |
| POST | `/libros` | Crear libro |
| PUT | `/libros/{id}` | Actualizar libro |
| DELETE | `/libros/{id}` | Eliminar libro |

### Usuarios

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| GET | `/usuarios` | Listar usuarios |
| GET | `/usuarios?q=texto` | Buscar usuarios |
| GET | `/usuarios/{id}` | Obtener usuario |
| POST | `/usuarios` | Crear usuario |
| PATCH | `/usuarios/{id}` | Actualizar usuario |
| DELETE | `/usuarios/{id}` | Eliminar usuario |
| PATCH | `/usuarios/{id}/rol` | Cambiar rol |

### Prestamos

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| GET | `/prestamos/activos` | Listar prestamos activos |
| GET | `/prestamos/usuario/{usuarioId}/activos` | Listar prestamos activos de usuario |
| POST | `/prestamos` | Crear prestamo |
| PUT | `/prestamos/{id}/devolver` | Devolver prestamo |

## Formularios

La aplicacion incluye formularios funcionales:

- Login.
- Registro.
- Crear libro.
- Editar libro.
- Crear usuario.
- Editar usuario.
- Crear prestamo.

Validaciones principales:

- Email obligatorio en login y registro.
- Password obligatorio en login y registro.
- Titulo, autor e ISBN obligatorios en libro.
- DNI, nombre y email obligatorios en usuario.
- Usuario, libro y dias de prestamo obligatorios en prestamo.

## Navegacion

La interfaz incluye:

- Cabecera superior con usuario y cierre de sesion.
- Menu lateral en escritorio.
- Navegacion responsive en pantallas pequenas.
- Redireccion al login si no hay sesion.
- Redireccion al inicio si el rol no tiene permiso.

## Prestamos del alumno

El alumno puede entrar en `Mis prestamos` desde el panel principal o desde el menu `Prestamos > Activos`.

En esta pantalla ve:

- Libro.
- Autor.
- Fecha de prestamo.
- Fecha de devolucion.
- Estado:
  - `En plazo`
  - `Atrasado`

El estado se calcula comparando la fecha de devolucion con la fecha actual.

## Estilos

Se usan:

- CSS Modules por componente.
- `src/styles/globals.css` para variables, layout comun y clases reutilizables.

El diseño esta adaptado al estilo visual de Figma con:

- Tarjetas.
- Tablas.
- Badges de estado.
- Estados vacios.
- Mensajes de error y exito.
- Layout responsive.


