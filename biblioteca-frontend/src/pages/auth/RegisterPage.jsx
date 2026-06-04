import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./AuthPage.module.css";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) return setError("El nombre es obligatorio.");
    if (!email.trim()) return setError("El email es obligatorio.");
    if (password.trim().length < 4) return setError("La contrasena debe tener al menos 4 caracteres.");

    try {
      await register({ nombre: nombre.trim(), email: email.trim(), password });
      navigate("/login", { replace: true });
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
        <h1>Registro para la biblioteca del centro</h1>
        <p>
          Crea una cuenta para acceder al catalogo y a las funciones disponibles
          segun tu perfil.
        </p>
      </section>

      <section className={styles.formSide}>
        <div className={styles.card}>
          <h2>Crear cuenta</h2>
          <p>Completa tus datos basicos de acceso.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>

            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
              Contrasena
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submit} type="submit">Crear cuenta</button>
          </form>

          <p className={styles.switch}>
            Ya tienes cuenta? <Link to="/login">Iniciar sesion</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
