import { ROLES } from "../../../auth/roles";
import { useAuth } from "../../../auth/useAuth";
import { Table } from "../../../ui/Table/Table";
import { Button } from "../../../ui/Button/Button";

function getFechaDevolucion(prestamo) {
  return (
    prestamo.fechaLimite ||
    prestamo.fechaDevolucionPrevista ||
    prestamo.fechaDevolucion ||
    null
  );
}

function isAtrasado(prestamo) {
  const fecha = getFechaDevolucion(prestamo);
  if (!fecha) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const devolucion = new Date(`${fecha}T00:00:00`);
  return devolucion < hoy;
}

export function PrestamosTable({ prestamos, onDevolver, isReturning }) {
  const { usuario } = useAuth();

  const puedeDevolver =
    usuario?.rol === ROLES.BIBLIOTECARIO || usuario?.rol === ROLES.DOCENTE;

  const columns = [
    { key: "id", header: "ID" },
    {
      key: "usuario",
      header: "Usuario",
      render: (prestamo) =>
        prestamo.usuarioNombre ||
        prestamo.usuario?.nombre ||
        prestamo.usuarioId ||
        "Sin usuario",
    },
    {
      key: "libro",
      header: "Libro",
      render: (prestamo) =>
        prestamo.libroTitulo ||
        prestamo.libro?.titulo ||
        prestamo.libroId ||
        "Sin libro",
    },
    {
      key: "autor",
      header: "Autor",
      render: (prestamo) =>
        prestamo.libroAutor ||
        prestamo.libro?.autor ||
        "-",
    },
    {
      key: "fechaPrestamo",
      header: "Fecha prestamo",
      render: (prestamo) => prestamo.fechaPrestamo || prestamo.fechaInicio || "-",
    },
    {
      key: "fechaDevolucion",
      header: "Fecha devolucion",
      render: (prestamo) => getFechaDevolucion(prestamo) || "-",
    },
    {
      key: "estado",
      header: "Estado",
      render: (prestamo) =>
        isAtrasado(prestamo) ? (
          <span className="statusBadge statusBadgeDanger">Atrasado</span>
        ) : (
          <span className="statusBadge statusBadgeSuccess">En plazo</span>
        ),
    },
  ];

  if (puedeDevolver) {
    columns.push({
      key: "acciones",
      header: "",
      render: (prestamo) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onDevolver(prestamo.id)}
          disabled={isReturning}
        >
          Devolver
        </Button>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      rows={prestamos || []}
      emptyText="No hay prestamos activos."
    />
  );
}
