// Pagina de prestamos activos y gestion de devoluciones.

import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../auth/roles";
import { usePrestamos } from "../../features/prestamos/hooks/usePrestamos";
import { PrestamosTable } from "../../features/prestamos/components/PrestamosTable";
import { PrestamoUsuarioSearch } from "../../features/prestamos/components/PrestamoUsuarioSearch";
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";

// Componente que renderiza esta parte de la interfaz.
export function PrestamoActivePage() {
  const { usuario } = useAuth();

  const {
    prestamos,
    isLoading,
    error,
    loadTodosPrestamosActivos,
    loadPrestamosActivos,
    returnPrestamo,
  } = usePrestamos();

  const [modoVista, setModoVista] = useState("mis-prestamos");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isReturning, setIsReturning] = useState(false);

  const esBibliotecario = usuario?.rol === ROLES.BIBLIOTECARIO;

  useEffect(() => {
    if (!usuario?.id) return;

    if (esBibliotecario) {
      setModoVista("todos");
      loadTodosPrestamosActivos();
    } else {
      setModoVista("mis-prestamos");
      loadPrestamosActivos(usuario.id);
    }
  }, [
    usuario?.id,
    esBibliotecario,
    loadTodosPrestamosActivos,
    loadPrestamosActivos,
  ]);

  async function handleVerTodos() {
    setModoVista("todos");
    setSelectedUsuario(null);
    setSuccessMessage("");
    setActionError("");

    await loadTodosPrestamosActivos();
  }

  async function handleVerMisPrestamos() {
    setModoVista("mis-prestamos");
    setSelectedUsuario(null);
    setSuccessMessage("");
    setActionError("");

    await loadPrestamosActivos(usuario.id);
  }

  async function handleSelectUsuario(usuarioSeleccionado) {
    setModoVista("usuario");
    setSelectedUsuario(usuarioSeleccionado);
    setSuccessMessage("");
    setActionError("");

    await loadPrestamosActivos(usuarioSeleccionado.id);
  }

  async function handleDevolver(prestamoId) {
    const confirmar = window.confirm("Seguro que quieres devolver este prestamo?");
    if (!confirmar) return;

    setSuccessMessage("");
    setActionError("");
    setIsReturning(true);

    try {
      await returnPrestamo(prestamoId);
      setSuccessMessage("Prestamo devuelto correctamente.");

      if (modoVista === "todos") {
        await loadTodosPrestamosActivos();
      } else if (modoVista === "usuario" && selectedUsuario?.id) {
        await loadPrestamosActivos(selectedUsuario.id);
      } else {
        await loadPrestamosActivos(usuario.id);
      }
    } catch (err) {
      setActionError(err.message || "No se pudo devolver el prestamo.");
    } finally {
      setIsReturning(false);
    }
  }

  const vistaActual =
    modoVista === "todos"
      ? "Todos los prestamos activos"
      : modoVista === "usuario" && selectedUsuario
        ? `${selectedUsuario.nombre} ${selectedUsuario.apellidos} - DNI: ${selectedUsuario.dni || "-"}`
        : "Mis prestamos activos";

  return (
    <div className="sectionStack">
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Prestamos</p>
          <h1 className="pageTitle">Prestamos activos</h1>
          <p className="pageDescription">
            Control de prestamos abiertos y devoluciones segun permisos del rol.
          </p>
        </div>
      </header>

      {esBibliotecario && (
        <Card title="Opciones de consulta">
          <div className="actionsRow">
            <Button
              type="button"
              variant={modoVista === "todos" ? "primary" : "secondary"}
              onClick={handleVerTodos}
              disabled={isLoading || modoVista === "todos"}
            >
              Ver todos
            </Button>

            <Button
              type="button"
              variant={modoVista === "mis-prestamos" ? "primary" : "secondary"}
              onClick={handleVerMisPrestamos}
              disabled={isLoading || modoVista === "mis-prestamos"}
            >
              Ver mis prestamos
            </Button>
          </div>

          <PrestamoUsuarioSearch onSelectUsuario={handleSelectUsuario} />
        </Card>
      )}

      {!esBibliotecario && (
        <p className="statusMessage">
          Estas viendo los prestamos activos asociados a tu usuario.
        </p>
      )}

      <Card title={vistaActual}>
        {isLoading && <p className="statusMessage">Cargando prestamos activos...</p>}
        {error && <p className="errorMessage">{error}</p>}
        {actionError && <p className="errorMessage">{actionError}</p>}
        {successMessage && <p className="successMessage">{successMessage}</p>}

        {!isLoading && !error && (
          <PrestamosTable
            prestamos={prestamos}
            onDevolver={handleDevolver}
            isReturning={isReturning}
          />
        )}
      </Card>
    </div>
  );
}




