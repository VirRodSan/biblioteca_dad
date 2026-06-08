import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { login } from '../services/authService';

/**
 * Pantalla de inicio de sesion.
 *
 * Recoge credenciales y delega la autenticacion en Supabase Auth.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('admin@biblioteca.com');
  const [password, setPassword] = useState('123456');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState('');

  /**
   * Lanza el login y muestra errores de Supabase sin cerrar la pantalla.
   */
  async function handleLogin() {
    setLoadingLogin(true);
    setError('');

    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLogin(false);
    }
  }

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Biblioteca</Text>
      <Text style={styles.subtitle}>Iniciar sesión</Text>

      <AppInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <AppInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton
        title={loadingLogin ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loadingLogin}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});
