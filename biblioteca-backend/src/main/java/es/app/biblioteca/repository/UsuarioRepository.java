package es.app.biblioteca.repository;

import es.app.biblioteca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/*
Sirve para: Buscar usuarios, guardarlos y borrarlos. Comprueba si un DNI o email ya existe.
Busca por email para hacer el login.
Puede hacer búsquedas por nombre e email.
* */

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);
    Optional<Usuario> findByDniIgnoreCase(String dni);

    boolean existsByDniIgnoreCase(String dni);
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByDniIgnoreCaseAndIdNot(String dni, Long id);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    @Query("""
        SELECT u FROM Usuario u
        WHERE lower(u.nombre) LIKE lower(concat('%', :q, '%'))
           OR lower(u.apellidos) LIKE lower(concat('%', :q, '%'))
           OR lower(u.email) LIKE lower(concat('%', :q, '%'))
           OR lower(u.dni) LIKE lower(concat('%', :q, '%'))
    """)
    List<Usuario> search(@Param("q") String q);
}
