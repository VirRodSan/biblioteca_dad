import { supabase } from "../lib/supabase";

export async function getPrestamos(perfil) {
  let query = supabase
    .from("prestamos")
    .select(`
      id,
      libro_id,
      usuario_id,
      fecha_prestamo,
      fecha_devolucion_prevista,
      fecha_devolucion_real,
      estado,
      libros (
        id,
        titulo,
        autor,
        ejemplares_disponibles,
        ejemplares_totales
      ),
      perfiles (
        id,
        nombre,
        email,
        rol
      )
    `)
    .order("fecha_prestamo", { ascending: false });

  const esBibliotecario =
    perfil?.rol?.trim().toUpperCase() === "BIBLIOTECARIO";

  if (!esBibliotecario && perfil?.id) {
    query = query.eq("usuario_id", perfil.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createPrestamo({ libro, usuario }) {
  if (!libro || !usuario) {
    throw new Error("Debes seleccionar un libro y un usuario.");
  }

  if (Number(libro.ejemplares_disponibles) <= 0) {
    throw new Error("No hay ejemplares disponibles para este libro.");
  }

  const fechaPrestamo = new Date();

  const fechaDevolucionPrevista = new Date();
  fechaDevolucionPrevista.setDate(fechaDevolucionPrevista.getDate() + 15);

  const { data: prestamoCreado, error: prestamoError } = await supabase
    .from("prestamos")
    .insert([
      {
        libro_id: libro.id,
        usuario_id: usuario.id,
        fecha_prestamo: fechaPrestamo.toISOString().split("T")[0],
        fecha_devolucion_prevista: fechaDevolucionPrevista
          .toISOString()
          .split("T")[0],
        fecha_devolucion_real: null,
        estado: "ACTIVO",
      },
    ])
    .select()
    .single();

  if (prestamoError) {
    throw new Error(prestamoError.message);
  }

  const nuevosDisponibles = Number(libro.ejemplares_disponibles) - 1;

  const { error: libroError } = await supabase
    .from("libros")
    .update({
      ejemplares_disponibles: nuevosDisponibles,
    })
    .eq("id", libro.id);

  if (libroError) {
    throw new Error(libroError.message);
  }

  return prestamoCreado;
}

export async function devolverPrestamo(prestamo) {
  if (!prestamo) {
    throw new Error("No se ha seleccionado ningún préstamo.");
  }

  if (prestamo.estado !== "ACTIVO") {
    throw new Error("Solo se pueden devolver préstamos activos.");
  }

  const libro = prestamo.libros;

  if (!libro) {
    throw new Error("No se ha encontrado el libro asociado al préstamo.");
  }

  const fechaDevolucionReal = new Date().toISOString().split("T")[0];

  const { data: prestamoActualizado, error: prestamoError } = await supabase
    .from("prestamos")
    .update({
      estado: "DEVUELTO",
      fecha_devolucion_real: fechaDevolucionReal,
    })
    .eq("id", prestamo.id)
    .select()
    .single();

  if (prestamoError) {
    throw new Error(prestamoError.message);
  }

  const actualesDisponibles = Number(libro.ejemplares_disponibles);
  const totales = Number(libro.ejemplares_totales);

  const nuevosDisponibles = Math.min(actualesDisponibles + 1, totales);

  const { error: libroError } = await supabase
    .from("libros")
    .update({
      ejemplares_disponibles: nuevosDisponibles,
    })
    .eq("id", libro.id);

  if (libroError) {
    throw new Error(libroError.message);
  }

  return prestamoActualizado;
}