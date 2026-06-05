// Formulario para registrar un nuevo prestamo.

import { useState } from "react";

// Componente que renderiza esta parte de la interfaz.
export function PrestamoForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    usuarioId: "",
    libroId: "",
    diasPrestamo: "14",
  });

  const [validationError, setValidationError] = useState("");

  // Sincroniza el estado local con los campos del formulario.

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Valida el formulario antes de enviar los datos.

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    if (!form.usuarioId) {
      setValidationError("Debes indicar el ID del usuario.");
      return;
    }

    if (!form.libroId) {
      setValidationError("Debes indicar el ID del libro.");
      return;
    }

    if (Number(form.usuarioId) <= 0) {
      setValidationError("El ID del usuario debe ser valido.");
      return;
    }

    if (Number(form.libroId) <= 0) {
      setValidationError("El ID del libro debe ser valido.");
      return;
    }

    if (form.diasPrestamo && Number(form.diasPrestamo) <= 0) {
      setValidationError("Los dias de prestamo deben ser mayores que 0.");
      return;
    }

    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="usuarioId">ID del usuario</label>
        <br />
        <input
          id="usuarioId"
          name="usuarioId"
          type="number"
          min="1"
          value={form.usuarioId}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="libroId">ID del libro</label>
        <br />
        <input
          id="libroId"
          name="libroId"
          type="number"
          min="1"
          value={form.libroId}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="diasPrestamo">Dias de prestamo</label>
        <br />
        <input
          id="diasPrestamo"
          name="diasPrestamo"
          type="number"
          min="1"
          value={form.diasPrestamo}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      {validationError && (
        <p style={{ color: "crimson" }}>{validationError}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creando prestamo..." : "Crear prestamo"}
      </button>
    </form>
  );
}



