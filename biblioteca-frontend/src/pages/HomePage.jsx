// Pagina inicial con resumen y accesos principales segun el usuario.

import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ROLES } from "../auth/roles";
import styles from "./HomePage.module.css";

// Componente que renderiza esta parte de la interfaz.
export function HomePage() {
  const { usuario } = useAuth();

  const esBibliotecario = usuario?.rol === ROLES.BIBLIOTECARIO;
  const esDocente = usuario?.rol === ROLES.DOCENTE;
  const esAlumno = usuario?.rol === ROLES.ALUMNO;
  const displayName = usuario?.nombre || usuario?.username || "usuario";

  const cards = [
    {
      title: "Catalogo",
      text: "Consulta libros, autores e identificadores disponibles en la biblioteca.",
      to: "/libros",
      meta: "Disponible para todos",
    },
    ...(esBibliotecario || esDocente
      ? [
          {
            title: "Prestamos activos",
            text: "Revisa prestamos abiertos y registra devoluciones cuando corresponda.",
            to: "/prestamos/activos",
            meta: "Seguimiento diario",
          },
          {
            title: "Nuevo prestamo",
            text: "Busca usuario y libro para crear un prestamo desde un flujo guiado.",
            to: "/prestamos/nuevo",
            meta: "Operacion rapida",
          },
        ]
      : []),
    ...(esAlumno
      ? [
          {
            title: "Mis prestamos",
            text: "Consulta tus libros prestados, autor, fecha de devolucion y avisos de atraso.",
            to: "/prestamos/activos",
            meta: "Alumno",
          },
        ]
      : []),
    ...(esBibliotecario
      ? [
          {
            title: "Gestion de libros",
            text: "Manten el catalogo actualizado con altas, ediciones y bajas.",
            to: "/gestion-libros",
            meta: "Bibliotecario",
          },
          {
            title: "Usuarios",
            text: "Administra datos personales y roles del sistema.",
            to: "/usuarios",
            meta: "Administracion",
          },
        ]
      : []),
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className="pageKicker">Panel principal</p>
          <h1>Biblioteca IES</h1>
          <p>
            Gestion de biblioteca escolar para catalogo, usuarios y prestamos,
            adaptada a los permisos de cada rol.
          </p>
        </div>

        {usuario && (
          <div className={styles.sessionCard}>
            <span className={styles.sessionLabel}>Sesion iniciada</span>
            <strong>{displayName}</strong>
            <span>{usuario.rol}</span>
          </div>
        )}
      </section>

      <section className={styles.summaryGrid}>
        <article>
          <span>{cards.length}</span>
          <p>Accesos disponibles</p>
        </article>
        <article>
          <span>{usuario?.rol || "-"}</span>
          <p>Rol activo</p>
        </article>
        <article>
          <span>IES</span>
          <p>Biblioteca escolar</p>
        </article>
      </section>

      <section className={styles.cards}>
        {cards.map((card) => (
          <article className={styles.card} key={card.to}>
            <span className={styles.meta}>{card.meta}</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <Link to={card.to}>Abrir</Link>
          </article>
        ))}
      </section>
    </div>
  );
}




