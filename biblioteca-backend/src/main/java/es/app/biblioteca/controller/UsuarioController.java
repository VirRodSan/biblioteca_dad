package es.app.biblioteca.controller;

import es.app.biblioteca.dto.CrearUsuarioRequest;
import es.app.biblioteca.dto.UpdateUsuarioRequest;
import es.app.biblioteca.dto.UpdateUsuarioRolRequest;
import es.app.biblioteca.dto.UsuarioDTO;
import es.app.biblioteca.exception.ApiException;
import es.app.biblioteca.model.Usuario;
import es.app.biblioteca.repository.UsuarioRepository;
import es.app.biblioteca.service.AuthzService;
import es.app.biblioteca.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthzService authz;
    public UsuarioController(UsuarioService usuarioService, AuthzService authz) {
        this.usuarioService = usuarioService;
        this.authz = authz;
    }

    @GetMapping
    public List<UsuarioDTO> listar(@RequestHeader("X-User-Id") Long userId,
                                   @RequestParam(required = false) String q) {

        authz.requireBibliotecarioOrDocente(userId);
        return usuarioService.listar(q);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDTO crear(@RequestHeader("X-User-Id") Long userId,
                            @Valid @RequestBody CrearUsuarioRequest req) {
        authz.requireBibliotecario(userId);
        return usuarioService.crear(req);
    }

    @GetMapping("/{id}")
    public UsuarioDTO get(@RequestHeader("X-User-Id") Long userId,
                          @PathVariable Long id) {

        authz.requireBibliotecarioOrDocente(userId);
        return usuarioService.get(id);
    }

    @PatchMapping("/{id}")
    public UsuarioDTO patch(@RequestHeader("X-User-Id") Long userId,
                            @PathVariable Long id,
                            @Valid @RequestBody UpdateUsuarioRequest req) {

        authz.requireBibliotecario(userId);
        return usuarioService.patch(id, req);
    }

    @PutMapping("/{id}")
    public UsuarioDTO put(@RequestHeader("X-User-Id") Long userId,
                          @PathVariable Long id,
                          @Valid @RequestBody UpdateUsuarioRequest req) {

        return patch(userId, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@RequestHeader("X-User-Id") Long userId,
                         @PathVariable Long id) {

        authz.requireBibliotecario(userId);
        usuarioService.eliminar(id);
    }

    @PatchMapping("/{id}/rol")
    public UsuarioDTO cambiarRol(@RequestHeader("X-User-Id") Long userId,
                                 @PathVariable Long id,
                                 @RequestBody UpdateUsuarioRolRequest req) {

        authz.requireBibliotecario(userId);
        return usuarioService.cambiarRol(id, req);
    }
}

