package es.app.biblioteca.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUsuarioRequest(
        @Size(max = 20, message = "El DNI no puede superar 20 caracteres")
        String dni,

        @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
        String nombre,

        @Size(max = 150, message = "Los apellidos no pueden superar 150 caracteres")
        String apellidos,

        @Email(message = "El email no tiene un formato válido")
        @Size(max = 150, message = "El email no puede superar 150 caracteres")
        String email,

        @Size(max = 50, message = "El curso no puede superar 50 caracteres")
        String curso,

        @Size(max = 100, message = "El departamento no puede superar 100 caracteres")
        String departamento,

        @Size(max = 100, message = "El puesto no puede superar 100 caracteres")
        String puesto
        ) {
}
