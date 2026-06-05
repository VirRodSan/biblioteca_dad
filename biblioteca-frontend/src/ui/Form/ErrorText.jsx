// Componente para mostrar mensajes de error de formularios.
import styles from "./Form.module.css";

// Componente que renderiza esta parte de la interfaz.
export function ErrorText({ children }) {
  if (!children) return null;
  return <div className={styles.error}>{children}</div>;
}



