// Pagina de catalogo visible para consultar libros disponibles.

import { useEffect } from "react";
import { Card } from "../../ui/Card/Card";
import { LibrosTable } from "../../features/libros/components/LibrosTable";
import { useLibros } from "../../features/libros/hooks/useLibros";

// Componente que renderiza esta parte de la interfaz.
export function LibrosCatalogoPage() {
  const { libros, isLoading, error, loadLibros } = useLibros();

  useEffect(() => {
    loadLibros();
  }, [loadLibros]);

  return (
    <div>
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Biblioteca</p>
          <h1 className="pageTitle">Catalogo de libros</h1>
          <p className="pageDescription">
            Consulta los libros registrados y su informacion principal.
          </p>
        </div>
      </header>

      <Card title="Listado del catalogo">
        {isLoading && <p className="statusMessage">Cargando libros...</p>}
        {error && <p className="errorMessage">{error}</p>}

        {!isLoading && !error && (
          <LibrosTable libros={libros} showActions={false} />
        )}
      </Card>
    </div>
  );
}




