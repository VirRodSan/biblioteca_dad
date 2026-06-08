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

/**
 * Pantalla principal del catalogo.
 *
 * Muestra el listado de libros, permite buscar por titulo, autor o ISBN y
 * habilita acciones de gestion cuando el perfil es bibliotecario.
 */
export default function LibrosScreen({ perfil }) {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const esBibliotecario = 
    perfil?.rol?.trim().toUpperCase() === "BIBLIOTECARIO";

  /**
   * Carga el catalogo completo desde Supabase y actualiza estados de UI.
   */
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

  /**
   * Lista derivada que evita recalcular el filtro mientras no cambien entradas.
   */
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

  
  /**
   * Abre el formulario en modo creacion.
   */
  function abrirFormularioCrear() {
    setLibroEditando(null);
    setMostrandoFormulario(true);
  }

  /**
   * Abre el formulario con los datos del libro seleccionado.
   */
  function abrirFormularioEditar(libro) {
    setLibroEditando(libro);
    setMostrandoFormulario(true);
  }

  /**
   * Cierra el formulario y limpia cualquier edicion pendiente.
   */
  function volverAlListado() {
    setLibroEditando(null);
    setMostrandoFormulario(false);
  }

  /**
   * Inserta o reemplaza el libro devuelto por el formulario sin recargar todo.
   */
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

  /**
   * Pide confirmacion antes de borrar un libro del catalogo.
   */
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

/**
 * Elimina el libro en Supabase y lo quita del estado local.
 */
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
