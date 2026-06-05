// Buscador general de usuarios para seleccionar prestatarios.

import { useState } from "react";
import { useUsuarios } from "../../usuarios/hooks/useUsuarios";
import { Button } from "../../../ui/Button/Button";
import { Input } from "../../../ui/Input/Input";
import { Table } from "../../../ui/Table/Table";
import { Card } from "../../../ui/Card/Card";

// Componente que renderiza esta parte de la interfaz.
export function UsuarioSearch({ selectedUsuario, onSelectUsuario }) {
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
          Seleccionar
        </Button>
      ),
    },
  ];

  return (
    <Card title="1. Buscar usuario">
      <form onSubmit={handleSearch} className="searchRow">
        <Input
          type="text"
          placeholder="Buscar por DNI, nombre o apellidos"
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

      {selectedUsuario && (
        <p className="successMessage">
          Usuario seleccionado:{" "}
          <strong>
            {selectedUsuario.nombre} {selectedUsuario.apellidos}
          </strong>{" "}
          - ID: {selectedUsuario.id}
        </p>
      )}

      <Table columns={columns} rows={usuarios} emptyText="Busca un usuario para continuar." />
    </Card>
  );
}




