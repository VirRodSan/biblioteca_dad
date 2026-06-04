package es.app.biblioteca.service;

import es.app.biblioteca.exception.ApiException;
import es.app.biblioteca.model.Usuario;
import es.app.biblioteca.model.UsuarioTipo;
import es.app.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthzService {

    private final UsuarioRepository usuarioRepo;

    public AuthzService(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    public Usuario requireUser(Long userId) {
        return usuarioRepo.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Usuario no válido"));
    }

    public Usuario requireBibliotecario(Long userId) {
        Usuario u = requireUser(userId);
        if (u.getTipo() != UsuarioTipo.BIBLIOTECARIO) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Solo bibliotecario puede realizar esta acción");
        }
        return u;
    }

    public Usuario requireBibliotecarioOrDocente(Long userId) {
        Usuario u = requireUser(userId);
        if (u.getTipo() != UsuarioTipo.BIBLIOTECARIO && u.getTipo() != UsuarioTipo.DOCENTE) {
            throw new ApiException(HttpStatus.FORBIDDEN, "No tienes permisos");
        }
        return u;
    }
}

