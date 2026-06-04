package es.app.biblioteca.dto;

import es.app.biblioteca.model.UsuarioTipo;
import jakarta.validation.constraints.NotNull;

public record UpdateUsuarioRolRequest(
        @NotNull(message = "El rol es obligatorio")
        UsuarioTipo tipo

) {
}
