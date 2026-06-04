import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LibroForm } from "../../features/libros/components/LibrosForm";
import { useLibros } from "../../features/libros/hooks/useLibros";

export function LibrosEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLibro, editLibro } = useLibros();

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
        const data = await getLibro(id);
        if (isMounted) setInitialValues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, getLibro]);

  async function handleSubmit(values) {
    setError("");
    setIsSubmitting(true);
    try {
      await editLibro(id, values);
      navigate("/gestion-libros", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <p className="statusMessage">Cargando...</p>;
  if (error) return <p className="errorMessage">{error}</p>;
  if (!initialValues) return <p className="emptyState">No se encontro el libro.</p>;

  return (
    <div className="sectionStack">
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Catalogo</p>
          <h1 className="pageTitle">Editar libro</h1>
          <p className="pageDescription">Actualiza los datos del libro seleccionado.</p>
        </div>
      </header>
      <LibroForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
