// src/ui/Form/Field.jsx
import styles from "./Form.module.css";
import { ErrorText } from "./ErrorText";

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