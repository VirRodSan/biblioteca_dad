import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../pages/usuarios/UsuariosListPage.module.css";

import { UsuarioForm } from "../../features/usuarios/components/UsuarioForm";
import { useUsuarios } from "../../features/usuarios/hooks/useUsuarios";

export function UsuarioEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUsuario, editUsuario } = useUsuarios();

  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setError("");
      setIsLoading(true);
      try {
        const data = await getUsuario(id);
        if (isMounted) setInitialValues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [id, getUsuario]);

  async function handleSubmit(values) {
    setError("");
    setIsSubmitting(true);
    try {
      await editUsuario(id, values);
      navigate("/usuarios", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <p className="statusMessage">Cargando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!initialValues) return <p className="emptyState">No se encontro el usuario.</p>;

  return (
    <div className={styles.page}>
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Usuarios</p>
          <h1 className="pageTitle">Editar usuario</h1>
          <p className="pageDescription">Actualiza la informacion del usuario seleccionado.</p>
        </div>
      </header>
      <UsuarioForm initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
