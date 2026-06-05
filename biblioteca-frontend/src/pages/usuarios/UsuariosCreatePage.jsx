// Pagina para crear un nuevo usuario.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UsuariosListPage.module.css";

import { UsuarioForm } from "../../features/usuarios/components/UsuarioForm";
import { useUsuarios } from "../../features/usuarios/hooks/useUsuarios";

// Componente que renderiza esta parte de la interfaz.
export function UsuarioCreatePage() {
  const navigate = useNavigate();
  const { addUsuario } = useUsuarios();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    setError("");
    setIsSubmitting(true);
    try {
      await addUsuario(values);
      navigate("/usuarios", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Usuarios</p>
          <h1 className="pageTitle">Crear usuario</h1>
          <p className="pageDescription">Registra una nueva cuenta en el sistema.</p>
        </div>
      </header>
      {error && <p className={styles.error}>{error}</p>}
      <UsuarioForm mode="create" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}




