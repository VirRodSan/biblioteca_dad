package es.app.biblioteca.controller;

import es.app.biblioteca.dto.LoginRequest;
import es.app.biblioteca.dto.LoginResponse;
import es.app.biblioteca.model.Usuario;
import es.app.biblioteca.model.UsuarioTipo;
import es.app.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;

    public AuthController(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        Usuario u = usuarioRepo.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        // Ojo, habría que encriptar con BCrypt ¡Pendiente!
        if (!u.getPassword().equals(req.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        return new LoginResponse(u.getId(), u.getNombre(), u.getApellidos(), u.getEmail(), u.getTipo(), u.getTipo());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse register(@RequestBody LoginRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email es obligatorio");
        }
        if (req.password() == null || req.password().length() < 4) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseÃ±a debe tener al menos 4 caracteres");
        }

        String email = req.email().trim();
        if (usuarioRepo.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese email");
        }

        Usuario u = new Usuario();
        u.setDni(generateRegisterDni(email));
        String nombre = email.substring(0, email.indexOf("@") > 0 ? email.indexOf("@") : email.length());
        u.setNombre(nombre.length() > 20 ? nombre.substring(0, 20) : nombre);
        u.setApellidos("Registro");
        u.setEmail(email);
        u.setPassword(req.password());
        u.setTipo(UsuarioTipo.ALUMNO);

        Usuario saved = usuarioRepo.save(u);
        return new LoginResponse(saved.getId(), saved.getNombre(), saved.getApellidos(), saved.getEmail(), saved.getTipo(), saved.getTipo());
    }

    private String generateRegisterDni(String email) {
        int value = Math.abs(email.toLowerCase().hashCode() % 100000000);
        String dni = "R" + String.format("%08d", value);
        while (usuarioRepo.existsByDniIgnoreCase(dni)) {
            value = Math.abs((value + 1) % 100000000);
            dni = "R" + String.format("%08d", value);
        }
        return dni;
    }
}

