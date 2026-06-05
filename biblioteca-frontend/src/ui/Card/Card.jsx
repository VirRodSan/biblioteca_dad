// Componente contenedor para secciones con titulo y contenido.
import styles from "./Card.module.css";

// Componente que renderiza esta parte de la interfaz.
export function Card({ title, actions, children }) {
  return (
    <section className={styles.card}>
      {(title || actions) && (
        <header className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.actions}>{actions}</div>
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}



