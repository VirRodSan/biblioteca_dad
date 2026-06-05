// Pagina mostrada cuando no existe una ruta solicitada.
import { Link } from "react-router-dom";

// Componente que renderiza esta parte de la interfaz.
export function NotFoundPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>404</h1>
      <p>No existe esta ruta.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}



