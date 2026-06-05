// Pagina de inicio de sesion.

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./AuthPage.module.css";

// Pantalla de login: valida credenciales, usa AuthProvider y vuelve a la ruta solicitada.
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si ProtectedRoute envio al usuario aqui, se conserva la ruta original para volver tras login.
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Valida campos obligatorios antes de pedir autenticacion al context global.
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("El email es obligatorio.");
    if (!password.trim()) return setError("La contrasena es obligatoria.");

    try {
      // login persiste la sesion y actualiza el usuario compartido por toda la aplicacion.
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>B</span>
          <span>Biblioteca IES</span>
        </div>
        <h1>Acceso al sistema de biblioteca escolar</h1>
        <p>
          Consulta catalogo, prestamos y gestion administrativa con una
          experiencia adaptada a tu rol.
        </p>
      </section>

      <section className={styles.formSide}>
        <div className={styles.card}>
          <h2>Iniciar sesion</h2>
          <p>Introduce tus credenciales para continuar.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
              Contrasena
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submit} type="submit">Entrar</button>
          </form>

          <p className={styles.switch}>
            No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}




