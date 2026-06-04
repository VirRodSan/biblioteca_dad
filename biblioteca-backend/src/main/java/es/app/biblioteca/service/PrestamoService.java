package es.app.biblioteca.service;

import es.app.biblioteca.exception.ApiException;
import es.app.biblioteca.model.Libro;
import es.app.biblioteca.model.Prestamo;
import es.app.biblioteca.model.Usuario;
import es.app.biblioteca.model.UsuarioTipo;
import es.app.biblioteca.repository.LibroRepository;
import es.app.biblioteca.repository.PrestamoRepository;
import es.app.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepo;
    private final LibroRepository libroRepo;
    private final UsuarioRepository usuarioRepo;

    public PrestamoService(PrestamoRepository prestamoRepo, LibroRepository libroRepo, UsuarioRepository usuarioRepo) {
        this.prestamoRepo = prestamoRepo;
        this.libroRepo = libroRepo;
        this.usuarioRepo = usuarioRepo;
    }

    @Transactional
    public Prestamo crearPrestamo(Long usuarioId, Long libroId, Long creadoPorId, int diasPrestamo) {

        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no existe"));

        Usuario creadoPor = usuarioRepo.findById(creadoPorId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario creador no existe"));

        Libro libro = libroRepo.findById(libroId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Libro no existe"));

        // Regla: solo bibliotecario puede crear préstamos a otros (el docente solo puede crearse a sí mismo)
        if (creadoPor.getTipo() == UsuarioTipo.DOCENTE && !creadoPor.getId().equals(usuario.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Un docente solo puede crear préstamos propios");
        }

        // Regla: un alumno no crea préstamos
        if (creadoPor.getTipo() == UsuarioTipo.ALUMNO) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Un alumno no puede crear préstamos");
        }

        if (libro.getEjemplaresDisponibles() <= 0) {
            throw new ApiException(HttpStatus.CONFLICT, "No hay ejemplares disponibles para prestar");
        }

        // Actualizar stock
        libro.setEjemplaresDisponibles(libro.getEjemplaresDisponibles() - 1);
        libroRepo.save(libro);

        Prestamo p = new Prestamo();
        p.setFechaPrestamo(LocalDate.now());
        p.setFechaDevolucion(LocalDate.now().plusDays(diasPrestamo));
        p.setDevuelto(false);
        p.setUsuario(usuario);
        p.setCreado(creadoPor);
        p.setLibro(libro);

        return prestamoRepo.save(p);
    }

    @Transactional
    public void devolverPrestamo(Long prestamoId) {
        Prestamo p = prestamoRepo.findById(prestamoId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Préstamo no existe"));

        if (p.isDevuelto()) {
            return;
        }

        p.setDevuelto(true);
        prestamoRepo.save(p);

        Libro libro = p.getLibro();
        libro.setEjemplaresDisponibles(libro.getEjemplaresDisponibles() + 1);
        libroRepo.save(libro);
    }
}



