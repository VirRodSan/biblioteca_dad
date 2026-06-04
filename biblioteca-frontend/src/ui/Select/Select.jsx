// src/ui/Select/Select.jsx
import styles from "./Select.module.css";

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