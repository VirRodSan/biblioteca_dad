// Menu lateral con enlaces filtrados por rol.
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../auth/roles";

function getLinkClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

// Componente que renderiza esta parte de la interfaz.
export function Sidebar() {
  const { usuario } = useAuth();
  const rol = usuario?.rol;

  const isBibliotecario = rol === ROLES.BIBLIOTECARIO;
  const isDocente = rol === ROLES.DOCENTE;
  const canUsePrestamos = rol === ROLES.BIBLIOTECARIO || rol === ROLES.DOCENTE || rol === ROLES.ALUMNO;
  const canCreatePrestamos = isBibliotecario || isDocente;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <div className={styles.sectionTitle}>Menu</div>

        <NavLink to="/" className={getLinkClass} end>
          <span className={styles.icon}>I</span>
          <span>Inicio</span>
        </NavLink>

        <NavLink to="/libros" className={getLinkClass}>
          <span className={styles.icon}>C</span>
          <span>Catalogo</span>
        </NavLink>

        {isBibliotecario && (
          <>
            <NavLink to="/gestion-libros" className={getLinkClass}>
              <span className={styles.icon}>L</span>
              <span>Gestion de libros</span>
            </NavLink>

            <NavLink to="/usuarios" className={getLinkClass}>
              <span className={styles.icon}>U</span>
              <span>Usuarios</span>
            </NavLink>
          </>
        )}

        {canUsePrestamos && (
          <>
            <div className={styles.sectionTitle}>Prestamos</div>
            <NavLink to="/prestamos/activos" className={getLinkClass}>
              <span className={styles.icon}>A</span>
              <span>Activos</span>
            </NavLink>

            {canCreatePrestamos && (
              <NavLink to="/prestamos/nuevo" className={getLinkClass}>
                <span className={styles.icon}>N</span>
                <span>Nuevo prestamo</span>
              </NavLink>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}




