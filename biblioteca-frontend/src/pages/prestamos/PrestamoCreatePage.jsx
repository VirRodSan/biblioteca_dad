import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrestamos } from "../../features/prestamos/hooks/usePrestamos";
import { UsuarioSearch } from "../../features/prestamos/components/UsuarioSearch";
import { LibroSearch } from "../../features/prestamos/components/LibroSearch";
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";

export function PrestamoCreatePage() {
  const navigate = useNavigate();
  const { addPrestamo } = usePrestamos();

  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [diasPrestamo, setDiasPrestamo] = useState("14");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleCreatePrestamo(e) {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!selectedUsuario) {
      setError("Debes seleccionar un usuario.");
      return;
    }

    if (!selectedLibro) {
      setError("Debes seleccionar un libro.");
      return;
    }

    if (!diasPrestamo || Number(diasPrestamo) <= 0) {
      setError("Los dias de prestamo deben ser mayores que 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addPrestamo({
        usuarioId: selectedUsuario.id,
        libroId: selectedLibro.id,
        diasPrestamo: Number(diasPrestamo),
      });

      setSuccessMessage("Prestamo creado correctamente.");

      setTimeout(() => {
        navigate("/prestamos/activos");
      }, 800);
    } catch (err) {
      setError(err.message || "No se pudo crear el prestamo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="sectionStack">
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Prestamos</p>
          <h1 className="pageTitle">Nuevo prestamo</h1>
          <p className="pageDescription">
            Busca y selecciona el usuario y el libro antes de confirmar la operacion.
          </p>
        </div>
      </header>

      {error && <p className="errorMessage">{error}</p>}
      {successMessage && <p className="successMessage">{successMessage}</p>}

      <UsuarioSearch
        selectedUsuario={selectedUsuario}
        onSelectUsuario={setSelectedUsuario}
      />

      <LibroSearch
        selectedLibro={selectedLibro}
        onSelectLibro={setSelectedLibro}
      />

      <Card title="3. Confirmar prestamo">
        <form onSubmit={handleCreatePrestamo} className="sectionStack">
          <label>
            Dias de prestamo
            <Input
              type="number"
              min="1"
              value={diasPrestamo}
              onChange={(e) => setDiasPrestamo(e.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <div>
            <p>
              <strong>Usuario:</strong>{" "}
              {selectedUsuario
                ? `${selectedUsuario.nombre || ""} ${selectedUsuario.apellidos || ""} - ID ${selectedUsuario.id}`
                : "No seleccionado"}
            </p>

            <p>
              <strong>Libro:</strong>{" "}
              {selectedLibro
                ? `${selectedLibro.titulo || ""} - ID ${selectedLibro.id}`
                : "No seleccionado"}
            </p>
          </div>

          <div className="formActions">
            <Button type="submit" isLoading={isSubmitting}>
              Crear prestamo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
