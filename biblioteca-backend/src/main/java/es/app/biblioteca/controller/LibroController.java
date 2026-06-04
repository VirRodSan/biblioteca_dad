package es.app.biblioteca.controller;

import es.app.biblioteca.dto.LibroDTO;
import es.app.biblioteca.exception.ApiException;
import es.app.biblioteca.model.Libro;
import es.app.biblioteca.repository.LibroRepository;
import es.app.biblioteca.service.AuthzService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
public class LibroController {

    private final LibroRepository libroRepo;
    private final AuthzService authz;

    public LibroController(LibroRepository libroRepo, AuthzService authz) {
        this.libroRepo = libroRepo;
        this.authz = authz;
    }

    private static LibroDTO toDto(Libro l) {
        return new LibroDTO(
                l.getId(), l.getIsbn(), l.getTitulo(), l.getAutor(), l.getEditorial(),
                l.getAnioPublicacion(), l.getEjemplaresTotales(), l.getEjemplaresDisponibles()
        );
    }

    @GetMapping
    public List<LibroDTO> listar(@RequestParam(required = false) String q) {
        List<Libro> libros = (q == null || q.isBlank())
                ? libroRepo.findAll()
                : libroRepo.search(q.trim());
        return libros.stream().map(LibroController::toDto).toList();
    }

    @GetMapping("/{id}")
    public LibroDTO get(@PathVariable Long id) {
        Libro l = libroRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Libro no existe"));
        return toDto(l);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LibroDTO crear(@RequestHeader("X-User-Id") Long userId,
                          @Valid @RequestBody Libro libro) {
        authz.requireBibliotecario(userId);

        if (libro.getEjemplaresDisponibles() == 0 && libro.getEjemplaresTotales() > 0) {
            libro.setEjemplaresDisponibles(libro.getEjemplaresTotales());
        }
        return toDto(libroRepo.save(libro));
    }

    @PutMapping("/{id}")
    public LibroDTO actualizar(@RequestHeader("X-User-Id") Long userId,
                               @PathVariable Long id,
                               @Valid @RequestBody Libro cambios) {
        authz.requireBibliotecario(userId);

        Libro l = libroRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Libro no existe"));

        l.setIsbn(cambios.getIsbn());
        l.setTitulo(cambios.getTitulo());
        l.setAutor(cambios.getAutor());
        l.setEditorial(cambios.getEditorial());
        l.setAnioPublicacion(cambios.getAnioPublicacion());
        l.setEjemplaresTotales(cambios.getEjemplaresTotales());
        l.setEjemplaresDisponibles(cambios.getEjemplaresDisponibles());

        return toDto(libroRepo.save(l));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void borrar(@RequestHeader("X-User-Id") Long userId,
                       @PathVariable Long id) {
        authz.requireBibliotecario(userId);
        if (!libroRepo.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Libro no existe");
        }
        try {
            libroRepo.deleteById(id);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.CONFLICT, "No se puede borrar el libro porque está referenciado");
        }
    }
}

