// Componente base para controles select.
import styles from "./Select.module.css";

// Componente que renderiza esta parte de la interfaz.
export function Select({ value, onChange, options, disabled = false, name }) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}



