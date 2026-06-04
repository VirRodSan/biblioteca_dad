# Biblioteca IES - Backend

Backend REST para la aplicacion de gestion de biblioteca escolar. Esta desarrollado con Spring Boot y expone endpoints para autenticacion, libros, usuarios y prestamos.

## Tecnologias

- Java 17
- Spring Boot 3.4.9
- Spring Web
- Spring Data JPA
- Spring Validation
- MySQL Connector
- Maven Wrapper

## Requisitos

- Java 17
- MySQL
- Maven o Maven Wrapper
- Base de datos `biblioteca`

## Configuracion

La configuracion principal esta en:

```text
src/main/resources/application.properties
```

Configuracion actual:

```properties
spring.application.name=biblioteca
spring.datasource.url=jdbc:mysql://localhost:3306/biblioteca?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8081
```

La API queda disponible en:

```text
http://localhost:8081/api
```

## Instalacion y ejecucion

En Windows:

```bash
mvnw.cmd spring-boot:run
```

Si Maven esta instalado globalmente:

```bash
mvn spring-boot:run
```

## Compilacion

```bash
mvnw.cmd compile
```

## Tests

```bash
mvnw.cmd test
```

## Estructura del proyecto

```text
src/main/java/es/app/biblioteca/
  config/          configuracion CORS
  controller/      controladores REST
  dto/             objetos de entrada/salida
  exception/       manejo de errores
  model/           entidades JPA
  repository/      repositorios Spring Data
  service/         logica de negocio y autorizacion
```

## Modelos principales

### Usuario

Entidad que representa a una persona del sistema.

Campos principales:

- `id`
- `dni`
- `nombre`
- `apellidos`
- `email`
- `password`
- `tipo`
- `curso`
- `departamento`
- `puesto`

Roles posibles:

- `BIBLIOTECARIO`
- `DOCENTE`
- `ALUMNO`

### Libro

Entidad que representa un libro del catalogo.

Campos principales:

- `id`
- `isbn`
- `titulo`
- `autor`
- `editorial`
- `anioPublicacion`
- `ejemplaresTotales`
- `ejemplaresDisponibles`

### Prestamo

Entidad que representa el prestamo de un libro.

Campos principales:

- `id`
- `fechaPrestamo`
- `fechaDevolucion`
- `devuelto`
- `usuario`
- `creado`
- `libro`

## Autenticacion

El backend no usa JWT. La autorizacion se realiza con el header:

```http
X-User-Id: 1
```

El frontend guarda el usuario en LocalStorage y envia este header en cada peticion autenticada.

## Endpoints

Todos los endpoints empiezan por:

```text
/api
```

## Auth

Base:

```text
/api/auth
```

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| POST | `/login` | Iniciar sesion |
| POST | `/register` | Registrar usuario basico |

### POST `/api/auth/login`

Body:

```json
{
  "email": "usuario@ies.test",
  "password": "1234"
}
```

Respuesta:

```json
{
  "id": 1,
  "nombre": "Nombre",
  "apellidos": "Apellidos",
  "email": "usuario@ies.test",
  "tipo": "BIBLIOTECARIO",
  "rol": "BIBLIOTECARIO"
}
```

### POST `/api/auth/register`

Body:

```json
{
  "email": "nuevo@ies.test",
  "password": "1234"
}
```

El registro crea un usuario basico con rol `ALUMNO`.

## Libros

Base:

```text
/api/libros
```

| Metodo | Endpoint | Permiso | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/libros` | Usuario autenticado desde frontend | Listar libros |
| GET | `/api/libros?q=texto` | Usuario autenticado desde frontend | Buscar por titulo, autor, ISBN o editorial |
| GET | `/api/libros/{id}` | Usuario autenticado desde frontend | Obtener libro |
| POST | `/api/libros` | BIBLIOTECARIO | Crear libro |
| PUT | `/api/libros/{id}` | BIBLIOTECARIO | Actualizar libro |
| DELETE | `/api/libros/{id}` | BIBLIOTECARIO | Eliminar libro |

### Body de libro

```json
{
  "isbn": "9781234567890",
  "titulo": "El Quijote",
  "autor": "Miguel de Cervantes",
  "editorial": "Editorial",
  "anioPublicacion": 1605,
  "ejemplaresTotales": 5,
  "ejemplaresDisponibles": 3
}
```

## Usuarios

Base:

```text
/api/usuarios
```

| Metodo | Endpoint | Permiso | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/usuarios` | BIBLIOTECARIO, DOCENTE | Listar usuarios |
| GET | `/api/usuarios?q=texto` | BIBLIOTECARIO, DOCENTE | Buscar por DNI, nombre, apellidos o email |
| GET | `/api/usuarios/{id}` | BIBLIOTECARIO, DOCENTE | Obtener usuario |
| POST | `/api/usuarios` | BIBLIOTECARIO | Crear usuario |
| PATCH | `/api/usuarios/{id}` | BIBLIOTECARIO | Actualizar usuario |
| PUT | `/api/usuarios/{id}` | BIBLIOTECARIO | Alias de actualizacion |
| DELETE | `/api/usuarios/{id}` | BIBLIOTECARIO | Eliminar usuario |
| PATCH | `/api/usuarios/{id}/rol` | BIBLIOTECARIO | Cambiar rol |

### Crear usuario

```json
{
  "dni": "12345678A",
  "nombre": "Ana",
  "apellidos": "Garcia Lopez",
  "email": "ana@ies.test",
  "tipo": "ALUMNO",
  "curso": "1 ESO",
  "departamento": null,
  "puesto": null
}
```

Al crear un usuario desde el servicio, la password inicial se asigna con el DNI.

### Actualizar usuario

```json
{
  "dni": "12345678A",
  "nombre": "Ana",
  "apellidos": "Garcia Lopez",
  "email": "ana@ies.test",
  "curso": "2 ESO",
  "departamento": null,
  "puesto": null
}
```

### Cambiar rol

```json
{
  "tipo": "DOCENTE"
}
```

## Prestamos

Base:

```text
/api/prestamos
```

| Metodo | Endpoint | Permiso | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/prestamos` | Sin restriccion explicita en controller | Listar todos |
| GET | `/api/prestamos/activos` | BIBLIOTECARIO, DOCENTE | Listar prestamos activos |
| GET | `/api/prestamos/usuario/{usuarioId}/activos` | BIBLIOTECARIO, DOCENTE o el propio ALUMNO | Listar prestamos activos de un usuario |
| POST | `/api/prestamos` | BIBLIOTECARIO, DOCENTE | Crear prestamo |
| POST | `/api/prestamos/{id}/devolver` | BIBLIOTECARIO, DOCENTE | Devolver prestamo |
| PUT | `/api/prestamos/{id}/devolver` | BIBLIOTECARIO, DOCENTE | Alias para devolver prestamo |

### Crear prestamo

```json
{
  "usuarioId": 3,
  "libroId": 8,
  "diasPrestamo": 14
}
```

Reglas principales:

- Un bibliotecario puede crear prestamos.
- Un docente puede crear prestamos segun las reglas del servicio.
- Un alumno no puede crear prestamos.
- Si no hay ejemplares disponibles, se devuelve error.
- Al crear el prestamo se resta un ejemplar disponible.

### Respuesta de prestamo

```json
{
  "id": 1,
  "fechaPrestamo": "2026-06-01",
  "fechaDevolucion": "2026-06-15",
  "devuelto": false,
  "usuarioId": 3,
  "usuarioNombre": "Alumno Ejemplo",
  "libroId": 8,
  "libroTitulo": "El Quijote",
  "libroAutor": "Miguel de Cervantes",
  "creadoPorId": 1,
  "creadoPorNombre": "Bibliotecario Demo"
}
```

El frontend usa `fechaDevolucion` para avisar si el prestamo esta atrasado.

## Autorizacion por rol

La autorizacion esta centralizada en:

```text
src/main/java/es/app/biblioteca/service/AuthzService.java
```

Metodos principales:

- `requireUser`
- `requireBibliotecario`
- `requireBibliotecarioOrDocente`

Para consultar prestamos de alumno, el controller permite que el alumno acceda solo a sus propios prestamos.

## Busquedas y filtros

### Libros

Parametro:

```text
q
```

Busca en:

- titulo
- autor
- ISBN
- editorial

### Usuarios

Parametro:

```text
q
```

Busca en:

- nombre
- apellidos
- email
- DNI

### Prestamos

Filtros disponibles:

- prestamos activos globales: `/api/prestamos/activos`
- prestamos activos por usuario: `/api/prestamos/usuario/{usuarioId}/activos`

## CORS

La configuracion CORS esta en:

```text
src/main/java/es/app/biblioteca/config/CorsConfig.java
```

Debe permitir el origen del frontend, normalmente:

```text
http://localhost:5173
```

## Manejo de errores

El proyecto incluye manejadores globales:

```text
exception/ApiExceptionHandler.java
exception/GlobalExceptionHandler.java
```

Devuelven errores HTTP adecuados para casos como:

- No autorizado.
- Sin permisos.
- Recurso no encontrado.
- Conflictos de datos.
- Validaciones incorrectas.

## Comprobaciones recomendadas

```bash
mvnw.cmd compile
mvnw.cmd test
```

Si hay problemas con el wrapper en Windows, usar Maven instalado globalmente:

```bash
mvn compile
mvn test
```

## Relacion con el frontend

El frontend espera:

- API base en `http://localhost:8081/api`.
- Header `X-User-Id` para permisos.
- Roles con los nombres exactos:
  - `BIBLIOTECARIO`
  - `DOCENTE`
  - `ALUMNO`
- Login devolviendo `tipo` y/o `rol`.
- Prestamos devolviendo `libroTitulo`, `libroAutor` y `fechaDevolucion`.

