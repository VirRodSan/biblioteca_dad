import { decode } from "base64-arraybuffer";

import { supabase } from "../lib/supabase";

const BUCKET_PORTADAS = "portadas-libros";

/**
 * Construye la URL publica de una portada guardada en Supabase Storage.
 */
export function getPortadaPublicUrl(portadaPath) {
  if (!portadaPath) {
    return null;
  }

  const { data } = supabase.storage
    .from(BUCKET_PORTADAS)
    .getPublicUrl(portadaPath);

  return data.publicUrl;
}

/**
 * Sube una portada en base64 al bucket de Supabase y guarda su ruta en el libro.
 */
export async function uploadPortadaLibro({ libroId, imagen }) {
  if (!libroId) {
    throw new Error("No se ha encontrado el libro para asociar la portada.");
  }

  if (!imagen?.base64) {
    throw new Error("La imagen no tiene datos válidos para subir.");
  }

  const mimeType = imagen.mimeType || "image/jpeg";
  const extension = mimeType.includes("png") ? "png" : "jpg";

  const path = `libros/${libroId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_PORTADAS)
    .upload(path, decode(imagen.base64), {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: libroActualizado, error: updateError } = await supabase
    .from("libros")
    .update({
      portada_path: path,
    })
    .eq("id", libroId)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return libroActualizado;
}
