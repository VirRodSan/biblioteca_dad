import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";

import LoginScreen from "./src/screens/LoginScreen";
import LibrosScreen from "./src/screens/LibrosScreen";
import PrestamosScreen from "./src/screens/PrestamosScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
import MapaScreen from "./src/screens/MapaScreen";
import { supabase } from "./src/lib/supabase";
import { getPerfilActual } from "./src/services/perfilesService";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs({ perfil, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "ellipse-outline";

          if (route.name === "Libros") {
            iconName = "book-outline";
          }

          if (route.name === "Préstamos") {
            iconName = "swap-horizontal-outline";
          }

          if (route.name === "Mapa") {
            iconName = "map-outline";
          }

          if (route.name === "Perfil") {
            iconName = "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Libros">
        {() => <LibrosScreen perfil={perfil} />}
      </Tab.Screen>

      <Tab.Screen name="Préstamos">
        {() => <PrestamosScreen perfil={perfil} />}
      </Tab.Screen>

      <Tab.Screen name="Mapa">
        {() => <MapaScreen />}
      </Tab.Screen>

      <Tab.Screen name="Perfil">
        {() => <PerfilScreen perfil={perfil} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarPerfil() {
    try {
      const perfilActual = await getPerfilActual();
      setPerfil(perfilActual);
    } catch (error) {
      console.log("Error cargando perfil:", error.message);
      setPerfil(null);
    }
  }

  useEffect(() => {
    async function iniciarSesion() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        await cargarPerfil();
      }

      setLoading(false);
    }

    iniciarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session) {
        await cargarPerfil();
      } else {
        setPerfil(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function gestionarLogin(session) {
    setSession(session);
    cargarPerfil();
  }

  async function gestionarLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setPerfil(null);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={gestionarLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="App">
            {() => <AppTabs perfil={perfil} onLogout={gestionarLogout} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});