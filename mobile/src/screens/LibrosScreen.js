import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import LibroCard from "../components/LibroCard";
import LibroFormScreen from "./LibroFormScreen";
import { deleteLibro, getLibros } from "../services/librosService";

export default function LibrosScreen({ perfil }) {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const esBibliotecario = 
    perfil?.rol?.trim().toUpperCase() === "BIBLIOTECARIO";

  async function cargarLibros() {
    setLoading(true);
    setError("");

    try {
      const data = await getLibros();
      setLibros(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los libros.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarLibros();
  }, []);

  const librosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return libros;
    }

    return libros.filter((libro) => {
      const titulo = libro.titulo?.toLowerCase() || "";
      const autor = libro.autor?.toLowerCase() || "";
      const isbn = libro.isbn?.toLowerCase() || "";

      return (
        titulo.includes(texto) ||
        autor.includes(texto) ||
        isbn.includes(texto)
      );
    });
  }, [libros, busqueda]);

  
  function abrirFormularioCrear() {
    setLibroEditando(null);
    setMostrandoFormulario(true);
  }

  function abrirFormularioEditar(libro) {
    setLibroEditando(libro);
    setMostrandoFormulario(true);
  }

  function volverAlListado() {
    setLibroEditando(null);
    setMostrandoFormulario(false);
  }

  function gestionarLibroGuardado(libroGuardado) {
    setLibros((prevLibros) => {
      const existe = prevLibros.some((libro) => libro.id === libroGuardado.id);

      if (existe) {
        return prevLibros.map((libro) =>
          libro.id === libroGuardado.id ? libroGuardado : libro
        );
      }

      return [libroGuardado, ...prevLibros];
    });

    setLibroEditando(null);
    setMostrandoFormulario(false);
  }

  function confirmarEliminarLibro(libro) {
  Alert.alert(
    "Eliminar libro",
    `¿Seguro que quieres eliminar "${libro.titulo}"?`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => eliminarLibro(libro.id),
      },
    ]
  );
}

async function eliminarLibro(id) {
  setError("");

  try {
    await deleteLibro(id);

    setLibros((prevLibros) =>
      prevLibros.filter((libro) => libro.id !== id)
    );
  } catch (err) {
    setError(err.message || "No se pudo eliminar el libro.");
  }
}

  if (mostrandoFormulario) {
    return (
      <LibroFormScreen
        libroInicial={libroEditando}
        onCancel={volverAlListado}
        onLibroGuardado={gestionarLibroGuardado}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Biblioteca</Text>
          <Text style={styles.subtitle}>Listado de libros</Text>
        </View>
      </View>

      
      {esBibliotecario ? (
        <AppButton title="Añadir libro" onPress={abrirFormularioCrear} />
      ) : null}

      <AppInput
        label="Buscar"
        value={busqueda}
        onChangeText={setBusqueda}
        placeholder="Buscar por título, autor o ISBN"
      />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && librosFiltrados.length === 0 ? (
        <Text style={styles.empty}>No hay libros registrados.</Text>
      ) : null}

      <FlatList
        data={librosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <LibroCard 
            libro={item} 
            puedeGestionar={esBibliotecario}
            onEditar={abrirFormularioEditar} 
            onEliminar={confirmarEliminarLibro}/>
        )}
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
  header: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
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