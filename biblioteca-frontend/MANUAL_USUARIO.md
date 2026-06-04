# Manual de usuario - Biblioteca IES

## 1. Acceso a la aplicacion

Al abrir la aplicacion se muestra la pantalla de login. El usuario debe introducir su email y contrasena para acceder.

Si no tiene cuenta, puede entrar en la pantalla de registro desde el enlace de la pantalla de login.

## 2. Registro

La pantalla de registro permite introducir:

- Nombre.
- Email.
- Contrasena.

Al enviar el formulario, la aplicacion valida que los campos obligatorios esten completos y que la contrasena tenga una longitud minima.

## 3. Panel principal

Tras iniciar sesion, el usuario entra en el panel principal. Este panel muestra accesos rapidos segun el rol activo:

- Catalogo.
- Prestamos activos.
- Nuevo prestamo.
- Gestion de libros.
- Usuarios.

Cada usuario solo ve las opciones permitidas para su rol.

## 4. Catalogo de libros

La pantalla de catalogo permite consultar los libros registrados en la biblioteca.

La tabla muestra informacion principal:

- ID.
- Titulo.
- Autor.
- ISBN.

Esta pantalla esta disponible para los usuarios autenticados.

## 5. Gestion de libros

Disponible para usuarios con rol `BIBLIOTECARIO`.

Desde esta seccion se puede:

- Ver el listado de libros.
- Crear un nuevo libro.
- Editar un libro existente.
- Eliminar un libro.

El formulario de libro valida que el titulo y el autor sean obligatorios.

## 6. Gestion de usuarios

Disponible para usuarios con rol `BIBLIOTECARIO`.

Desde esta seccion se puede:

- Ver usuarios registrados.
- Crear un usuario.
- Editar datos de usuario.
- Eliminar usuarios.
- Cambiar el rol de un usuario.

El formulario de usuario valida:

- DNI obligatorio.
- Nombre obligatorio.
- Email obligatorio.
- Formato basico de email.

## 7. Prestamos activos

Disponible para `BIBLIOTECARIO` y `DOCENTE`.

La pantalla permite consultar prestamos activos. El bibliotecario puede:

- Ver todos los prestamos activos.
- Ver sus propios prestamos.
- Buscar prestamos por usuario.
- Registrar devoluciones.

Los docentes pueden consultar los prestamos activos asociados a su usuario.

## 8. Nuevo prestamo

Disponible para `BIBLIOTECARIO` y `DOCENTE` segun la configuracion de rutas.

El flujo esta dividido en tres pasos:

1. Buscar y seleccionar usuario.
2. Buscar y seleccionar libro.
3. Confirmar dias de prestamo y crear el prestamo.

La aplicacion valida que exista usuario seleccionado, libro seleccionado y que los dias de prestamo sean mayores que cero.

## 9. Cierre de sesion

El usuario puede cerrar sesion desde la cabecera superior.

Al cerrar sesion se elimina la informacion guardada en `localStorage` y se bloquea el acceso a las rutas protegidas.

## 10. Navegacion

La aplicacion incluye:

- Cabecera con informacion del usuario.
- Menu lateral en escritorio.
- Menu adaptado en pantallas pequenas.
- Redireccion automatica al login si se intenta acceder sin sesion.
- Redireccion al inicio si el rol no tiene permiso para una ruta.
