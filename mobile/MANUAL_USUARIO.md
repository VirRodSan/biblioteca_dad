# Manual de usuario - Biblioteca

## 1. Objetivo de la aplicacion

Biblioteca es una aplicacion movil para consultar el catalogo de libros, gestionar prestamos y visualizar la ubicacion actual del dispositivo. El acceso se realiza mediante usuario y contrasena.

La aplicacion distingue permisos por rol:

- **Bibliotecario**: puede crear, editar y eliminar libros, crear prestamos y marcar devoluciones.
- **Alumno o docente**: puede consultar libros y ver sus propios prestamos.

## 2. Inicio de sesion

1. Abre la aplicacion.
2. Introduce tu email.
3. Introduce tu contrasena.
4. Pulsa **Entrar**.

Si las credenciales no son correctas, se mostrara un mensaje de error en la pantalla.

## 3. Navegacion principal

Despues de iniciar sesion aparecen cuatro secciones en la barra inferior:

- **Libros**: catalogo de libros disponibles en la biblioteca.
- **Prestamos**: listado de prestamos registrados o prestamos propios, segun el rol.
- **Mapa**: ubicacion actual del dispositivo.
- **Perfil**: datos del usuario conectado y cierre de sesion.

## 4. Gestion del catalogo de libros

### 4.1 Consultar libros

1. Entra en la pestana **Libros**.
2. Revisa el listado de libros.
3. Cada tarjeta muestra titulo, autor, ISBN si existe, editorial, ano de publicacion, ejemplares disponibles y ejemplares totales.
4. Si el libro tiene portada, se mostrara en la tarjeta. Si no tiene portada, aparecera un bloque con el texto **Sin portada**.

### 4.2 Buscar libros

1. En la pantalla **Libros**, usa el campo de busqueda.
2. Puedes buscar por titulo, autor o ISBN.
3. El listado se actualiza automaticamente con los resultados coincidentes.

### 4.3 Anadir un libro

Esta accion solo esta disponible para usuarios con rol **Bibliotecario**.

1. Entra en **Libros**.
2. Pulsa **Anadir libro**.
3. Completa los campos obligatorios:
   - Titulo.
   - Autor.
   - Ejemplares totales.
   - Ejemplares disponibles.
4. Completa, si procede, los campos opcionales:
   - ISBN.
   - Editorial.
   - Ano de publicacion.
5. Si quieres anadir portada, pulsa **Sacar foto** o **Elegir de galeria**.
6. Pulsa **Guardar libro**.

La aplicacion validara que:

- El titulo no este vacio.
- El autor no este vacio.
- Los ejemplares totales sean al menos 1.
- Los ejemplares disponibles sean al menos 0.
- Los ejemplares disponibles no sean mayores que los ejemplares totales.
- El ano de publicacion sea numerico si se informa.

### 4.4 Editar un libro

Esta accion solo esta disponible para usuarios con rol **Bibliotecario**.

1. Entra en **Libros**.
2. Busca el libro que quieres modificar.
3. Pulsa **Editar**.
4. Cambia los datos necesarios.
5. Si quieres cambiar la portada, selecciona una nueva imagen desde camara o galeria.
6. Pulsa **Guardar libro**.

### 4.5 Eliminar un libro

Esta accion solo esta disponible para usuarios con rol **Bibliotecario**.

1. Entra en **Libros**.
2. Busca el libro que quieres eliminar.
3. Pulsa **Eliminar**.
4. Confirma la eliminacion en el aviso.

## 5. Gestion de prestamos

### 5.1 Consultar prestamos

1. Entra en la pestana **Prestamos**.
2. Si eres bibliotecario, veras todos los prestamos registrados.
3. Si eres alumno o docente, veras solo tus prestamos.

Cada tarjeta de prestamo muestra:

- Libro.
- Autor, si esta disponible.
- Usuario asociado.
- Fecha del prestamo.
- Fecha prevista de devolucion.
- Fecha real de devolucion, si ya se devolvio.
- Estado del prestamo.

### 5.2 Crear un prestamo

Esta accion solo esta disponible para usuarios con rol **Bibliotecario**.

1. Entra en **Prestamos**.
2. Pulsa **Nuevo prestamo**.
3. Busca y selecciona un libro con ejemplares disponibles.
4. Busca y selecciona el usuario que recibira el prestamo.
5. Pulsa **Crear prestamo**.

Al crear el prestamo:

- Se registra la fecha actual como fecha de prestamo.
- La fecha prevista de devolucion se calcula automaticamente a 15 dias.
- El estado inicial es **ACTIVO**.
- Se descuenta un ejemplar disponible del libro.

### 5.3 Marcar un prestamo como devuelto

Esta accion solo esta disponible para usuarios con rol **Bibliotecario** y solo en prestamos activos.

1. Entra en **Prestamos**.
2. Localiza el prestamo activo.
3. Pulsa **Marcar como devuelto**.
4. Confirma la devolucion.

Al devolver el prestamo:

- El estado cambia a **DEVUELTO**.
- Se registra la fecha real de devolucion.
- Se repone un ejemplar disponible del libro, sin superar los ejemplares totales.

## 6. Mapa

La pestana **Mapa** muestra la ubicacion actual del dispositivo.

1. Entra en **Mapa**.
2. Acepta el permiso de ubicacion cuando el sistema lo solicite.
3. La aplicacion mostrara un mapa centrado en tu posicion actual.
4. Tambien se mostraran la latitud y la longitud.
5. Pulsa **Actualizar ubicacion** para volver a obtener la posicion.

Si no concedes el permiso o el GPS esta desactivado, la pantalla mostrara un mensaje de ayuda y un boton **Reintentar**.

## 7. Perfil y cierre de sesion

1. Entra en la pestana **Perfil**.
2. Revisa tus datos:
   - Nombre.
   - Email.
   - Rol.
3. Pulsa **Cerrar sesion** para salir de la aplicacion.

## 8. Mensajes frecuentes

- **No hay libros registrados**: no existen libros en el catalogo o la busqueda no tiene resultados.
- **No hay ejemplares disponibles para este libro**: el libro seleccionado no tiene stock para nuevos prestamos.
- **Necesitas permitir el acceso a la galeria**: debes conceder permiso para seleccionar imagenes.
- **Necesitas permitir el acceso a la camara**: debes conceder permiso para sacar una foto.
- **No se ha concedido permiso para acceder a la ubicacion**: debes permitir el uso de ubicacion para ver el mapa.

