import { StyleSheet, Text, View } from "react-native";

import AppButton from "./AppButton";

/**
 * Tarjeta de resumen de un prestamo.
 *
 * Recibe el prestamo con sus relaciones de libro y usuario ya cargadas desde
 * Supabase. Si el usuario puede gestionar y el prestamo sigue activo, muestra
 * la accion para marcarlo como devuelto.
 */
export default function PrestamoCard({
  prestamo,
  puedeGestionar = false,
  onDevolver,
}) {
  const libro = prestamo.libros;
  const usuario = prestamo.perfiles;
  const estaActivo = prestamo.estado === "ACTIVO";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {libro?.titulo || "Libro no encontrado"}
      </Text>

      {libro?.autor ? (
        <Text style={styles.text}>Autor: {libro.autor}</Text>
      ) : null}

      <Text style={styles.text}>
        Usuario: {usuario?.nombre || usuario?.email || "Usuario no encontrado"}
      </Text>

      <Text style={styles.text}>
        Fecha préstamo: {prestamo.fecha_prestamo || "Sin fecha"}
      </Text>

      <Text style={styles.text}>
        Devolución prevista: {prestamo.fecha_devolucion_prevista || "Sin fecha"}
      </Text>

      <Text style={styles.text}>
        Devolución real: {prestamo.fecha_devolucion_real || "Pendiente"}
      </Text>

      <Text style={styles.estado}>Estado: {prestamo.estado}</Text>

      {puedeGestionar && estaActivo ? (
        <View style={styles.actions}>
          <AppButton
            title="Marcar como devuelto"
            onPress={() => onDevolver(prestamo)}
            variant="secondary"
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  estado: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
  },
  actions: {
    marginTop: 8,
  },
});
