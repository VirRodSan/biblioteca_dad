import { supabase } from "../lib/supabase";

export async function getLibros() {
  const { data, error } = await supabase
    .from("libros")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createLibro(libro) {
  const { data, error } = await supabase
    .from("libros")
    .insert([
      {
        titulo: libro.titulo,
        autor: libro.autor,
        isbn: libro.isbn || null,
        editorial: libro.editorial || null,
        anio_publicacion: libro.anio_publicacion
          ? Number(libro.anio_publicacion)
          : null,
        ejemplares_totales: Number(libro.ejemplares_totales),
        ejemplares_disponibles: Number(libro.ejemplares_disponibles),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateLibro(id, libro) {
  const { data, error } = await supabase
    .from("libros")
    .update({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn || null,
      editorial: libro.editorial || null,
      anio_publicacion: libro.anio_publicacion
        ? Number(libro.anio_publicacion)
        : null,
      ejemplares_totales: Number(libro.ejemplares_totales),
      ejemplares_disponibles: Number(libro.ejemplares_disponibles),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
export async function deleteLibro(id) {
  const { error } = await supabase
    .from("libros")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}