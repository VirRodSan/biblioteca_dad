import { Image, StyleSheet, Text, View } from "react-native";
import AppButton from "./AppButton";
import { getPortadaPublicUrl } from "../services/portadasService";

export default function LibroCard({
  libro,
  puedeGestionar = false,
  onEditar,
  onEliminar,
}) {
  const portadaUrl = getPortadaPublicUrl(libro.portada_path);

  return (
    <View style={styles.card}>
      {portadaUrl ? (
        <Image source={{ uri: portadaUrl }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverPlaceholderText}>Sin portada</Text>
        </View>
      )}

      <Text style={styles.title}>{libro.titulo}</Text>
      <Text style={styles.author}>{libro.autor}</Text>

      {libro.isbn ? <Text style={styles.text}>ISBN: {libro.isbn}</Text> : null}

      {libro.editorial ? (
        <Text style={styles.text}>Editorial: {libro.editorial}</Text>
      ) : null}

      {libro.anio_publicacion ? (
        <Text style={styles.text}>Año: {libro.anio_publicacion}</Text>
      ) : null}

      <Text style={styles.text}>
        Ejemplares: {libro.ejemplares_disponibles} / {libro.ejemplares_totales}
      </Text>

      {puedeGestionar ? (
        <View style={styles.actions}>
          <AppButton title="Editar" onPress={() => onEditar(libro)} />

          <AppButton
            title="Eliminar"
            onPress={() => onEliminar(libro)}
            variant="danger"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cover: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#e5e7eb",
  },
  coverPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  coverPlaceholderText: {
    color: "#555",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    marginTop: 8,
    gap: 8,
  },
});