import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import PrestamoCard from "../components/PrestamoCard";
import NuevoPrestamoScreen from "./NuevoPrestamoScreen";
import { devolverPrestamo, getPrestamos } from "../services/prestamosService";

/**
 * Pantalla de prestamos.
 *
 * El bibliotecario ve todo, puede crear prestamos y registrar devoluciones. Los
 * demas perfiles ven solamente sus propios prestamos.
 */
export default function PrestamosScreen({ perfil }) {
  const [prestamos, setPrestamos] = useState([]);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const esBibliotecario =
    perfil?.rol?.trim().toUpperCase() === "BIBLIOTECARIO";

  /**
   * Carga los prestamos visibles para el perfil actual.
   */
  async function cargarPrestamos() {
    setLoading(true);
    setError("");

    try {
      const data = await getPrestamos(perfil);
      setPrestamos(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPrestamos();
  }, []);

  /**
   * Vuelve del formulario de alta al listado.
   */
  function volverAlListado() {
    setMostrandoFormulario(false);
  }

  /**
   * Pide confirmacion antes de marcar un prestamo como devuelto.
   */
  function confirmarDevolucion(prestamo) {
  Alert.alert(
    "Devolver préstamo",
    `¿Marcar como devuelto "${prestamo.libros?.titulo || "este libro"}"?`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Devolver",
        onPress: () => devolver(prestamo),
      },
    ]
  );
}

/**
 * Marca el prestamo como devuelto y refresca el listado.
 */
async function devolver(prestamo) {
  setError("");

  try {
    await devolverPrestamo(prestamo);
    await cargarPrestamos();
  } catch (err) {
    setError(err.message || "No se pudo devolver el préstamo.");
  }
}

  /**
   * Cierra el formulario y recarga para reflejar el nuevo prestamo.
   */
  async function gestionarPrestamoCreado() {
    setMostrandoFormulario(false);
    await cargarPrestamos();
  }

  if (mostrandoFormulario) {
    return (
      <NuevoPrestamoScreen
        onCancel={volverAlListado}
        onPrestamoCreado={gestionarPrestamoCreado}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {esBibliotecario ? "Préstamos" : "Mis préstamos"}
      </Text>

      <Text style={styles.subtitle}>
        {esBibliotecario
          ? "Listado de préstamos registrados"
          : "Listado de tus préstamos"}
      </Text>

      {esBibliotecario ? (
        <AppButton
          title="Nuevo préstamo"
          onPress={() => setMostrandoFormulario(true)}
        />
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && prestamos.length === 0 ? (
        <Text style={styles.empty}>No hay préstamos registrados.</Text>
      ) : null}

      <FlatList
        data={prestamos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) =>
          <PrestamoCard
            prestamo={item}
            puedeGestionar={esBibliotecario}
            onDevolver={confirmarDevolucion}
          />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
    marginBottom: 16,
  },
  loading: {
    marginTop: 24,
  },
  error: {
    color: "#b00020",
    marginTop: 16,
  },
  empty: {
    marginTop: 16,
    color: "#555",
  },
  list: {
    paddingTop: 12,
    paddingBottom: 40,
  },
});
