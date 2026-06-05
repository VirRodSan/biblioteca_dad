import { useState, useEffect } from "react";
import { Field } from "../../../ui/Form/Field";
import { Input } from "../../../ui/Input/Input";
import { Button } from "../../../ui/Button/Button";
import { Card } from "../../../ui/Card/Card";

export function LibroForm({ initialValues, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    editorial: "",
    anioPublicacion: "",
    ejemplaresTotales: "1",
    ejemplaresDisponibles: "1",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      titulo: initialValues?.titulo || "",
      autor: initialValues?.autor || "",
      isbn: initialValues?.isbn || "",
      editorial: initialValues?.editorial || "",
      anioPublicacion: initialValues?.anioPublicacion?.toString() || "",
      ejemplaresTotales: initialValues?.ejemplaresTotales?.toString() || "1",
      ejemplaresDisponibles: initialValues?.ejemplaresDisponibles?.toString() || "1",
    });
    setErrors({});
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.titulo.trim()) nextErrors.titulo = "El titulo es obligatorio.";
    if (!form.autor.trim()) nextErrors.autor = "El autor es obligatorio.";
    if (!form.isbn.trim()) nextErrors.isbn = "El ISBN es obligatorio.";
    if (Number(form.ejemplaresTotales) < 0) nextErrors.ejemplaresTotales = "No puede ser negativo.";
    if (Number(form.ejemplaresDisponibles) < 0) nextErrors.ejemplaresDisponibles = "No puede ser negativo.";

    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      isbn: form.isbn.trim(),
      editorial: form.editorial.trim(),
      anioPublicacion: form.anioPublicacion ? Number(form.anioPublicacion) : null,
      ejemplaresTotales: Number(form.ejemplaresTotales || 0),
      ejemplaresDisponibles: Number(form.ejemplaresDisponibles || 0),
    });
  }

  return (
    <Card title="Datos del libro">
      <form onSubmit={handleSubmit} className="formGrid">
        <Field label="Titulo" error={errors.titulo}>
          <Input name="titulo" value={form.titulo} onChange={handleChange} />
        </Field>

        <Field label="Autor" error={errors.autor}>
          <Input name="autor" value={form.autor} onChange={handleChange} />
        </Field>

        <Field label="ISBN" error={errors.isbn}>
          <Input name="isbn" value={form.isbn} onChange={handleChange} />
        </Field>

        <Field label="Editorial">
          <Input name="editorial" value={form.editorial} onChange={handleChange} />
        </Field>

        <Field label="Año de publicacion">
          <Input
            name="anioPublicacion"
            type="number"
            min="0"
            value={form.anioPublicacion}
            onChange={handleChange}
          />
        </Field>

        <Field label="Ejemplares totales" error={errors.ejemplaresTotales}>
          <Input
            name="ejemplaresTotales"
            type="number"
            min="0"
            value={form.ejemplaresTotales}
            onChange={handleChange}
          />
        </Field>

        <Field label="Ejemplares disponibles" error={errors.ejemplaresDisponibles}>
          <Input
            name="ejemplaresDisponibles"
            type="number"
            min="0"
            value={form.ejemplaresDisponibles}
            onChange={handleChange}
          />
        </Field>

        <div className="formActions">
          <Button type="submit" isLoading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </Card>
  );
}
