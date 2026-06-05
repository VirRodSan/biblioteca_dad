// Tabla de libros con acciones disponibles para cada registro.

import { Table } from "../../../ui/Table/Table";
import { Button } from "../../../ui/Button/Button";

// Componente que renderiza esta parte de la interfaz.
export function LibrosTable({ libros, onEdit, onDelete, showActions = true }) {
  const columns = [
    { key: "id", header: "ID" },
    { key: "titulo", header: "Titulo" },
    { key: "autor", header: "Autor" },
    { key: "isbn", header: "ISBN" },
  ];
  if (showActions)  { 
    columns.push({
      key: "acciones",
      header: "Acciones",
      render: (row) => (
        <div className="actionsRow">
          <Button size="sm" variant="secondary" onClick={() => onEdit(row)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(row)}>
            Eliminar
          </Button>
        </div>
      ),
    });
  }
  

  return( <Table 
    columns={columns} 
    rows={libros} 
    emptyText="No hay libros registrados."
    />
  );
}




