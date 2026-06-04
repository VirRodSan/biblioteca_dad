// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>404</h1>
      <p>No existe esta ruta.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}