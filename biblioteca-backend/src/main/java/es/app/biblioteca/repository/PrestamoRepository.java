package es.app.biblioteca.repository;

import es.app.biblioteca.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo,Long> {
    List<Prestamo> findByUsuarioIdAndDevueltoFalse(Long usuarioId);
    List<Prestamo> findByLibroIdAndDevueltoFalse(Long libroId);

    @Query("""
    select p from Prestamo p
    join fetch p.usuario
    join fetch p.creado
    join fetch p.libro
""")
    List<Prestamo> findAllWithRefs();

    @Query("""
    select p from Prestamo p
    join fetch p.usuario
    join fetch p.creado
    join fetch p.libro
    where p.devuelto = false
""")
    List<Prestamo> findActivosWithRefs();

    @Query("""
    select p from Prestamo p
    join fetch p.usuario
    join fetch p.creado
    join fetch p.libro
    where p.usuario.id = :usuarioId and p.devuelto = false
""")
    List<Prestamo> findActivosDeUsuarioWithRefs(Long usuarioId);
}
