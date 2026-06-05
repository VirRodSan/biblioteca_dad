// Componente base para inputs de texto y numero.
import styles from "./Input.module.css";

// Componente que renderiza esta parte de la interfaz.
export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  autoComplete,
  disabled = false,
  ...props
}) {
  return (
    <input
      className={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      name={name}
      autoComplete={autoComplete}
      disabled={disabled}
      {...props}
    />
  );
}




