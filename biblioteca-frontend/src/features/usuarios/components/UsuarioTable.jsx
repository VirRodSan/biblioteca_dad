// Tabla de usuarios con acciones de administracion.
import { Table } from "../../../ui/Table/Table";
import { Button } from "../../../ui/Button/Button";

// Componente que renderiza esta parte de la interfaz.
export function UsuarioTable({ usuarios, onEdit, onDelete, onChangeRol }) {
  const columns = [
    { key: "id", header: "ID" },
    { key: "dni", header: "DNI" },
    { key: "nombre", header: "Nombre" },
    { key: "apellidos", header: "Apellidos" },
    { key: "email", header: "Email" },
    { key: "tipo", header: "Rol" },
    { key: "curso", header: "Curso" },
    { key: "departamento", header: "Departamento" },
    { key: "puesto", header: "Puesto" },
    {
      key: "acciones",
      header: "",
      render: (row) => (
        <div className="actionsRow">
          <Button size="sm" variant="secondary" onClick={() => onEdit(row)}>
            Editar
          </Button>

          <Button size="sm" variant="secondary" onClick={() => onChangeRol(row)}>
            Cambiar rol
          </Button>

          <Button size="sm" variant="danger" onClick={() => onDelete(row)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} rows={usuarios} />;
}




