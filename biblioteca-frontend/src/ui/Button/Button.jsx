// Componente base para botones reutilizables.
import styles from "./Button.module.css";

const VARIANTS = new Set(["primary", "secondary", "danger", "ghost"]);
const SIZES = new Set(["sm", "md", "lg"]);

// Componente que renderiza esta parte de la interfaz.
export function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
}) {
  const safeVariant = VARIANTS.has(variant) ? variant : "primary";
  const safeSize = SIZES.has(size) ? size : "md";

  const className = [
    styles.button,
    styles[safeVariant],
    styles[safeSize],
    isLoading ? styles.loading : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}



