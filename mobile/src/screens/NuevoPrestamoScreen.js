import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { getLibros } from "../services/librosService";
import { getUsuariosPrestamo } from "../services/perfilesService";
import { createPrestamo } from "../services/prestamosService";

export default function NuevoPrestamoScreen({ onCancel, onPrestamoCreado }) {
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [busquedaLibro, setBusquedaLibro] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function cargarDatos() {
    setLoading(true);
    setError("");

    try {
      const [librosData, usuariosData] = await Promise.all([
        getLibros(),
        getUsuariosPrestamo(),
      ]);

      setLibros(librosData);
      setUsuarios(usuariosData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const librosDisponibles = useMemo(() => {
    const texto = busquedaLibro.trim().toLowerCase();

    return libros
      .filter((libro) => Number(libro.ejemplares_disponibles) > 0)
      .filter((libro) => {
        if (!texto) {
          return true;
        }

        const titulo = libro.titulo?.toLowerCase() || "";
        const autor = libro.autor?.toLowerCase() || "";
        const isbn = libro.isbn?.toLowerCase() || "";

        return (
          titulo.includes(texto) ||
          autor.includes(texto) ||
          isbn.includes(texto)
        );
      });
  }, [libros, busquedaLibro]);

  const usuariosFiltrados = useMemo(() => {
    const texto = busquedaUsuario.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      if (!texto) {
        return true;
      }

      const nombre = usuario.nombre?.toLowerCase() || "";
      const email = usuario.email?.toLowerCase() || "";
      const rol = usuario.rol?.toLowerCase() || "";

      return (
        nombre.includes(texto) ||
        email.includes(texto) ||
        rol.includes(texto)
      );
    });
  }, [usuarios, busquedaUsuario]);

  async function guardarPrestamo() {
    setError("");

    if (!libroSeleccionado) {
      setError("Debes seleccionar un libro.");
      return;
    }

    if (!usuarioSeleccionado) {
      setError("Debes seleccionar un usuario.");
      return;
    }

    setGuardando(true);

    try {
      await createPrestamo({
        libro: libroSeleccionado,
        usuario: usuarioSeleccionado,
      });

      Alert.alert("Préstamo creado", "El préstamo se ha registrado correctamente.");

      if (onPrestamoCreado) {
        onPrestamoCreado();
      }
    } catch (err) {
      setError(err.message || "No se pudo crear el préstamo.");
    } finally {
      setGuardando(false);
    }
  }

  function renderLibroItem({ item }) {
    const seleccionado = libroSeleccionado?.id === item.id;

    return (
      <Pressable
        style={[styles.optionCard, seleccionado && styles.optionSelected]}
        onPress={() => setLibroSeleccionado(item)}
      >
        <Text style={styles.optionTitle}>{item.titulo}</Text>
        <Text style={styles.optionText}>{item.autor}</Text>
        <Text style={styles.optionText}>
          Disponibles: {item.ejemplares_disponibles}
        </Text>
      </Pressable>
    );
  }

  function renderUsuarioItem({ item }) {
    const seleccionado = usuarioSeleccionado?.id === item.id;

    return (
      <Pressable
        style={[styles.optionCard, seleccionado && styles.optionSelected]}
        onPress={() => setUsuarioSeleccionado(item)}
      >
        <Text style={styles.optionTitle}>
          {item.nombre || "Usuario sin nombre"}
        </Text>
        <Text style={styles.optionText}>{item.email}</Text>
        <Text style={styles.optionText}>Rol: {item.rol}</Text>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nuevo préstamo</Text>

      <Text style={styles.sectionTitle}>1. Selecciona un libro</Text>

      <AppInput
        label="Buscar libro"
        value={busquedaLibro}
        onChangeText={setBusquedaLibro}
        placeholder="Título, autor o ISBN"
      />

      {libroSeleccionado ? (
        <Text style={styles.selectedText}>
          Libro seleccionado: {libroSeleccionado.titulo}
        </Text>
      ) : null}

      {librosDisponibles.length === 0 ? (
        <Text style={styles.empty}>No hay libros disponibles.</Text>
      ) : (
        <FlatList
          data={librosDisponibles}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderLibroItem}
          scrollEnabled={false}
        />
      )}

      <Text style={styles.sectionTitle}>2. Selecciona un usuario</Text>

      <AppInput
        label="Buscar usuario"
        value={busquedaUsuario}
        onChangeText={setBusquedaUsuario}
        placeholder="Nombre, email o rol"
      />

      {usuarioSeleccionado ? (
        <Text style={styles.selectedText}>
          Usuario seleccionado:{" "}
          {usuarioSeleccionado.nombre || usuarioSeleccionado.email}
        </Text>
      ) : null}

      {usuariosFiltrados.length === 0 ? (
        <Text style={styles.empty}>No hay usuarios disponibles.</Text>
      ) : (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderUsuarioItem}
          scrollEnabled={false}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton
        title={guardando ? "Guardando..." : "Crear préstamo"}
        onPress={guardarPrestamo}
        disabled={guardando}
      />

      <AppButton
        title="Cancelar"
        onPress={onCancel}
        disabled={guardando}
        variant="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  optionCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionSelected: {
    borderColor: "#2563eb",
    borderWidth: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  optionText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  selectedText: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#2563eb",
  },
  empty: {
    color: "#555",
    marginBottom: 8,
  },
  error: {
    color: "#b00020",
    marginTop: 16,
    marginBottom: 4,
  },
});