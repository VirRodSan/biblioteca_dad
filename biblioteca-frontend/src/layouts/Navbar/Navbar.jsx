// Barra superior con estado de sesion y accion de logout.
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../auth/useAuth";

// Componente que renderiza esta parte de la interfaz.
export function Navbar() {
  const { usuario, logout } = useAuth();
  const displayName = usuario?.nombre || usuario?.username || usuario?.email || "Usuario";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>B</span>
          <span>
            <strong>Biblioteca IES</strong>
            <small>Sistema de gestion</small>
          </span>
        </Link>
      </div>

      <div className={styles.right}>
        {usuario ? (
          <>
            <span className={styles.userBlock}>
              <span className={styles.user}>{displayName}</span>
              <span className={styles.role}>{usuario.rol}</span>
            </span>
            <span className={styles.avatar}>{initials || "U"}</span>
            <button className={styles.logoutButton} type="button" onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginLink}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}




