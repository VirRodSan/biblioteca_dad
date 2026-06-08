# Manual de instalacion - Biblioteca Mobile

## 1. Requisitos

Este proyecto usa Expo SDK 54.

Requisitos recomendados:

- Node.js **20.19.x** o superior dentro de la rama compatible con Expo SDK 54.
- npm.
- Expo CLI ejecutado mediante `npx expo`.
- Un proyecto de Supabase configurado.
- Expo Go en el movil, o un emulador Android/iOS configurado.

## 2. Dependencias principales

La aplicacion utiliza:

- Expo `~54.0.34`.
- React `19.1.0`.
- React Native `0.81.5`.
- Supabase JS.
- Async Storage para persistir la sesion.
- React Navigation para navegacion.
- Expo Image Picker para portadas.
- Expo Location y React Native Maps para el mapa.

## 3. Descargar el proyecto

Clona o copia el proyecto y entra en la carpeta `mobile`:

```bash
cd mobile
```

## 4. Instalar dependencias

Instala las dependencias declaradas en `package.json`:

```bash
npm install
```

Si necesitas reinstalar dependencias compatibles con Expo, usa:

```bash
npx expo install
```

## 5. Configurar variables de entorno

Crea un archivo `.env` en la raiz del proyecto tomando como referencia `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

Estas variables son necesarias para inicializar el cliente de Supabase. Si falta alguna, la aplicacion se detendra con el error **Faltan variables de entorno de Supabase**.

## 6. Configurar Supabase

La aplicacion espera trabajar con autenticacion, tablas de perfiles, libros y prestamos, y un bucket publico para portadas.

### 6.1 Autenticacion

1. Entra en tu proyecto de Supabase.
2. Activa la autenticacion por email y contrasena.
3. Crea los usuarios necesarios.

### 6.2 Tabla `perfiles`

Debe contener los datos del usuario conectado.

Campos usados por la aplicacion:

- `id`: identificador del usuario. Debe coincidir con el `id` del usuario de Supabase Auth.
- `nombre`: nombre visible del usuario.
- `email`: email del usuario.
- `rol`: rol del usuario. Valores esperados:
  - `BIBLIOTECARIO`.
  - `ALUMNO`.
  - `DOCENTE`.

### 6.3 Tabla `libros`

Campos usados por la aplicacion:

- `id`.
- `titulo`.
- `autor`.
- `isbn`.
- `editorial`.
- `anio_publicacion`.
- `ejemplares_totales`.
- `ejemplares_disponibles`.
- `portada_path`.

### 6.4 Tabla `prestamos`

Campos usados por la aplicacion:

- `id`.
- `libro_id`.
- `usuario_id`.
- `fecha_prestamo`.
- `fecha_devolucion_prevista`.
- `fecha_devolucion_real`.
- `estado`.

Relaciones esperadas:

- `prestamos.libro_id` relacionado con `libros.id`.
- `prestamos.usuario_id` relacionado con `perfiles.id`.

Estados esperados:

- `ACTIVO`.
- `DEVUELTO`.

### 6.5 Bucket de portadas

La aplicacion sube portadas al bucket:

```text
portadas-libros
```

Configuracion recomendada:

1. Crea el bucket `portadas-libros` en Supabase Storage.
2. Configuralo como publico si quieres que las portadas se puedan mostrar directamente desde la app.
3. Asegura permisos de subida para los usuarios que puedan crear o editar libros.

Las portadas se guardan con rutas como:

```text
libros/IDLIBRO-TIMESTAMP.jpg
libros/IDLIBRO-TIMESTAMP.png
```

## 7. Ejecutar la aplicacion

Inicia el servidor de desarrollo:

```bash
npm start
```

Tambien puedes usar:

```bash
npm run android
npm run ios
npm run web
```

Despues de ejecutar el proyecto:

1. Escanea el QR con Expo Go desde el movil.
2. O abre la app en un emulador Android/iOS.

## 8. Permisos del dispositivo

La aplicacion puede solicitar:

- **Camara**: para sacar fotos de portadas.
- **Galeria**: para seleccionar portadas desde imagenes guardadas.
- **Ubicacion**: para mostrar la posicion actual en el mapa.

Si un permiso se deniega, la app mostrara un mensaje y permitira reintentar cuando sea posible.

## 9. Comprobacion rapida

Despues de instalar, verifica:

1. La app abre sin errores.
2. El login funciona con un usuario de Supabase.
3. El perfil del usuario se carga correctamente.
4. La pestana **Libros** muestra datos o permite crear libros si el usuario es bibliotecario.
5. La pestana **Prestamos** muestra datos segun el rol.
6. El mapa solicita permiso y muestra coordenadas.

## 10. Problemas frecuentes

### Faltan variables de entorno de Supabase

Revisa que exista el archivo `.env` y que contenga:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Reinicia el servidor de Expo despues de cambiar variables de entorno.

### No se ven las portadas

Comprueba:

- Que el bucket `portadas-libros` existe.
- Que el bucket permite lectura publica.
- Que `portada_path` tiene una ruta valida.

### No aparecen prestamos para un usuario

Comprueba:

- Que el usuario tiene un registro en `perfiles`.
- Que `perfiles.id` coincide con el identificador de Supabase Auth.
- Que `prestamos.usuario_id` apunta al perfil correcto.

### El mapa no muestra ubicacion

Comprueba:

- Que el dispositivo tiene GPS activo.
- Que se concedio permiso de ubicacion.
- Que la app se esta ejecutando en un entorno compatible con mapas y ubicacion.

