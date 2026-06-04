import { useState } from "react";
import { useLibros } from "../../libros/hooks/useLibros";
import { Button } from "../../../ui/Button/Button";
import { Input } from "../../../ui/Input/Input";
import { Table } from "../../../ui/Table/Table";
import { Card } from "../../../ui/Card/Card";

export function LibroSearch({ selectedLibro, onSelectLibro }) {
  const { libros, isLoading, error, loadLibros } = useLibros();
  const [query, setQuery] = useState("");

  async function handleSearch(e) {
    e.preventDefault();

    const cleanQuery = query.trim();

    if (cleanQuery.length < 2) {
      return;
    }

    await loadLibros(cleanQuery);
  }

  const columns = [
    { key: "id", header: "ID" },
    { key: "titulo", header: "Titulo", render: (libro) => libro.titulo || "-" },
    { key: "autor", header: "Autor", render: (libro) => libro.autor || "-" },
    {
      key: "disponibles",
      header: "Disponibles",
      render: (libro) =>
        libro.ejemplaresDisponibles ??
        libro.ejemplares_disponibles ??
        libro.disponibles ??
        0,
    },
    {
      key: "accion",
      header: "",
      render: (libro) => {
        const disponibles =
          libro.ejemplaresDisponibles ??
          libro.ejemplares_disponibles ??
          libro.disponibles ??
          0;
        const sinDisponibles = Number(disponibles) <= 0;

        return (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSelectLibro(libro)}
            disabled={sinDisponibles}
          >
            {sinDisponibles ? "No disponible" : "Seleccionar"}
          </Button>
        );
      },
    },
  ];

  return (
    <Card title="2. Buscar libro">
      <form onSubmit={handleSearch} className="searchRow">
        <Input
          type="text"
          placeholder="Buscar por titulo o autor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="errorMessage">Escribe al menos 2 caracteres para buscar.</p>
      )}

      {error && <p className="errorMessage">{error}</p>}

      {selectedLibro && (
        <p className="successMessage">
          Libro seleccionado: <strong>{selectedLibro.titulo}</strong> - ID:{" "}
          {selectedLibro.id}
        </p>
      )}

      <Table columns={columns} rows={libros} emptyText="Busca un libro para continuar." />
    </Card>
  );
}
