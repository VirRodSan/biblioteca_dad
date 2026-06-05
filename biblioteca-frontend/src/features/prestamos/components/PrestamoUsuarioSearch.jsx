// Buscador de usuarios integrado en el flujo de prestamos.

import { useState } from "react";
import { useUsuarios } from "../../usuarios/hooks/useUsuarios";
import { Button } from "../../../ui/Button/Button";
import { Input } from "../../../ui/Input/Input";
import { Table } from "../../../ui/Table/Table";

// Componente que renderiza esta parte de la interfaz.
export function PrestamoUsuarioSearch({ onSelectUsuario }) {
  const { usuarios, isLoading, error, loadUsuarios } = useUsuarios();
  const [query, setQuery] = useState("");

  async function handleSearch(e) {
    e.preventDefault();

    const cleanQuery = query.trim();

    if (cleanQuery.length < 2) {
      return;
    }

    await loadUsuarios(cleanQuery);
  }

  const columns = [
    { key: "id", header: "ID" },
    { key: "dni", header: "DNI", render: (usuario) => usuario.dni || "-" },
    { key: "nombre", header: "Nombre", render: (usuario) => usuario.nombre || "-" },
    { key: "apellidos", header: "Apellidos", render: (usuario) => usuario.apellidos || "-" },
    { key: "rol", header: "Rol", render: (usuario) => usuario.rol || usuario.tipo || "-" },
    {
      key: "accion",
      header: "",
      render: (usuario) => (
        <Button size="sm" variant="secondary" onClick={() => onSelectUsuario(usuario)}>
          Ver prestamos
        </Button>
      ),
    },
  ];

  return (
    <section className="sectionStack">
      <form onSubmit={handleSearch} className="searchRow">
        <Input
          type="text"
          placeholder="Buscar por DNI, nombre o apellidos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar usuario"}
        </Button>
      </form>

      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="errorMessage">Escribe al menos 2 caracteres para buscar.</p>
      )}

      {error && <p className="errorMessage">{error}</p>}

      <Table
        columns={columns}
        rows={usuarios}
        emptyText={
          query.trim().length >= 2 && !isLoading && !error
            ? "No se han encontrado usuarios."
            : "Busca un usuario para filtrar prestamos."
        }
      />
    </section>
  );
}




