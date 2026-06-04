package es.app.biblioteca.repository;

import es.app.biblioteca.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LibroRepository extends JpaRepository<Libro,Long> {
    Optional<Libro> findByIsbn(String isbn);

    @Query("""
        SELECT l FROM Libro l
        WHERE lower(l.titulo) LIKE lower(concat('%', :q, '%'))
           OR lower(l.autor) LIKE lower(concat('%', :q, '%'))
           OR lower(l.isbn) LIKE lower(concat('%', :q, '%'))
           OR lower(l.editorial) LIKE lower(concat('%', :q, '%'))
    """)
    List<Libro> search(@Param("q") String q);
}
