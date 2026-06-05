// Pagina para crear un nuevo libro.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LibroForm } from "../../features/libros/components/LibrosForm";
import { useLibros } from "../../features/libros/hooks/useLibros";

// Componente que renderiza esta parte de la interfaz.
export function LibrosCreatePage() {
  const navigate = useNavigate();
  const { addLibro } = useLibros();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    setError("");
    setIsSubmitting(true);
    try {
      await addLibro(values);
      navigate("/gestion-libros", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="sectionStack">
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Catalogo</p>
          <h1 className="pageTitle">Crear libro</h1>
          <p className="pageDescription">Introduce los datos basicos del nuevo libro.</p>
        </div>
      </header>
      {error && <p className="errorMessage">{error}</p>}
      <LibroForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}




