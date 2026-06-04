package es.app.biblioteca.service;


import es.app.biblioteca.dto.CrearUsuarioRequest;
import es.app.biblioteca.dto.UpdateUsuarioRequest;
import es.app.biblioteca.dto.UpdateUsuarioRolRequest;
import es.app.biblioteca.dto.UsuarioDTO;
import es.app.biblioteca.exception.ApiException;
import es.app.biblioteca.model.Usuario;
import es.app.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;



@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;

    public UsuarioService(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    public static UsuarioDTO toDto(Usuario u) {
        return new UsuarioDTO(
                u.getId(), u.getDni(), u.getNombre(), u.getApellidos(), u.getEmail(), u.getTipo(),
                u.getCurso(), u.getDepartamento(), u.getPuesto()
        );
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listar(String q) {
        List<Usuario> usuarios = (q == null || q.isBlank())
                ? usuarioRepo.findAll()
                : usuarioRepo.search(q.trim());
        return usuarios.stream().map(UsuarioService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDTO get(Long id) {
        Usuario u = usuarioRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no existe"));
        return toDto(u);
    }

    @Transactional
    public UsuarioDTO crear(CrearUsuarioRequest req) {
        String dni = req.dni().trim();
        String email = req.email().trim();

        if (usuarioRepo.existsByDniIgnoreCase(dni)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario con ese DNI");
        }
        if (usuarioRepo.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario con ese email");
        }

        Usuario u = new Usuario();
        u.setDni(dni);
        u.setNombre(req.nombre().trim());
        u.setApellidos(req.apellidos().trim());
        u.setEmail(email);
        u.setTipo(req.tipo());
        u.setCurso(clean(req.curso()));
        u.setDepartamento(clean(req.departamento()));
        u.setPuesto(clean(req.puesto()));
        u.setPassword(req.dni());//Para añadir contraseña automática cuando se genere usuario

        return toDto(usuarioRepo.save(u));
    }

    // Actualizamos solo los campos modificados.
    @Transactional
    public UsuarioDTO patch(Long id, UpdateUsuarioRequest req) {
        Usuario u = usuarioRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no existe"));

        if (req.dni() != null) {
            String dni = req.dni().trim();
            if (usuarioRepo.existsByDniIgnoreCaseAndIdNot(dni, id)) {
                throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario con ese DNI");
            }
            u.setDni(dni);
        }

        if (req.email() != null) {
            String email = req.email().trim();
            if (usuarioRepo.existsByEmailIgnoreCaseAndIdNot(email, id)) {
                throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario con ese email");
            }
            u.setEmail(email);
        }

        if (req.nombre() != null) u.setNombre(req.nombre().trim());
        if (req.apellidos() != null) u.setApellidos(req.apellidos().trim());
        if (req.curso() != null) u.setCurso(clean(req.curso()));
        if (req.departamento() != null) u.setDepartamento(clean(req.departamento()));
        if (req.puesto() != null) u.setPuesto(clean(req.puesto()));

        return toDto(usuarioRepo.save(u));
    }

    @Transactional
    public UsuarioDTO cambiarRol(Long id, UpdateUsuarioRolRequest req) {
        Usuario u = usuarioRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no existe"));
        u.setTipo(req.tipo());
        return toDto(usuarioRepo.save(u));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepo.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Usuario no existe");
        }
        usuarioRepo.deleteById(id);
    }

    private static String clean(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isBlank() ? null : t;
    }
}
