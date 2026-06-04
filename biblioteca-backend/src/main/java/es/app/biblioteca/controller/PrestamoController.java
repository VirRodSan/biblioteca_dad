package es.app.biblioteca.controller;

import es.app.biblioteca.dto.CrearPrestamoRequest;
import es.app.biblioteca.dto.PrestamoDTO;
import es.app.biblioteca.model.Prestamo;
import es.app.biblioteca.model.Usuario;
import es.app.biblioteca.model.UsuarioTipo;
import es.app.biblioteca.repository.PrestamoRepository;
import es.app.biblioteca.service.AuthzService;
import es.app.biblioteca.service.PrestamoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
public class PrestamoController {

    private final PrestamoService prestamoService;
    private final PrestamoRepository prestamoRepo;
    private final AuthzService authz;

    public PrestamoController(PrestamoService prestamoService, PrestamoRepository prestamoRepo, AuthzService authz) {
        this.prestamoService = prestamoService;
        this.prestamoRepo = prestamoRepo;
        this.authz = authz;
    }

    private static PrestamoDTO toDto(Prestamo p) {
        return new PrestamoDTO(
                p.getId(),
                p.getFechaPrestamo(),
                p.getFechaDevolucion(),
                p.isDevuelto(),
                p.getUsuario().getId(),
                p.getUsuario().getNombre() + " " + p.getUsuario().getApellidos(),
                p.getLibro().getId(),
                p.getLibro().getTitulo(),
                p.getLibro().getAutor(),
                p.getCreado().getId(),
                p.getCreado().getNombre() + " " + p.getCreado().getApellidos()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PrestamoDTO crear(@RequestHeader("X-User-Id") Long userId,
                             @Valid @RequestBody CrearPrestamoRequest req) {
        authz.requireBibliotecarioOrDocente(userId);

        Long creadoPorId = userId;
        int dias = (req.diasPrestamo() == null) ? 14 : req.diasPrestamo();

        Prestamo p = prestamoService.crearPrestamo(req.usuarioId(), req.libroId(), creadoPorId, dias);
        return toDto(p);
    }

    @PostMapping("/{id}/devolver")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void devolver(@RequestHeader("X-User-Id") Long userId,
                         @PathVariable Long id) {
        authz.requireBibliotecarioOrDocente(userId);
        prestamoService.devolverPrestamo(id);
    }

    @PutMapping("/{id}/devolver")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void devolverPut(@RequestHeader("X-User-Id") Long userId,
                            @PathVariable Long id) {
        devolver(userId, id);
    }

    @GetMapping
    public List<PrestamoDTO> listarTodos() {
        return prestamoRepo.findAllWithRefs().stream().map(PrestamoController::toDto).toList();
    }

    @GetMapping("/activos")
    public List<PrestamoDTO> listarActivos(@RequestHeader("X-User-Id") Long userId) {
        authz.requireBibliotecarioOrDocente(userId);
        return prestamoRepo.findActivosWithRefs().stream().map(PrestamoController::toDto).toList();
    }

    @GetMapping("/usuario/{usuarioId}/activos")
    public List<PrestamoDTO> activosDeUsuario(@RequestHeader("X-User-Id") Long userId,
                                              @PathVariable Long usuarioId) {
        Usuario usuario = authz.requireUser(userId);
        boolean puedeConsultar =
                usuario.getTipo() == UsuarioTipo.BIBLIOTECARIO ||
                usuario.getTipo() == UsuarioTipo.DOCENTE ||
                usuario.getId().equals(usuarioId);

        if (!puedeConsultar) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo puedes consultar tus propios prestamos"
            );
        }

        return prestamoRepo.findActivosDeUsuarioWithRefs(usuarioId)
                .stream().map(PrestamoController::toDto).toList();
    }
}

