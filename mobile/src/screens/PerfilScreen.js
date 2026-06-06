import { StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";

export default function PerfilScreen({ perfil, onLogout }) {
  const rol = perfil?.rol || "Sin rol";
  const nombre = perfil?.nombre || "Usuario sin nombre";
  const email = perfil?.email || "Email no disponible";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Datos del usuario conectado</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{nombre}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{rol}</Text>
      </View>

      <AppButton title="Cerrar sesión" onPress={onLogout} variant="danger" />
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
});