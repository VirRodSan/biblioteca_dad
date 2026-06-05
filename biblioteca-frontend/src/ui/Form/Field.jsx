// Componente para agrupar label, control y error de un campo.
import styles from "./Form.module.css";
import { ErrorText } from "./ErrorText";

// Componente que renderiza esta parte de la interfaz.
export function Field({ label, children, error, hint }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {hint && <div className={styles.hint}>{hint}</div>}
      <ErrorText>{error}</ErrorText>
    </div>
  );
}



