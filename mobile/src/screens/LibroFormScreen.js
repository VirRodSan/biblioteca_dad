import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { createLibro, updateLibro } from "../services/librosService";
import {
  getPortadaPublicUrl,
  uploadPortadaLibro,
} from "../services/portadasService";

/**
 * Formulario de alta y edicion de libros.
 *
 * Gestiona campos bibliograficos, validacion local y portada opcional desde
 * camara o galeria.
 */
export default function LibroFormScreen({
  libroInicial = null,
  onCancel,
  onLibroGuardado,
}) {
  const modoEdicion = Boolean(libroInicial);

  const [titulo, setTitulo] = useState(libroInicial?.titulo || "");
  const [autor, setAutor] = useState(libroInicial?.autor || "");
  const [isbn, setIsbn] = useState(libroInicial?.isbn || "");
  const [editorial, setEditorial] = useState(libroInicial?.editorial || "");
  const [anioPublicacion, setAnioPublicacion] = useState(
    libroInicial?.anio_publicacion ? String(libroInicial.anio_publicacion) : ""
  );
  const [ejemplaresTotales, setEjemplaresTotales] = useState(
    libroInicial?.ejemplares_totales
      ? String(libroInicial.ejemplares_totales)
      : "1"
  );
  const [ejemplaresDisponibles, setEjemplaresDisponibles] = useState(
    libroInicial?.ejemplares_disponibles
      ? String(libroInicial.ejemplares_disponibles)
      : "1"
  );

  const [imagenPortada, setImagenPortada] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const portadaActualUrl = getPortadaPublicUrl(libroInicial?.portada_path);
  const portadaPreviewUri = imagenPortada?.uri || portadaActualUrl;

  /**
   * Valida los campos antes de enviar datos a Supabase.
   */
  function validarFormulario() {
    if (!titulo.trim()) {
      return "El título es obligatorio.";
    }

    if (!autor.trim()) {
      return "El autor es obligatorio.";
    }

    if (!ejemplaresTotales.trim()) {
      return "Los ejemplares totales son obligatorios.";
    }

    if (!ejemplaresDisponibles.trim()) {
      return "Los ejemplares disponibles son obligatorios.";
    }

    const total = Number(ejemplaresTotales);
    const disponibles = Number(ejemplaresDisponibles);

    if (Number.isNaN(total) || total < 1) {
      return "Los ejemplares totales deben ser un número mayor o igual que 1.";
    }

    if (Number.isNaN(disponibles) || disponibles < 0) {
      return "Los ejemplares disponibles deben ser un número mayor o igual que 0.";
    }

    if (disponibles > total) {
      return "Los ejemplares disponibles no pueden ser mayores que los ejemplares totales.";
    }

    if (anioPublicacion.trim()) {
      const anio = Number(anioPublicacion);

      if (Number.isNaN(anio) || anio < 0) {
        return "El año de publicación debe ser un número válido.";
      }
    }

    return "";
  }

  /**
   * Pide permiso de biblioteca multimedia y guarda la imagen elegida.
   */
  async function seleccionarDesdeGaleria() {
    setError("");

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      setError("Necesitas permitir el acceso a la galería.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: true,
    });

    if (!resultado.canceled) {
      setImagenPortada(resultado.assets[0]);
    }
  }

  /**
   * Pide permiso de camara y guarda la foto capturada.
   */
  async function sacarFoto() {
    setError("");

    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      setError("Necesitas permitir el acceso a la cámara.");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: true,
    });

    if (!resultado.canceled) {
      setImagenPortada(resultado.assets[0]);
    }
  }

  /**
   * Descarta solo la seleccion nueva; no elimina una portada ya guardada.
   */
  function quitarSeleccionPortada() {
    setImagenPortada(null);
  }

  /**
   * Persiste el libro y sube la portada como segundo paso cuando procede.
   */
  async function guardarLibro() {
    setError("");

    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setLoading(true);

    const datosLibro = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      isbn: isbn.trim(),
      editorial: editorial.trim(),
      anio_publicacion: anioPublicacion.trim(),
      ejemplares_totales: ejemplaresTotales.trim(),
      ejemplares_disponibles: ejemplaresDisponibles.trim(),
    };

    try {
      let libroGuardado;

      if (modoEdicion) {
        libroGuardado = await updateLibro(libroInicial.id, datosLibro);
      } else {
        libroGuardado = await createLibro(datosLibro);
      }

      if (imagenPortada) {
        libroGuardado = await uploadPortadaLibro({
          libroId: libroGuardado.id,
          imagen: imagenPortada,
        });
      }

      Alert.alert(
        modoEdicion ? "Libro actualizado" : "Libro creado",
        modoEdicion
          ? "El libro se ha actualizado correctamente."
          : "El libro se ha añadido correctamente."
      );

      if (onLibroGuardado) {
        onLibroGuardado(libroGuardado);
      }
    } catch (err) {
      setError(err.message || "No se pudo guardar el libro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {modoEdicion ? "Editar libro" : "Añadir libro"}
        </Text>

        <View style={styles.form}>
          <AppInput
            label="Título"
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ejemplo: El Quijote"
          />

          <AppInput
            label="Autor"
            value={autor}
            onChangeText={setAutor}
            placeholder="Ejemplo: Miguel de Cervantes"
          />

          <AppInput
            label="ISBN"
            value={isbn}
            onChangeText={setIsbn}
            placeholder="Opcional"
            keyboardType="default"
          />

          <AppInput
            label="Editorial"
            value={editorial}
            onChangeText={setEditorial}
            placeholder="Opcional"
          />

          <AppInput
            label="Año de publicación"
            value={anioPublicacion}
            onChangeText={setAnioPublicacion}
            placeholder="Ejemplo: 1605"
            keyboardType="numeric"
          />

          <AppInput
            label="Ejemplares totales"
            value={ejemplaresTotales}
            onChangeText={setEjemplaresTotales}
            keyboardType="numeric"
          />

          <AppInput
            label="Ejemplares disponibles"
            value={ejemplaresDisponibles}
            onChangeText={setEjemplaresDisponibles}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Portada opcional</Text>

          {portadaPreviewUri ? (
            <Image source={{ uri: portadaPreviewUri }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverPlaceholderText}>Sin portada</Text>
            </View>
          )}

          <AppButton
            title="Sacar foto"
            onPress={sacarFoto}
            disabled={loading}
            variant="secondary"
          />

          <AppButton
            title="Elegir de galería"
            onPress={seleccionarDesdeGaleria}
            disabled={loading}
            variant="secondary"
          />

          {imagenPortada ? (
            <AppButton
              title="Quitar imagen seleccionada"
              onPress={quitarSeleccionPortada}
              disabled={loading}
              variant="secondary"
            />
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AppButton
            title={loading ? "Guardando..." : "Guardar libro"}
            onPress={guardarLibro}
            disabled={loading}
          />

          <AppButton
            title="Cancelar"
            onPress={onCancel}
            disabled={loading}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  cover: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  coverPlaceholder: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  coverPlaceholderText: {
    color: "#555",
    fontWeight: "600",
  },
  error: {
    color: "#b00020",
    marginTop: 4,
    marginBottom: 4,
  },
});
