// src/features/usuarios/components/UsuarioForm.jsx
import { useEffect, useState } from "react";
import { Card } from "../../../ui/Card/Card";
import { Field } from "../../../ui/Form/Field";
import { Input } from "../../../ui/Input/Input";
import { Select } from "../../../ui/Select/Select";
import { Button } from "../../../ui/Button/Button";

const TIPOS = ["BIBLIOTECARIO", "ALUMNO", "DOCENTE"];

export function UsuarioForm({ initialValues, onSubmit, isSubmitting }) {
  const [dni, setDni] = useState(initialValues?.dni || "");
  const [nombre, setNombre] = useState(initialValues?.nombre || "");
  const [apellidos, setApellidos] = useState(initialValues?.apellidos || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [tipo, setTipo] = useState(initialValues?.tipo || "ALUMNO");
  const [curso, setCurso] = useState(initialValues?.curso || "");
  const [departamento, setDepartamento] = useState(initialValues?.departamento || "");
  const [puesto, setPuesto] = useState(initialValues?.puesto || "");

  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Sync the form when the edit page loads a different user.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDni(initialValues?.dni || "");
    setNombre(initialValues?.nombre || "");
    setApellidos(initialValues?.apellidos || "");
    setEmail(initialValues?.email || "");
    setTipo(initialValues?.tipo || "ALUMNO");
    setCurso(initialValues?.curso || "");
    setDepartamento(initialValues?.departamento || "");
    setPuesto(initialValues?.puesto || "");
  }, [initialValues]);

  function validate() {
    const next = {};
    if (!dni.trim()) next.dni = "El DNI es obligatorio.";
    if (!nombre.trim()) next.nombre = "El nombre es obligatorio.";
    if (!email.trim()) next.email = "El email es obligatorio.";
    if (email.trim() && !email.includes("@")) next.email = "Email no válido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  
  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!validate()) {
      setFormError("Revisa los campos marcados.");
      return;
    }

    const payload = {
      dni: dni.trim(),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim(),
      tipo,
      curso: curso.trim(),
      departamento: departamento.trim(),
      puesto: puesto.trim(),
    };
    onSubmit(payload);
  }

  return (
    <Card title="Datos del usuario">
      <form onSubmit={handleSubmit}>
        <div className="formGrid">
          <Field label="DNI" error={errors.dni}>
          <Input value={dni} onChange={(e) => setDni(e.target.value)} />
        </Field>

        <Field label="Nombre" error={errors.nombre}>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Field>

        <Field label="Apellidos">
          <Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        <Field label="Tipo" error={errors.tipo}>
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={TIPOS.map((t) => ({ value: t, label: t }))}
          />
        </Field>
        <Field label="Curso">
          <Input value={curso} onChange={(e) => setCurso(e.target.value)} />
        </Field>

        <Field label="Departamento">
          <Input value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
        </Field>

        <Field label="Puesto">
          <Input value={puesto} onChange={(e) => setPuesto(e.target.value)} />
        </Field>

          {formError && <p className="formError">{formError}</p>}

          <div className="formActions">
            <Button type="submit" isLoading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
