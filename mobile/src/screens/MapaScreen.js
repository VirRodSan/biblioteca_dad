import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import AppButton from "../components/AppButton";

export default function MapaScreen() {
  const [ubicacion, setUbicacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarUbicacionActual() {
    setLoading(true);
    setError("");

    try {
      const permiso = await Location.requestForegroundPermissionsAsync();

      if (permiso.status !== "granted") {
        setError("No se ha concedido permiso para acceder a la ubicación.");
        setUbicacion(null);
        return;
      }

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUbicacion({
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (err) {
      setError(
        err.message ||
          "No se pudo obtener la ubicación. Comprueba que el GPS esté activado."
      );
      setUbicacion(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarUbicacionActual();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mapa</Text>
        <Text style={styles.subtitle}>Ubicación actual del dispositivo</Text>

        <View style={styles.messageCard}>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.helpText}>
            Activa la ubicación del móvil y concede permiso a Expo Go para poder
            mostrar tu posición real.
          </Text>
        </View>

        <AppButton
          title="Reintentar"
          onPress={cargarUbicacionActual}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa</Text>
      <Text style={styles.subtitle}>Ubicación actual del dispositivo</Text>

      {ubicacion ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={ubicacion}
            region={ubicacion}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker
              coordinate={{
                latitude: ubicacion.latitude,
                longitude: ubicacion.longitude,
              }}
              title="Mi ubicación"
              description="Ubicación real obtenida con el GPS del móvil"
            />
          </MapView>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Latitud: {ubicacion.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Longitud: {ubicacion.longitude.toFixed(6)}
            </Text>
          </View>

          <AppButton
            title="Actualizar ubicación"
            onPress={cargarUbicacionActual}
            variant="secondary"
          />
        </>
      ) : (
        <Text style={styles.error}>No hay ubicación disponible.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#555",
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
  map: {
    width: "100%",
    height: 360,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  messageCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  error: {
    color: "#b00020",
    fontSize: 15,
    marginBottom: 8,
  },
  helpText: {
    color: "#555",
    fontSize: 14,
  },
});