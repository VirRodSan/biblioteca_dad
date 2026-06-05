// Componente modal reutilizable con cierre por boton o fondo.
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

// Componente que renderiza esta parte de la interfaz.
export function Modal({ title, children, isOpen, onClose, footer }) {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Cerrar">
            âœ•
          </button>
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}



