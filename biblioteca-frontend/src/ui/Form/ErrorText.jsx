// src/ui/Form/ErrorText.jsx
import styles from "./Form.module.css";

export function ErrorText({ children }) {
  if (!children) return null;
  return <div className={styles.error}>{children}</div>;
}