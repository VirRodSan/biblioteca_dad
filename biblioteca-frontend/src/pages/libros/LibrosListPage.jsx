// Pagina de administracion del listado de libros.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { Modal } from "../../ui/Modal/Modal";
import { LibrosTable } from "../../features/libros/components/LibrosTable";
import { useLibros } from "../../features/libros/hooks/useLibros";

// Componente que renderiza esta parte de la interfaz.
export function LibrosListPage() {
  const navigate = useNavigate();
  const { libros, isLoading, error, loadLibros, removeLibro } = useLibros();

  const [libroToDelete, setLibroToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    loadLibros();
  }, [loadLibros]);

  async function handleDeleteConfirm() {
    if (!libroToDelete) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      await removeLibro(libroToDelete.id);
      setLibroToDelete(null);
      await loadLibros();
    } catch (err) {
      setDeleteError(err.message || "No se pudo eliminar el libro");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Administracion</p>
          <h1 className="pageTitle">Gestion de libros</h1>
          <p className="pageDescription">
            Alta, edicion y retirada de libros del catalogo.
          </p>
        </div>
        <Button onClick={() => navigate("/gestion-libros/crear")}>Nuevo libro</Button>
      </header>

      <Card title="Libros registrados">
        {isLoading && <p className="statusMessage">Cargando...</p>}
        {error && <p className="errorMessage">{error}</p>}
        {deleteError && <p className="errorMessage">{deleteError}</p>}

        <LibrosTable
          libros={libros}
          onEdit={(libro) => navigate(`/gestion-libros/${libro.id}/editar`)}
          onDelete={(libro) => setLibroToDelete(libro)}
        />
      </Card>

      <Modal
        title="Confirmar eliminacion"
        isOpen={Boolean(libroToDelete)}
        onClose={() => setLibroToDelete(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setLibroToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={handleDeleteConfirm}
            >
              Eliminar
            </Button>
          </>
        }
      >
        Seguro que deseas eliminar este libro?
      </Modal>
    </>
  );
}




